import {
  Controller,
  Post,
  Get,
  Patch,
  Body,
  Param,
  UseGuards,
  Req,
  Res,
} from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import { Request, Response } from 'express';
import { InvitesService } from './invites.service';
import { CreateInviteDto } from './dto/create-invite.dto';
import { ClaimInviteDto } from './dto/claim-invite.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { OptionalAuthGuard } from '../auth/guards/optional-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { UserDocument } from '../schemas/user.schema';

@Controller('invites')
export class InvitesController {
  constructor(private readonly invitesService: InvitesService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  async createInvite(
    @CurrentUser() user: UserDocument,
    @Body() dto: CreateInviteDto,
  ) {
    return this.invitesService.createInvite(user._id.toString(), dto);
  }

  @Get('my')
  @UseGuards(JwtAuthGuard)
  async getMyInvites(@CurrentUser() user: UserDocument) {
    return this.invitesService.getMyInvites(user._id.toString());
  }

  @Patch(':id/revoke')
  @UseGuards(JwtAuthGuard)
  async revokeInvite(
    @Param('id') id: string,
    @CurrentUser() user: UserDocument,
  ) {
    return this.invitesService.revokeInvite(id, user._id.toString());
  }

  @Post(':id/claim')
  @Throttle({ default: { limit: 15, ttl: 60000 } })
  @UseGuards(OptionalAuthGuard)
  async claimInvite(
    @Param('id') id: string,
    @Body() dto: ClaimInviteDto,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
    @CurrentUser() user?: UserDocument,
  ) {
    return this.invitesService.claimInvite(id, dto.token, req, res, user);
  }
}
