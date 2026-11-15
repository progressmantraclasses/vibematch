import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type UserDocument = User & Document;

@Schema({ timestamps: true })
export class User {
  @Prop({ required: true, unique: true, index: true })
  googleId: string;

  @Prop({ required: true, unique: true, index: true })
  email: string;

  @Prop({ required: true })
  name: string;

  @Prop({ default: '' })
  avatarUrl: string;

  @Prop({ default: '😎' })
  customAvatarEmoji: string;

  @Prop({ default: 'Living life on full volume ✨' })
  tagline: string;

  @Prop({ default: '' })
  bio: string;

  @Prop({ default: '' })
  instagramHandle: string;

  @Prop({ default: '' })
  phoneNumber: string;

  @Prop({ type: [{ type: Types.ObjectId, ref: 'QrInvite' }], default: [] })
  createdInvites: Types.ObjectId[];

  @Prop({ type: [{ type: Types.ObjectId, ref: 'MatchConnection' }], default: [] })
  matches: Types.ObjectId[];
}

export const UserSchema = SchemaFactory.createForClass(User);
