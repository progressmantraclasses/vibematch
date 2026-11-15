import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { ConfigService } from '@nestjs/config';
import { Request, Response } from 'express';
import * as crypto from 'crypto';
import {
  MatchConnection,
  MatchConnectionDocument,
} from '../schemas/match-connection.schema';
import {
  QrInvite,
  QrInviteDocument,
  InviteStatus,
  ContactUnlockRule,
} from '../schemas/qr-invite.schema';
import { User, UserDocument } from '../schemas/user.schema';
import { SubmitQuizDto } from './dto/submit-quiz.dto';
import { EventsGateway } from '../gateway/events.gateway';

@Injectable()
export class MatchesService {
  constructor(
    @InjectModel(MatchConnection.name)
    private readonly matchModel: Model<MatchConnectionDocument>,
    @InjectModel(QrInvite.name)
    private readonly inviteModel: Model<QrInviteDocument>,
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
    private readonly configService: ConfigService,
    private readonly eventsGateway: EventsGateway,
  ) {}

  private hashSession(sessionId: string): string {
    return crypto.createHash('sha256').update(sessionId).digest('hex');
  }

  async submitQuiz(
    inviteId: string,
    dto: SubmitQuizDto,
    req: Request,
    res: Response,
    currentUser?: UserDocument,
  ) {
    if (!Types.ObjectId.isValid(inviteId)) {
      throw new BadRequestException('Invalid invite ID');
    }

    const invite = await this.inviteModel.findById(inviteId);
    if (!invite) {
      throw new NotFoundException('Invite not found');
    }

    if (invite.status === InviteStatus.COMPLETED) {
      throw new ForbiddenException({
        code: 'QR_ALREADY_USED',
        message: 'This quiz has already been submitted and completed.',
      });
    }

    if (invite.status === InviteStatus.REVOKED) {
      throw new ForbiddenException({
        code: 'QR_REVOKED',
        message: 'This invite was cancelled by the creator.',
      });
    }

    const now = new Date();
    if (invite.expiresAt && now > invite.expiresAt) {
      invite.status = InviteStatus.EXPIRED;
      await invite.save();
      throw new ForbiddenException({
        code: 'QR_EXPIRED',
        message: 'This invite has expired.',
      });
    }

    // 1. Grade True/False answers
    const questionComparisons = [];
    let sameCount = 0;
    const totalQuestions = invite.questions.length;

    const answerMap = new Map<string, boolean>();
    for (const a of dto.answers) {
      answerMap.set(a.questionId, a.responderAnswer);
    }

    for (const q of invite.questions) {
      const responderAns = answerMap.has(q.questionId)
        ? Boolean(answerMap.get(q.questionId))
        : false;
      const isMatch = responderAns === q.creatorAnswer;
      if (isMatch) sameCount++;

      questionComparisons.push({
        questionId: q.questionId,
        text: q.text,
        creatorAnswer: q.creatorAnswer,
        responderAnswer: responderAns,
        isMatch,
      });
    }

    const compatibilityPercent =
      totalQuestions > 0 ? Math.round((sameCount / totalQuestions) * 100) : 0;

    // 2. Evaluate Contact Unlock Rule
    let creatorContactUnlocked = false;
    const rule = invite.creatorSnapshot.unlockRule;
    const responderProvidedContact =
      Boolean(dto.responderSharedContact) &&
      Boolean(dto.responderInstagram || dto.responderPhone);

    if (rule === ContactUnlockRule.ALWAYS_ON_COMPLETE) {
      creatorContactUnlocked = true;
    } else if (rule === ContactUnlockRule.SCORE_THRESHOLD) {
      creatorContactUnlocked =
        compatibilityPercent >= invite.creatorSnapshot.minScorePercent;
    } else if (rule === ContactUnlockRule.MUTUAL_ONLY) {
      creatorContactUnlocked = responderProvidedContact;
    }

    const responderDisplayName =
      dto.responderDisplayName?.trim() ||
      invite.prefilledFriendName ||
      currentUser?.name ||
      'Mystery Friend';

    // 3. Create MatchConnection
    const match = await this.matchModel.create({
      inviteId: invite._id,
      creatorUserId: invite.creatorId,
      responderUserId: currentUser ? currentUser._id : null,
      responderDisplayName,
      responderMoodTag: dto.responderMoodTag || '💫 Dreamy',
      responderAboutMe: dto.responderAboutMe || '',
      responderSecretMessage: dto.responderSecretMessage || '',
      responderSharedContact: Boolean(dto.responderSharedContact),
      responderInstagram: dto.responderInstagram || null,
      responderPhone: dto.responderPhone || null,
      creatorContactUnlocked,
      questionComparisons,
      sameCount,
      totalQuestions,
      compatibilityPercent,
      isSyncedToBothProfiles: Boolean(currentUser),
    });

    // 4. Burn the QR invite
    invite.status = InviteStatus.COMPLETED;
    invite.usedCount = 1;
    invite.completedMatchId = match._id;
    await invite.save();

    // 5. Dual-Profile Sync if responder is already logged in
    if (currentUser) {
      await this.userModel.findByIdAndUpdate(invite.creatorId, {
        $addToSet: { matches: match._id },
      });
      await this.userModel.findByIdAndUpdate(currentUser._id, {
        $addToSet: { matches: match._id },
      });
    } else {
      // Store pending match ID in cookie so they can log in to sync
      const isProd = this.configService.get<string>('NODE_ENV') === 'production';
      res.cookie('pending_match_id', match._id.toString(), {
        httpOnly: true,
        secure: isProd,
        sameSite: 'lax',
        maxAge: 7 * 24 * 60 * 60 * 1000,
        path: '/',
      });
    }

    // 6. Notify creator in real time
    this.eventsGateway.notifyQuizSubmitted(invite._id.toString(), {
      matchId: match._id,
      responderDisplayName,
      compatibilityPercent,
    });
    this.eventsGateway.notifyMatchReady(invite.creatorId.toString(), {
      matchId: match._id,
      responderDisplayName,
      compatibilityPercent,
    });

    return {
      matchId: match._id,
      compatibilityPercent,
      sameCount,
      totalQuestions,
      creatorContactUnlocked,
      isSyncedToBothProfiles: Boolean(currentUser),
    };
  }

