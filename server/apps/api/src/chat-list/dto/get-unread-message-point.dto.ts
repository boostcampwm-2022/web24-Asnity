import { Injectable } from '@nestjs/common';
import { IsNotEmpty, IsString } from 'class-validator';

@Injectable()
export class GetUnreadMessagePointDto {
  @IsString()
  @IsNotEmpty()
  requestUserId: string;

  @IsString()
  @IsNotEmpty()
  channel_id: string;
}
