import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
  ConnectedSocket,
  MessageBody,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as crypto from 'crypto';
import {
  MatchConnection,
  MatchConnectionDocument,
} from '../schemas/match-connection.schema';

@Injectable()
@WebSocketGateway({
  cors: {
    origin: '*',
    credentials: true,
  },
})
export class EventsGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  constructor(
    @InjectModel(MatchConnection.name)
    private readonly matchModel: Model<MatchConnectionDocument>,
  ) {}

  handleConnection(client: Socket) {
    // Client connected
  }

  handleDisconnect(client: Socket) {
    // Client disconnected
  }

  @SubscribeMessage('join-room')
  handleJoinRoom(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { roomId: string },
  ) {
    if (data?.roomId) {
      client.join(data.roomId);
      client.emit('joined-room', { roomId: data.roomId });
    }
  }

  @SubscribeMessage('join-chat')
  handleJoinChat(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { matchId: string },
  ) {
    if (data?.matchId) {
      const room = `match-${data.matchId}`;
      client.join(room);
      client.emit('joined-chat', { matchId: data.matchId, room });
    }
  }

  @SubscribeMessage('send-chat-message')
  async handleSendChatMessage(
    @ConnectedSocket() client: Socket,
    @MessageBody()
    data: {
      matchId: string;
      senderName: string;
      senderRole?: string;
      senderAvatar?: string;
      senderEmoji?: string;
      text: string;
    },
  ) {
    if (!data?.matchId || !data?.text?.trim()) {
      return;
    }

    const message = {
      id: crypto.randomUUID(),
      senderName: data.senderName?.trim() || 'Anonymous',
      senderRole: data.senderRole || 'user',
      senderAvatar: data.senderAvatar || '',
      senderEmoji: data.senderEmoji || '💖',
      text: data.text.trim(),
      timestamp: new Date(),
    };

    try {
      // Save to database
      await this.matchModel.findByIdAndUpdate(data.matchId, {
        $push: { messages: message },
      });

      // Broadcast to all participants in this match room
      const room = `match-${data.matchId}`;
      this.server.to(room).emit('receive-chat-message', message);
    } catch (err) {
      console.error('Error saving chat message:', err);
    }
  }

  @SubscribeMessage('typing')
  handleTyping(
    @ConnectedSocket() client: Socket,
    @MessageBody()
    data: {
      matchId: string;
      senderName: string;
      isTyping: boolean;
    },
  ) {
    if (data?.matchId) {
      const room = `match-${data.matchId}`;
      client.to(room).emit('user-typing', {
        senderName: data.senderName,
        isTyping: data.isTyping,
      });
    }
  }

  notifyInviteClaimed(inviteId: string, payload: any) {
    if (this.server) {
      this.server.to(inviteId).emit('invite-claimed', payload);
    }
  }

  notifyQuizSubmitted(inviteId: string, payload: any) {
    if (this.server) {
      this.server.to(inviteId).emit('quiz-submitted', payload);
    }
  }

  notifyMatchReady(creatorUserId: string, payload: any) {
    if (this.server) {
      this.server.to(`user-${creatorUserId}`).emit('match-ready', payload);
    }
  }
}
