import { IsMongoId, IsNotEmpty } from 'class-validator';

export class DeleteCommunityDto {
  @IsNotEmpty()
  @IsMongoId()
  community_id: string;

  @IsNotEmpty()
  @IsMongoId()
  requestUserId: string;
}
