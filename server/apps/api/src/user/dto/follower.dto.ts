import { IsMongoId, IsNotEmpty } from 'class-validator';

export class FollowerDto {
  @IsNotEmpty()
  @IsMongoId()
  requestUserId: string;

  @IsNotEmpty()
  @IsMongoId()
  followId: string;
}