  async bindGoogleProfile(matchId: string, userId: string) {
    if (!Types.ObjectId.isValid(matchId)) {
      throw new BadRequestException('Invalid match ID');
    }

    const match = await this.matchModel.findById(matchId);
    if (!match) {
      throw new NotFoundException('Match not found');
    }

    const userObjId = new Types.ObjectId(userId);

    if (!match.responderUserId) {
      match.responderUserId = userObjId;
      match.isSyncedToBothProfiles = true;
      await match.save();

      // Add to both users
      await this.userModel.findByIdAndUpdate(match.creatorUserId, {
        $addToSet: { matches: match._id },
      });
      await this.userModel.findByIdAndUpdate(userObjId, {
        $addToSet: { matches: match._id },
      });
    }

    return { success: true, message: 'Match synced to both profiles', match };
  }

  async getMyConnections(userId: string) {
    const userObjId = new Types.ObjectId(userId);

    const matches = await this.matchModel
      .find({
        $or: [{ creatorUserId: userObjId }, { responderUserId: userObjId }],
      })
      .populate('creatorUserId', 'name avatarUrl customAvatarEmoji')
      .populate('responderUserId', 'name avatarUrl customAvatarEmoji')
      .sort({ createdAt: -1 })
      .exec();

    return matches.map((m) => {
      const isCreator = m.creatorUserId._id.toString() === userId;
      return {
        id: m._id,
        isCreator,
        partnerName: isCreator
          ? m.responderDisplayName
          : (m.creatorUserId as any).name,
        partnerAvatar: isCreator
          ? (m.responderUserId as any)?.avatarUrl || ''
          : (m.creatorUserId as any)?.avatarUrl || '',
        partnerEmoji: isCreator
          ? (m.responderUserId as any)?.customAvatarEmoji || '💖'
          : (m.creatorUserId as any)?.customAvatarEmoji || '😎',
        compatibilityPercent: m.compatibilityPercent,
        sameCount: m.sameCount,
        totalQuestions: m.totalQuestions,
        createdAt: (m as any).createdAt,
      };
    });
  }

