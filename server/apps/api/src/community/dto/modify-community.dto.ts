import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class ModifyCommunityDto {
  @IsNotEmpty()
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
}
