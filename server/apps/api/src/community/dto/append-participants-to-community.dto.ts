import {
  ArrayNotEmpty,
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class AppendUsersToCommunityDto {
  @IsOptional()
  @IsString()
  community_id: string;

  @IsOptional()
  @IsString()
  requestUserId: string;

  @IsNotEmpty()
  @IsArray()
  @ArrayNotEmpty()
  users: string[];
}
