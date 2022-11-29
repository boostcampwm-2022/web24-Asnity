import { IsNotEmpty, IsString } from 'class-validator';

export class DeleteChannelDto {
  @IsString()
  @IsNotEmpty()
  channel_id: string;

  @IsString()
  @IsNotEmpty()
  requestUserId: string;
}
