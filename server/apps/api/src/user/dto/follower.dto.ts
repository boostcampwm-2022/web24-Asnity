import { IsString } from 'class-validator';

export class followerDto {
  @IsString()
  myId: string;

  @IsString()
  followId: string;
}
