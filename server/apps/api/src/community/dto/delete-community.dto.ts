import { IsNotEmpty, IsString } from 'class-validator';

export class DeleteCommunityDto {
  @IsNotEmpty()
  @IsString()
  community_id: string;

  @IsNotEmpty()
  @IsString()
  requestUserId: string;
}
