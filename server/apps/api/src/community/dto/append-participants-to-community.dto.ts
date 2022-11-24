import {
  ArrayNotEmpty,
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class AppendUsersToCommunityDto {
  @IsNotEmpty()
  @IsString()
  community_id: string;

  @IsOptional()
  @IsString()
  requestUser_id: string;

  @IsNotEmpty()
  @IsArray()
  @ArrayNotEmpty()
  users: string[];
}
