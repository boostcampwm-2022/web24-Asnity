import { Injectable } from '@nestjs/common';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

@Injectable()
export class RestoreMessageDto {
  @IsString()
  @IsOptional()
  channel_id: string;

  @IsString()
  @IsNotEmpty()
  type: 'TEXT' | 'IMAGE';

  @IsString()
  @IsNotEmpty()
  content: string;

  @IsString()
  @IsOptional()
  senderId: string;
}
