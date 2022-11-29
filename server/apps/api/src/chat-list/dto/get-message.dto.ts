import { IsOptional, IsString } from 'class-validator';

export class GetMessageDto {
  @IsOptional()
  prev: number | undefined;

  @IsOptional()
  next: number | undefined;

  @IsString()
  @IsOptional()
  requestUserId: string;

  @IsString()
  @IsOptional()
  channel_id: string;
}
