import { IsBoolean, IsMongoId, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { Transform } from 'class-transformer';

export class ModifyChannelDto {
  @IsMongoId()
  @IsNotEmpty()
  requestUserId: string;

  @IsMongoId()
  @IsNotEmpty()
  channel_id: string;

  @IsString()
  @IsOptional()
  name: string;

  @IsString()
  @IsOptional()
  description: string;

  @IsBoolean()
  @IsOptional()
  @Transform(({ value }) => value === 'true')
  isPrivate: boolean;

  @IsMongoId()
  @IsOptional()
  managerId: string;
}
