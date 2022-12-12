import { IsMongoId, IsNotEmpty } from 'class-validator';

export class DeleteMessageDto {
  @IsMongoId()
  @IsNotEmpty()
  requestUserId: string;

  @IsMongoId()
  @IsNotEmpty()
  channel_id: string;

  @IsNotEmpty()
  chat_id;
}
