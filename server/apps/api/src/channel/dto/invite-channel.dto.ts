import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class InviteChannelDto {
  @IsString()
  @IsNotEmpty()
  community_id: string;

  @IsString()
  @IsOptional()
  channel_id: string;

  @IsNotEmpty()
  users: string[];
}
