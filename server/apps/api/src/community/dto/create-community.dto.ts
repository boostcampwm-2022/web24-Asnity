import { IsMongoId, IsNotEmpty, IsOptional, IsString, Length } from 'class-validator';
import { Expose } from 'class-transformer';

export class CreateCommunityDto {
  @IsNotEmpty()
  @IsString()
  @Length(2, 20)
  name: string;

  @IsMongoId()
  @IsNotEmpty()
  @Expose({ name: 'requestUserId' })
  managerId: string;

  @IsOptional()
  @IsString()
  description: string;

  @IsOptional()
  @IsString()
  profileUrl: string;

  @IsOptional()
  users: string[];
}
