import { IsMongoId, IsNotEmpty } from 'class-validator';

export class RequestUserAboutCommunityDto {
  @IsNotEmpty()
  @IsMongoId()
  community_id: string;

  @IsNotEmpty()
  @IsMongoId()
  requestUserId: string;
}
