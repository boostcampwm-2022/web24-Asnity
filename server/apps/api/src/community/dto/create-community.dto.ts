import { IsMongoId, IsNotEmpty, IsOptional, IsString, Length } from 'class-validator';

export class CreateCommunityDto {
  @IsNotEmpty()
  @IsString()
  @Length(2, 20)
  name: string;

  @IsOptional()
  @IsMongoId()
  requestUserId: string;

  @IsOptional()
  @IsMongoId()
  managerId: string;

  @IsOptional()
  @IsString()
  description: string;

  @IsOptional()
  @IsString()
  profileUrl: string;

  @IsOptional()
  users: string[];
}
