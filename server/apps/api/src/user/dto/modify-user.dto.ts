import { IsIn, IsMongoId, IsNotEmpty, IsOptional, IsString, Length } from 'class-validator';
import { STATUS } from '@utils/def';

export class ModifyUserDto {
  @IsNotEmpty()
  @IsMongoId()
  requestUserId: string;

  @IsOptional()
  @IsString()
  @Length(2, 8)
  nickname: string;

  @IsOptional()
  @IsString()
  profileUrl: string;

  @IsOptional()
  @IsString()
  description: string;

  @IsOptional()
  @IsString()
  @IsIn(STATUS)
  status: string;
}
