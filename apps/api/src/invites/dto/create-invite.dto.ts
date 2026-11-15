import {
  IsString,
  IsOptional,
  IsArray,
  IsEnum,
  IsNumber,
  ValidateNested,
  IsBoolean,
  Min,
  Max,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ContactUnlockRule } from '../../schemas/qr-invite.schema';

export class QuestionItemDto {
  @IsString()
  questionId: string;

  @IsString()
  text: string;

  @IsBoolean()
  creatorAnswer: boolean;
}

export class CreatorSnapshotDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  avatarEmoji?: string;

  @IsString()
  @IsOptional()
  tagline?: string;

  @IsString()
  @IsOptional()
  bio?: string;

  @IsString()
  @IsOptional()
  secretMessage?: string;

  @IsString()
  @IsOptional()
  instagramHandle?: string;

  @IsString()
  @IsOptional()
  phoneNumber?: string;

  @IsEnum(ContactUnlockRule)
  @IsOptional()
  unlockRule?: ContactUnlockRule;

  @IsNumber()
  @IsOptional()
  @Min(0)
  @Max(100)
  minScorePercent?: number;
}

export class CreateInviteDto {
  @IsString()
  @IsOptional()
  prefilledFriendName?: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => QuestionItemDto)
  questions: QuestionItemDto[];

  @ValidateNested()
  @Type(() => CreatorSnapshotDto)
  @IsOptional()
  creatorSnapshot?: CreatorSnapshotDto;

  @IsNumber()
  @IsOptional()
  expiresInMinutes?: number; // 15, 60, 360, 1440, 10080, or null/undefined
}
