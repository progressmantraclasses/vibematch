import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { ConfigService } from '@nestjs/config';
import { Response, Request } from 'express';
import * as crypto from 'crypto';
import {
  QrInvite,
  QrInviteDocument,
  InviteStatus,
  ContactUnlockRule,
} from '../schemas/qr-invite.schema';
import { User, UserDocument } from '../schemas/user.schema';
import { CreateInviteDto } from './dto/create-invite.dto';
import { EventsGateway } from '../gateway/events.gateway';

@Injectable()
export class InvitesService {
  constructor(
    @InjectModel(QrInvite.name)
    private readonly inviteModel: Model<QrInviteDocument>,
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
    private readonly configService: ConfigService,
    private readonly eventsGateway: EventsGateway,
  ) {}

  private hashToken(rawToken: string): string {
    return crypto.createHash('sha256').update(rawToken).digest('hex');
  }

  private hashSession(sessionId: string): string {
    return crypto.createHash('sha256').update(sessionId).digest('hex');
  }

  private generateShortCode(): string {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let code = '';
    for (let i = 0; i < 5; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return `VIBE-${code}`;
  }

  async createInvite(userId: string, dto: CreateInviteDto) {
    const creator = await this.userModel.findById(userId);
    if (!creator) {
      throw new NotFoundException('Creator not found');
    }

    // 1. Generate 256-bit cryptographically secure raw token
    const rawToken = crypto.randomBytes(32).toString('base64url');
    const tokenHash = this.hashToken(rawToken);
    const shortCode = this.generateShortCode();

    // 2. Calculate optional expiration
    let expiresAt: Date | null = null;
    if (dto.expiresInMinutes && dto.expiresInMinutes > 0) {
      expiresAt = new Date(Date.now() + dto.expiresInMinutes * 60 * 1000);
    }

    // 3. Assemble creator snapshot
    const creatorSnapshot = {
      name: dto.creatorSnapshot?.name || creator.name,
      avatarEmoji: dto.creatorSnapshot?.avatarEmoji || creator.customAvatarEmoji || '😎',
      tagline: dto.creatorSnapshot?.tagline || creator.tagline || 'Ready to vibe!',
      bio: dto.creatorSnapshot?.bio || creator.bio || '',
      secretMessage: dto.creatorSnapshot?.secretMessage || '',
      instagramHandle: dto.creatorSnapshot?.instagramHandle || creator.instagramHandle || '',
      phoneNumber: dto.creatorSnapshot?.phoneNumber || creator.phoneNumber || '',
      unlockRule: dto.creatorSnapshot?.unlockRule || ContactUnlockRule.MUTUAL_ONLY,
      minScorePercent: dto.creatorSnapshot?.minScorePercent ?? 70,
    };

    // 4. Save QrInvite
    const invite = await this.inviteModel.create({
      shortCode,
      tokenHash,
      creatorId: creator._id,
      prefilledFriendName: dto.prefilledFriendName ? dto.prefilledFriendName.trim() : null,
      creatorSnapshot,
      questions: dto.questions,
      status: InviteStatus.ACTIVE,
      maxUses: 1,
      usedCount: 0,
      expiresAt,
    });

    // 5. Link to creator's profile
    await this.userModel.findByIdAndUpdate(creator._id, {
      $push: { createdInvites: invite._id },
    });

    const frontendUrl =
      this.configService.get<string>('FRONTEND_URL') || 'http://localhost:3000';
    const shareUrl = `${frontendUrl}/invite/${invite._id}?t=${rawToken}`;

    return {
      inviteId: invite._id,
      shortCode: invite.shortCode,
      rawToken,
      shareUrl,
      prefilledFriendName: invite.prefilledFriendName,
      expiresAt: invite.expiresAt,
      status: invite.status,
      totalQuestions: invite.questions.length,
    };
  }

  async getMyInvites(userId: string) {
    const invites = await this.inviteModel
      .find({ creatorId: new Types.ObjectId(userId) })
      .sort({ createdAt: -1 })
      .exec();

    const now = new Date();

    // Check for auto-expired invites
    for (const inv of invites) {
      if (
        inv.status === InviteStatus.ACTIVE &&
        inv.expiresAt &&
        now > inv.expiresAt
      ) {
        inv.status = InviteStatus.EXPIRED;
        await inv.save();
      }
    }

    return invites.map((inv) => ({
      id: inv._id,
      shortCode: inv.shortCode,
      prefilledFriendName: inv.prefilledFriendName,
      status: inv.status,
      expiresAt: inv.expiresAt,
      claimedAt: inv.claimedAt,
      completedMatchId: inv.completedMatchId,
      createdAt: (inv as any).createdAt,
      questionCount: inv.questions.length,
    }));
  }

  async revokeInvite(inviteId: string, userId: string) {
    const invite = await this.inviteModel.findOne({
      _id: inviteId,
      creatorId: new Types.ObjectId(userId),
    });

    if (!invite) {
      throw new NotFoundException('Invite not found');
    }

    if (invite.status === InviteStatus.COMPLETED) {
      throw new BadRequestException('Cannot revoke an already completed match');
    }

    invite.status = InviteStatus.REVOKED;
    await invite.save();

    return { success: true, message: 'Invite successfully revoked' };
  }

  async claimInvite(
    inviteId: string,
    rawToken: string,
    req: Request,
    res: Response,
    currentUser?: UserDocument,
  ) {
    if (!Types.ObjectId.isValid(inviteId)) {
      throw new BadRequestException('Invalid invite identifier');
    }

    const invite = await this.inviteModel.findById(inviteId);
    if (!invite) {
      throw new NotFoundException('Invite not found');
    }

    // 1. Verify token
    const tokenHash = this.hashToken(rawToken);
    if (invite.tokenHash !== tokenHash) {
      throw new ForbiddenException({
        code: 'INVALID_TOKEN',
        message: 'Invalid or forged security token for this QR invite.',
      });
    }

    const now = new Date();

    // 2. Check Expiry
    if (invite.expiresAt && now > invite.expiresAt) {
      if (invite.status === InviteStatus.ACTIVE) {
        invite.status = InviteStatus.EXPIRED;
        await invite.save();
      }
      throw new ForbiddenException({
        code: 'QR_EXPIRED',
        message: '⏳ This secret QR invite has expired and can no longer be used.',
        expiresAt: invite.expiresAt,
      });
    }

    // 3. Check Revocation
    if (invite.status === InviteStatus.REVOKED) {
      throw new ForbiddenException({
        code: 'QR_REVOKED',
        message: '🛑 This QR invite was cancelled by the creator.',
      });
    }

    // 4. Check Completed
    if (invite.status === InviteStatus.COMPLETED) {
      throw new ForbiddenException({
        code: 'QR_ALREADY_USED',
        message: '🔒 This Private QR Invite was created for one specific person and has already been completed.',
      });
    }

    // 5. If Creator is previewing their own invite, allow them without consuming
    const isCreator =
      currentUser &&
      invite.creatorId &&
      currentUser._id.toString() === invite.creatorId.toString();

    const existingSession = req.cookies?.['claim_session'];
    const newClaimSession = existingSession || crypto.randomUUID();
    const sessionHash = this.hashSession(newClaimSession);

    if (!isCreator) {
      // Mark as CLAIMED or update claim session if not completed
      await this.inviteModel.findByIdAndUpdate(invite._id, {
        $set: {
          status: InviteStatus.CLAIMED,
          claimedBySessionHash: sessionHash,
          claimedByUserId: currentUser ? currentUser._id : invite.claimedByUserId,
          claimedAt: invite.claimedAt || now,
        },
      });

      const isProd = this.configService.get<string>('NODE_ENV') === 'production';
      res.cookie('claim_session', newClaimSession, {
        httpOnly: true,
        secure: isProd,
        sameSite: 'lax',
        maxAge: 24 * 60 * 60 * 1000,
        path: '/',
      });

      // Notify the creator in real time via WebSockets
      this.eventsGateway.notifyInviteClaimed(invite._id.toString(), {
        inviteId: invite._id,
        shortCode: invite.shortCode,
        claimedAt: now,
      });
    }

    // 7. Return sanitized invite metadata (WITHOUT answers, secret note, or creator contacts!)
    return {
      inviteId: invite._id,
      shortCode: invite.shortCode,
      status: invite.status,
      prefilledFriendName: invite.prefilledFriendName,
      expiresAt: invite.expiresAt,
      creator: {
        name: invite.creatorSnapshot.name,
        avatarEmoji: invite.creatorSnapshot.avatarEmoji,
        tagline: invite.creatorSnapshot.tagline,
        bio: invite.creatorSnapshot.bio,
      },
      // Questions without creatorAnswer
      questions: invite.questions.map((q) => ({
        questionId: q.questionId,
        text: q.text,
      })),
    };
  }
}
