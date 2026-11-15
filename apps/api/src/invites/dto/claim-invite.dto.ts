import { IsString, IsNotEmpty } from 'class-validator';

export class ClaimInviteDto {
  @IsString()
  @IsNotEmpty()
  token: string;
}
