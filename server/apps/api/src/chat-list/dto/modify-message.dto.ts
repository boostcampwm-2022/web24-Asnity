import { Injectable } from '@nestjs/common';
import { IsMongoId, IsNotEmpty, IsString } from 'class-validator';

@Injectable()
export class ModifyMessageDto {
  @IsMongoId()
  @IsNotEmpty()
  requestUserId: string;

  @IsMongoId()
  @IsNotEmpty()
  channel_id: string;

  @IsNotEmpty()
  chat_id;

  @IsString()
  @IsNotEmpty()
  content: string;
}
