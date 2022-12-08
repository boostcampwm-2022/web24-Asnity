import { IsMongoId, IsNotEmpty } from 'class-validator';

export class DeleteChannelDto {
  @IsMongoId()
  @IsNotEmpty()
  channel_id: string;

  @IsMongoId()
  @IsNotEmpty()
  requestUserId: string;
}