  async getMatchById(matchId: string, requestingUserId?: string) {
    if (!Types.ObjectId.isValid(matchId)) {
      throw new BadRequestException('Invalid match ID');
    }

    const match = await this.matchModel
      .findById(matchId)
      .populate('creatorUserId', 'name avatarUrl customAvatarEmoji tagline bio instagramHandle phoneNumber')
      .populate('responderUserId', 'name avatarUrl customAvatarEmoji tagline bio instagramHandle phoneNumber')
      .populate('inviteId', 'creatorSnapshot shortCode')
      .exec();

    if (!match) {
      throw new NotFoundException('Match not found');
    }

    const invite = match.inviteId as any;
    const creatorUser = match.creatorUserId as any;
    const responderUser = match.responderUserId as any;

    const isCreator = requestingUserId && creatorUser?._id?.toString() === requestingUserId;
    const isResponder = requestingUserId && responderUser?._id?.toString() === requestingUserId;

    // Contact revealing logic
    const canViewCreatorContacts =
      match.creatorContactUnlocked || isCreator;
    const canViewResponderContacts =
      match.responderSharedContact || isResponder;

    return {
      id: match._id,
      shortCode: invite?.shortCode,
      compatibilityPercent: match.compatibilityPercent,
      sameCount: match.sameCount,
      totalQuestions: match.totalQuestions,
      isSyncedToBothProfiles: match.isSyncedToBothProfiles,
      createdAt: (match as any).createdAt,

      creator: {
        name: creatorUser?.name || invite?.creatorSnapshot?.name || 'Creator',
        avatarUrl: creatorUser?.avatarUrl || '',
        emoji: creatorUser?.customAvatarEmoji || invite?.creatorSnapshot?.avatarEmoji || '😎',
        tagline: creatorUser?.tagline || invite?.creatorSnapshot?.tagline || '',
        bio: creatorUser?.bio || invite?.creatorSnapshot?.bio || '',
        secretMessage: invite?.creatorSnapshot?.secretMessage || '',
        contactUnlocked: canViewCreatorContacts,
        instagramHandle: canViewCreatorContacts
          ? creatorUser?.instagramHandle || invite?.creatorSnapshot?.instagramHandle || null
          : null,
        phoneNumber: canViewCreatorContacts
          ? creatorUser?.phoneNumber || invite?.creatorSnapshot?.phoneNumber || null
          : null,
      },

      responder: {
        name: match.responderDisplayName,
        avatarUrl: responderUser?.avatarUrl || '',
        emoji: responderUser?.customAvatarEmoji || '💖',
        moodTag: match.responderMoodTag,
        aboutMe: match.responderAboutMe,
        secretMessage: match.responderSecretMessage,
        contactUnlocked: canViewResponderContacts,
        instagramHandle: canViewResponderContacts
          ? match.responderInstagram
          : null,
        phoneNumber: canViewResponderContacts
          ? match.responderPhone
          : null,
      },

      questionComparisons: match.questionComparisons,
      messages: match.messages || [],
    };
  }

  async getMatchMessages(matchId: string) {
    if (!Types.ObjectId.isValid(matchId)) {
      throw new BadRequestException('Invalid match ID');
    }
    const match = await this.matchModel.findById(matchId).select('messages').exec();
    if (!match) {
      throw new NotFoundException('Match not found');
    }
    return match.messages || [];
  }

  async addMatchMessage(
    matchId: string,
    body: {
      senderName: string;
      senderRole?: string;
      senderAvatar?: string;
      senderEmoji?: string;
      text: string;
    },
  ) {
    if (!Types.ObjectId.isValid(matchId)) {
      throw new BadRequestException('Invalid match ID');
    }
    if (!body?.text?.trim()) {
      throw new BadRequestException('Message text cannot be empty');
    }

    const message = {
      id: crypto.randomUUID(),
      senderName: body.senderName?.trim() || 'Anonymous',
      senderRole: body.senderRole || 'user',
      senderAvatar: body.senderAvatar || '',
      senderEmoji: body.senderEmoji || '💖',
      text: body.text.trim(),
      timestamp: new Date(),
    };

    const match = await this.matchModel.findByIdAndUpdate(
      matchId,
      { $push: { messages: message } },
      { new: true },
    );

    if (!match) {
      throw new NotFoundException('Match not found');
    }

    // Broadcast through socket
    this.eventsGateway.server?.to(`match-${matchId}`).emit('receive-chat-message', message);

    return message;
  }
}
