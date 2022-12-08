import { IsMongoId, IsNotEmpty } from 'class-validator';

export class ExitChannelDto {
  @IsMongoId()
  @IsNotEmpty()
  channel_id: string;

  @IsMongoId()
  @IsNotEmpty()
  requestUserId: string;
}
