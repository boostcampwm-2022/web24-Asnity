import { Injectable } from '@nestjs/common';
import { IsIn, IsMongoId, IsNotEmpty, IsString } from 'class-validator';
import { Expose } from 'class-transformer';
import { CHAT_TYPE } from '@utils/def';

@Injectable()
export class RestoreMessageDto {
  @IsMongoId()
  @IsNotEmpty()
  channel_id: string;

  @IsIn(CHAT_TYPE)
  @IsNotEmpty()
  type: 'TEXT' | 'IMAGE' | 'SYSTEM';

  @IsString()
  @IsNotEmpty()
  content: string;

  @IsMongoId()
  @IsNotEmpty()
  @Expose({ name: 'requestUserId' })
  senderId: string;
}
