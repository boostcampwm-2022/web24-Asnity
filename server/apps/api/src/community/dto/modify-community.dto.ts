import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class ModifyCommunityDto {
  @IsOptional()
  @IsString()
  community_id: string;

  @IsOptional()
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
  @IsString()
  requestUserId: string;
}
