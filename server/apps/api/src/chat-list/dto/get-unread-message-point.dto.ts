import { Injectable } from '@nestjs/common';
import { IsMongoId, IsNotEmpty } from 'class-validator';

@Injectable()
export class GetUnreadMessagePointDto {
  @IsMongoId()
  @IsNotEmpty()
  requestUserId: string;

  @IsMongoId()
  @IsNotEmpty()
  channel_id: string;
}
