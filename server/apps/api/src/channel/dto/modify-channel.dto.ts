import { IsBoolean, IsOptional, IsString } from 'class-validator';
import { Transform } from 'class-transformer';

export class ModifyChannelDto {
  @IsString()
  @IsOptional()
  channel_id: string;

  @IsString()
  @IsOptional()
  name: string;

  @IsString()
  @IsOptional()
  requestUserId: string;

  @IsString()
  @IsOptional()
  description: string;

  @IsBoolean()
  @IsOptional()
  @Transform(({ value }) => value === 'true')
  isPrivate: boolean;

  @IsString()
  @IsOptional()
  managerId: string;
}
