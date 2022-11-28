import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class InviteChannelDto {
  @IsString()
  @IsNotEmpty()
  community_id: string;

  @IsString()
  @IsNotEmpty()
  channel_id: string;

  @IsString()
  @IsOptional()
  inviteUserId: string;
}
