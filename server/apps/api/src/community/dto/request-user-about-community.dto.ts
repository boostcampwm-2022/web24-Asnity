import { IsNotEmpty, IsString } from 'class-validator';

export class RequestUserAboutCommunityDto {
  @IsNotEmpty()
  @IsString()
  community_id: string;

  @IsNotEmpty()
  @IsString()
  requestUser_id: string;
}
