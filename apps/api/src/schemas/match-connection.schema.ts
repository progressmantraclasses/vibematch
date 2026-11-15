import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type MatchConnectionDocument = MatchConnection & Document;

@Schema({ _id: false })
export class QuestionComparison {
  @Prop({ required: true })
  questionId: string;

  @Prop({ required: true })
  text: string;

  @Prop({ required: true })
  creatorAnswer: boolean;

  @Prop({ required: true })
  responderAnswer: boolean;

  @Prop({ required: true })
  isMatch: boolean;
}

export const QuestionComparisonSchema = SchemaFactory.createForClass(QuestionComparison);

@Schema({ _id: false })
export class ChatMessage {
  @Prop({ required: true })
  id: string;

  @Prop({ required: true })
  senderName: string;

  @Prop({ default: '' })
  senderAvatar: string;

  @Prop({ default: '💖' })
  senderEmoji: string;

  @Prop({ default: 'user' })
  senderRole: string; // 'creator' | 'responder' | 'user'

  @Prop({ required: true })
  text: string;

  @Prop({ default: Date.now })
  timestamp: Date;
}

export const ChatMessageSchema = SchemaFactory.createForClass(ChatMessage);

@Schema({ timestamps: true })
export class MatchConnection {
  @Prop({ type: Types.ObjectId, ref: 'QrInvite', required: true, unique: true })
  inviteId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true, index: true })
  creatorUserId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'User', default: null, index: true })
  responderUserId: Types.ObjectId | null;

  @Prop({ required: true })
  responderDisplayName: string;

  @Prop({ default: '💫 Dreamy' })
  responderMoodTag: string;

  @Prop({ default: '' })
  responderAboutMe: string;

  @Prop({ default: '' })
  responderSecretMessage: string;

  @Prop({ default: false })
  responderSharedContact: boolean;

  @Prop({ type: String, default: null })
  responderInstagram: string | null;

  @Prop({ type: String, default: null })
  responderPhone: string | null;

  @Prop({ default: false })
  creatorContactUnlocked: boolean;

  @Prop({ type: [QuestionComparisonSchema], default: [] })
  questionComparisons: QuestionComparison[];

  @Prop({ required: true })
  sameCount: number;

  @Prop({ required: true })
  totalQuestions: number;

  @Prop({ required: true })
  compatibilityPercent: number;

  @Prop({ default: false })
  isSyncedToBothProfiles: boolean;

  @Prop({ type: [ChatMessageSchema], default: [] })
  messages: ChatMessage[];
}

export const MatchConnectionSchema = SchemaFactory.createForClass(MatchConnection);
