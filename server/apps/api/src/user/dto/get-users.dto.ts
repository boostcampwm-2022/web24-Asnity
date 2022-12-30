import { IsMongoId, IsNotEmpty, IsString } from 'class-validator';

export class GetUsersDto {
  @IsNotEmpty()
  @IsString()
  id: string;

  @IsNotEmpty()
  @IsMongoId()
  requestUserId: string;
}
