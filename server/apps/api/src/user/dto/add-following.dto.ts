import { IsString } from 'class-validator';

export class AddFollowingDto {
  @IsString()
  myId: string;

  @IsString()
  followId: string;
}
