import {
  Controller,
  Get,
  Post,
  Patch,
  Body,
  Req,
  Res,
  UseGuards,
  Query,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request, Response } from 'express';
import { ConfigService } from '@nestjs/config';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { CurrentUser } from './decorators/current-user.decorator';
import { UserDocument } from '../schemas/user.schema';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
  ) {}

  @Get('google')
  googleLogin(@Query('state') state: string, @Req() req: Request, @Res() res: Response) {
    // Initiate Google OAuth flow via passport
    const frontendUrl =
      this.configService.get<string>('FRONTEND_URL') || 'http://localhost:3000';
    
    // Passport google auth guard initiates redirection
    const authMiddleware = (AuthGuard('google') as any)({
      state: state || '',
    });
    return authMiddleware(req, res);
  }

  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  async googleCallback(@Req() req: any, @Res() res: Response) {
    const frontendUrl =
      this.configService.get<string>('FRONTEND_URL') || 'http://localhost:3000';

    try {
      const googleProfile = req.user;
      const user = await this.authService.validateGoogleUser(googleProfile);
      const { accessToken, refreshToken } = this.authService.generateTokens(user);

      this.authService.setAuthCookies(res, accessToken, refreshToken);

      // Check if there was a pending match from state or cookies
      const pendingMatchId =
        googleProfile.claimToken || req.cookies?.['pending_match_id'];

      if (pendingMatchId) {
        await this.authService.handlePostOAuthSync(user._id.toString(), pendingMatchId);
        res.clearCookie('pending_match_id', { path: '/' });
        return res.redirect(`${frontendUrl}/match/${pendingMatchId}`);
      }

      return res.redirect(`${frontendUrl}/dashboard`);
    } catch (error) {
      console.error('Google OAuth callback error:', error);
      return res.redirect(`${frontendUrl}/?error=oauth_failed`);
    }
  }

  // Developer mock login for instant testing without configuring Google Cloud Console
  @Post('dev-login')
  async devLogin(
    @Body()
    body: {
      name?: string;
      email?: string;
      avatarUrl?: string;
      pendingMatchId?: string;
    },
    @Res() res: Response,
  ) {
    const email = body.email || 'aarav.vibe@example.com';
    const name = body.name || 'Aarav Sharma';
    const avatarUrl =
      body.avatarUrl ||
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80';

    const user = await this.authService.validateGoogleUser({
      googleId: `dev-google-id-${email}`,
      email,
      name,
      avatarUrl,
    });

    const { accessToken, refreshToken } = this.authService.generateTokens(user);
    this.authService.setAuthCookies(res, accessToken, refreshToken);

    if (body.pendingMatchId) {
      await this.authService.handlePostOAuthSync(
        user._id.toString(),
        body.pendingMatchId,
      );
    }

    return res.json({
      success: true,
      message: 'Logged in successfully',
      accessToken,
      refreshToken,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        avatarUrl: user.avatarUrl,
      },
    });
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  async getMe(@CurrentUser() user: UserDocument) {
    return this.authService.getMe(user._id.toString());
  }

  @Post('logout')
  async logout(@Res() res: Response) {
    this.authService.clearAuthCookies(res);
    return res.json({ success: true, message: 'Logged out successfully' });
  }

  @Patch('profile')
  @UseGuards(JwtAuthGuard)
  async updateProfile(
    @CurrentUser() user: UserDocument,
    @Body()
    body: {
      name?: string;
      tagline?: string;
      bio?: string;
      instagramHandle?: string;
      phoneNumber?: string;
      customAvatarEmoji?: string;
    },
  ) {
    const updated = await this.authService.updateProfile(user._id.toString(), body);
    return { success: true, user: updated };
  }
}
