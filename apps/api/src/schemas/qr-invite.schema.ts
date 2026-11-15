import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type QrInviteDocument = QrInvite & Document;

export enum InviteStatus {
  ACTIVE = 'ACTIVE',
  CLAIMED = 'CLAIMED',
  COMPLETED = 'COMPLETED',
  EXPIRED = 'EXPIRED',
  REVOKED = 'REVOKED',
}

export enum ContactUnlockRule {
  MUTUAL_ONLY = 'MUTUAL_ONLY',
  SCORE_THRESHOLD = 'SCORE_THRESHOLD',
  ALWAYS_ON_COMPLETE = 'ALWAYS_ON_COMPLETE',
}

@Schema({ _id: false })
export class CreatorSnapshot {
  @Prop({ required: true })
  name: string;

  @Prop({ default: '😎' })
  avatarEmoji: string;

  @Prop({ default: '' })
  tagline: string;

  @Prop({ default: '' })
  bio: string;

  @Prop({ default: '' })
  secretMessage: string;

  @Prop({ default: '' })
  instagramHandle: string;

  @Prop({ default: '' })
  phoneNumber: string;

  @Prop({
    type: String,
    enum: ContactUnlockRule,
    default: ContactUnlockRule.MUTUAL_ONLY,
  })
  unlockRule: ContactUnlockRule;

  @Prop({ default: 70 })
  minScorePercent: number;
}

export const CreatorSnapshotSchema = SchemaFactory.createForClass(CreatorSnapshot);

@Schema({ _id: false })
export class QuestionItem {
  @Prop({ required: true })
  questionId: string;

  @Prop({ required: true })
  text: string;

  @Prop({ required: true })
  creatorAnswer: boolean;
}

export const QuestionItemSchema = SchemaFactory.createForClass(QuestionItem);

@Schema({ timestamps: true })
export class QrInvite {
  @Prop({ required: true, unique: true, index: true })
  shortCode: string;

  @Prop({ required: true, unique: true, index: true })
  tokenHash: string;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true, index: true })
  creatorId: Types.ObjectId;

  @Prop({ type: String, default: null })
  prefilledFriendName: string | null;

  @Prop({ type: CreatorSnapshotSchema, required: true })
  creatorSnapshot: CreatorSnapshot;

  @Prop({ type: [QuestionItemSchema], default: [] })
  questions: QuestionItem[];

  @Prop({
    type: String,
    enum: InviteStatus,
    default: InviteStatus.ACTIVE,
    index: true,
  })
  status: InviteStatus;

  @Prop({ default: 1, immutable: true })
  maxUses: number;

  @Prop({ default: 0 })
  usedCount: number;

  @Prop({ type: String, default: null })
  claimedBySessionHash: string | null;

  @Prop({ type: Types.ObjectId, ref: 'User', default: null })
  claimedByUserId: Types.ObjectId | null;

  @Prop({ type: Date, default: null })
  claimedAt: Date | null;

  @Prop({ type: Date, default: null, index: true })
  expiresAt: Date | null;

  @Prop({ type: Types.ObjectId, ref: 'MatchConnection', default: null })
  completedMatchId: Types.ObjectId | null;
}

export const QrInviteSchema = SchemaFactory.createForClass(QrInvite);
