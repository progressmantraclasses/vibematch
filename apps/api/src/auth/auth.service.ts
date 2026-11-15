import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Response } from 'express';
import { User, UserDocument } from '../schemas/user.schema';
import {
  MatchConnection,
  MatchConnectionDocument,
} from '../schemas/match-connection.schema';
import { QrInvite, QrInviteDocument } from '../schemas/qr-invite.schema';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
    @InjectModel(MatchConnection.name)
    private readonly matchModel: Model<MatchConnectionDocument>,
    @InjectModel(QrInvite.name)
    private readonly inviteModel: Model<QrInviteDocument>,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async validateGoogleUser(profile: {
    googleId: string;
    email: string;
    name: string;
    avatarUrl: string;
  }): Promise<UserDocument> {
    let user = await this.userModel.findOne({
      $or: [{ googleId: profile.googleId }, { email: profile.email }],
    });

    if (!user) {
      user = await this.userModel.create({
        googleId: profile.googleId,
        email: profile.email,
        name: profile.name || 'DilSe User',
        avatarUrl: profile.avatarUrl || '',
        customAvatarEmoji: '😎',
        tagline: 'Living life on full vibe ✨',
        bio: '',
        instagramHandle: '',
        phoneNumber: '',
        createdInvites: [],
        matches: [],
      });
    } else {
      // Update googleId or avatar if missing
      if (!user.googleId) user.googleId = profile.googleId;
      if (!user.avatarUrl && profile.avatarUrl) user.avatarUrl = profile.avatarUrl;
      await user.save();
    }

    return user;
  }

  generateTokens(user: UserDocument) {
    const payload = { sub: user._id.toString(), email: user.email };

    const accessToken = this.jwtService.sign(payload, {
      secret:
        this.configService.get<string>('JWT_ACCESS_SECRET') ||
        'dilse_super_secret_jwt_access_key_991823',
      expiresIn: '7d',
    });

    const refreshToken = this.jwtService.sign(payload, {
      secret:
        this.configService.get<string>('JWT_REFRESH_SECRET') ||
        'dilse_super_secret_jwt_refresh_key_849201',
      expiresIn: '30d',
    });

    return { accessToken, refreshToken };
  }

  setAuthCookies(res: Response, accessToken: string, refreshToken: string) {
    const isProd = this.configService.get<string>('NODE_ENV') === 'production';

    res.cookie('access_token', accessToken, {
      httpOnly: true,
      secure: isProd,
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      path: '/',
    });

    res.cookie('refresh_token', refreshToken, {
      httpOnly: true,
      secure: isProd,
      sameSite: 'lax',
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
      path: '/',
    });
  }

  clearAuthCookies(res: Response) {
    res.clearCookie('access_token', { path: '/' });
    res.clearCookie('refresh_token', { path: '/' });
    res.clearCookie('claim_session', { path: '/' });
    res.clearCookie('pending_match_id', { path: '/' });
  }

  async handlePostOAuthSync(userId: string, pendingMatchId?: string) {
    if (!pendingMatchId) return null;

    try {
      const match = await this.matchModel.findById(pendingMatchId);
      if (!match) return null;

      const userObjId = new Types.ObjectId(userId);

      // Bind responder if not yet set
      if (!match.responderUserId) {
        match.responderUserId = userObjId;
        match.isSyncedToBothProfiles = true;
        await match.save();

        // Atomically push match to both users' matches arrays
        await this.userModel.findByIdAndUpdate(match.creatorUserId, {
          $addToSet: { matches: match._id },
        });

        await this.userModel.findByIdAndUpdate(userObjId, {
          $addToSet: { matches: match._id },
        });
      }

      return match;
    } catch (error) {
      console.error('Error syncing post-OAuth match:', error);
      return null;
    }
  }

  async getMe(userId: string) {
    const user = await this.userModel.findById(userId).exec();
    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    const invitesCount = await this.inviteModel.countDocuments({
      creatorId: user._id,
    });
    const matchesCount = await this.matchModel.countDocuments({
      $or: [{ creatorUserId: user._id }, { responderUserId: user._id }],
    });

    return {
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        avatarUrl: user.avatarUrl,
        customAvatarEmoji: user.customAvatarEmoji,
        tagline: user.tagline,
        bio: user.bio,
        instagramHandle: user.instagramHandle,
        phoneNumber: user.phoneNumber,
        createdAt: (user as any).createdAt,
      },
      stats: {
        invitesCount,
        matchesCount,
      },
    };
  }

  async updateProfile(
    userId: string,
    updateData: {
      name?: string;
      tagline?: string;
      bio?: string;
      instagramHandle?: string;
      phoneNumber?: string;
      customAvatarEmoji?: string;
    },
  ) {
    const user = await this.userModel.findByIdAndUpdate(
      userId,
      { $set: updateData },
      { new: true },
    );
    return user;
  }
}
