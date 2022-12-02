import { Injectable } from '@nestjs/common';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

@Injectable()
export class UpdateLastReadDto {
  @IsString()
  @IsOptional()
  requestUserId: string;

  @IsString()
  @IsNotEmpty()
  community_id: string;

  @IsString()
  @IsOptional()
  channel_id: string;
}
