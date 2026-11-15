import {
  Controller,
  Post,
  Get,
  Param,
  Body,
  UseGuards,
  Req,
  Res,
} from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import { Request, Response } from 'express';
import { MatchesService } from './matches.service';
import { SubmitQuizDto } from './dto/submit-quiz.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { OptionalAuthGuard } from '../auth/guards/optional-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { UserDocument } from '../schemas/user.schema';

@Controller()
export class MatchesController {
  constructor(private readonly matchesService: MatchesService) {}

  @Post('invites/:id/submit')
  @Throttle({ default: { limit: 10, ttl: 60000 } })
  @UseGuards(OptionalAuthGuard)
  async submitQuiz(
    @Param('id') inviteId: string,
    @Body() dto: SubmitQuizDto,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
    @CurrentUser() user?: UserDocument,
  ) {
    return this.matchesService.submitQuiz(inviteId, dto, req, res, user);
  }

  @Post('matches/:matchId/bind-google-profile')
  @UseGuards(JwtAuthGuard)
  async bindGoogleProfile(
    @Param('matchId') matchId: string,
    @CurrentUser() user: UserDocument,
  ) {
    return this.matchesService.bindGoogleProfile(matchId, user._id.toString());
  }

  @Get('matches/my-connections')
  @UseGuards(JwtAuthGuard)
  async getMyConnections(@CurrentUser() user: UserDocument) {
    return this.matchesService.getMyConnections(user._id.toString());
  }

  @Get('matches/:matchId')
  @UseGuards(OptionalAuthGuard)
  async getMatchById(
    @Param('matchId') matchId: string,
    @CurrentUser() user?: UserDocument,
  ) {
    return this.matchesService.getMatchById(matchId, user?._id?.toString());
  }

  @Get('matches/:matchId/messages')
  @UseGuards(OptionalAuthGuard)
  async getMatchMessages(@Param('matchId') matchId: string) {
    return this.matchesService.getMatchMessages(matchId);
  }

  @Post('matches/:matchId/messages')
  @UseGuards(OptionalAuthGuard)
  async addMatchMessage(
    @Param('matchId') matchId: string,
    @Body()
    body: {
      senderName: string;
      senderRole?: string;
      senderAvatar?: string;
      senderEmoji?: string;
      text: string;
    },
  ) {
    return this.matchesService.addMatchMessage(matchId, body);
  }
}
