import { IsBoolean, IsNotEmpty, IsOptional, IsString, Length } from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateChannelDto {
  @IsString()
  @IsNotEmpty()
  communityId: string;

  @IsString()
  @Length(2, 20)
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsOptional()
  managerId: string;

  @IsString()
  @IsOptional()
  description: string;

  @IsString()
  @IsOptional()
  profileUrl: string;

  @IsString()
  @IsNotEmpty()
  type: 'Channel' | 'DM';

  @IsBoolean()
  @IsNotEmpty()
  @Transform(({ value }) => value === 'true')
  isPrivate: boolean;

  @IsOptional()
  users: string[];
}
