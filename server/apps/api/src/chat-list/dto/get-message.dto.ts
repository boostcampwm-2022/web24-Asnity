import { IsMongoId, IsNotEmpty, IsOptional } from 'class-validator';

export class GetMessageDto {
  @IsOptional()
  prev: number | undefined;

  @IsOptional()
  next: number | undefined;

  @IsMongoId()
  @IsNotEmpty()
  requestUserId: string;

  @IsMongoId()
  @IsNotEmpty()
  channel_id: string;
}
