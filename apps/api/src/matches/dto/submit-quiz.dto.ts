import {
  IsString,
  IsBoolean,
  IsArray,
  IsOptional,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

export class AnswerItemDto {
  @IsString()
  questionId: string;

  @IsBoolean()
  responderAnswer: boolean;
}

export class SubmitQuizDto {
  @IsString()
  @IsOptional()
  responderDisplayName?: string;

  @IsString()
  @IsOptional()
  responderMoodTag?: string;

  @IsString()
  @IsOptional()
  responderAboutMe?: string;

  @IsString()
  @IsOptional()
  responderSecretMessage?: string;

  @IsBoolean()
  @IsOptional()
  responderSharedContact?: boolean;

  @IsString()
  @IsOptional()
  responderInstagram?: string;

  @IsString()
  @IsOptional()
  responderPhone?: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => AnswerItemDto)
  answers: AnswerItemDto[];
}
