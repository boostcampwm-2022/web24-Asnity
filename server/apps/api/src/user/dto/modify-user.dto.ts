import {
  IsEmail,
  IsIn,
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
  Min,
  MinLength,
} from 'class-validator';
import { PROVIDER, STATUS } from '@utils/def';
import { Prop } from '@nestjs/mongoose';

export class ModifyUserDto {
  @IsOptional()
  @IsString()
  _id: string;

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
