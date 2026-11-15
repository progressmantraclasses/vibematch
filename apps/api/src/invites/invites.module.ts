import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { InvitesController } from './invites.controller';
import { InvitesService } from './invites.service';
import { QrInvite, QrInviteSchema } from '../schemas/qr-invite.schema';
import { User, UserSchema } from '../schemas/user.schema';
import { GatewayModule } from '../gateway/gateway.module';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: QrInvite.name, schema: QrInviteSchema },
      { name: User.name, schema: UserSchema },
    ]),
    GatewayModule,
    AuthModule,
  ],
  controllers: [InvitesController],
  providers: [InvitesService],
  exports: [InvitesService],
})
export class InvitesModule {}
