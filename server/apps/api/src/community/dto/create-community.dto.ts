import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateCommunityDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
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
