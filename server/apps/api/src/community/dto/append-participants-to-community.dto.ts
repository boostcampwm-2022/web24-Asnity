import { ArrayNotEmpty, IsArray, IsMongoId, IsNotEmpty } from 'class-validator';

export class AppendUsersToCommunityDto {
  @IsNotEmpty()
  @IsMongoId()
  community_id: string;

  @IsNotEmpty()
  @IsMongoId()
  requestUserId: string;

  @IsNotEmpty()
  @IsArray()
  @ArrayNotEmpty()
  users: string[];
}
