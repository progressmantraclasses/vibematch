import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-google-oauth20';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(private readonly configService: ConfigService) {
    super({
      clientID:
        configService.get<string>('GOOGLE_CLIENT_ID') ||
        'placeholder-google-client-id.apps.googleusercontent.com',
      clientSecret:
        configService.get<string>('GOOGLE_CLIENT_SECRET') ||
        'placeholder-google-client-secret',
      callbackURL:
        configService.get<string>('GOOGLE_CALLBACK_URL') ||
        'http://localhost:4000/api/auth/google/callback',
      scope: ['email', 'profile'],
      passReqToCallback: true,
    });
  }

  async validate(
    req: any,
    accessToken: string,
    refreshToken: string,
    profile: any,
    done: VerifyCallback,
  ): Promise<any> {
    const { id, name, emails, photos } = profile;
    const user = {
      googleId: id,
      email: emails && emails[0] ? emails[0].value : '',
      name: `${name?.givenName || ''} ${name?.familyName || ''}`.trim() || 'Vibe Seeker',
      avatarUrl: photos && photos[0] ? photos[0].value : '',
      claimToken: req.query?.state || null,
    };
    done(null, user);
  }
}
