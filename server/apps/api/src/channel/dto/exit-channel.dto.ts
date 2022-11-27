import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class ExitChannelDto {
  @IsString()
  @IsNotEmpty()
  community_id: string;

  @IsString()
  @IsNotEmpty()
  channel_id: string;

  @IsString()
  @IsOptional()
  user_id: string;
}
