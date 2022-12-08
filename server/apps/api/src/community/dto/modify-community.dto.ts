import { IsMongoId, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class ModifyCommunityDto {
  @IsNotEmpty()
  @IsMongoId()
  community_id: string;

  @IsNotEmpty()
  @IsMongoId()
  requestUserId: string;

  @IsOptional()
  @IsString()
  name: string;

  @IsOptional()
  @IsMongoId()
  managerId: string;

  @IsOptional()
  @IsString()
  description: string;

  @IsOptional()
  @IsString()
  profileUrl: string;
}
