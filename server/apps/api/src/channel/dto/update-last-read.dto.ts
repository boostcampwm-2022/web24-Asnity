import { Injectable } from '@nestjs/common';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

@Injectable()
export class UpdateLastReadDto {
  @IsString()
  @IsOptional()
  user_id: string;

  @IsString()
  @IsNotEmpty()
  community_id: string;

  @IsString()
  @IsNotEmpty()
  channel_id: string;
}
