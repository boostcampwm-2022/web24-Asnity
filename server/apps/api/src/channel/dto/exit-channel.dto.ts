import { IsNotEmpty, IsString } from 'class-validator';

export class ExitChannelDto {
  @IsString()
  @IsNotEmpty()
  channel_id: string;

  @IsString()
  @IsNotEmpty()
  requestUserId: string;
}
