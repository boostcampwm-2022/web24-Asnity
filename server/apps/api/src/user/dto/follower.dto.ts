import { IsString } from 'class-validator';

export class FollowerDto {
  @IsString()
  myId: string;

  @IsString()
  followId: string;
}
