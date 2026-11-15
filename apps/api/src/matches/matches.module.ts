import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MatchesController } from './matches.controller';
import { MatchesService } from './matches.service';
import { MatchConnection, MatchConnectionSchema } from '../schemas/match-connection.schema';
import { QrInvite, QrInviteSchema } from '../schemas/qr-invite.schema';
import { User, UserSchema } from '../schemas/user.schema';
import { GatewayModule } from '../gateway/gateway.module';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: MatchConnection.name, schema: MatchConnectionSchema },
      { name: QrInvite.name, schema: QrInviteSchema },
      { name: User.name, schema: UserSchema },
    ]),
    GatewayModule,
    AuthModule,
  ],
  controllers: [MatchesController],
  providers: [MatchesService],
  exports: [MatchesService],
})
export class MatchesModule {}
