import { IsNotEmpty, IsString } from 'class-validator';

export class JoinChannelDto {
  @IsString()
  @IsNotEmpty()
  requestUserId: string;

  @IsString()
  @IsNotEmpty()
  channel_id: string;

  @IsString()
  @IsNotEmpty()
  community_id: string;
}
