import { IsBoolean, IsMongoId, IsNotEmpty, IsOptional, IsString, Length } from 'class-validator';
import { Expose } from 'class-transformer';

export class CreateChannelDto {
  @IsMongoId()
  @IsNotEmpty()
  communityId: string;

  @IsString()
  @Length(2, 20)
  @IsNotEmpty()
  name: string;

  @IsMongoId()
  @IsNotEmpty()
  @Expose({ name: 'requestUserId' })
  managerId: string;

  @IsString()
  @IsNotEmpty()
  nickname: string;

  @IsString()
  @IsNotEmpty()
  type: 'Channel' | 'DM';

  @IsBoolean()
  @IsNotEmpty()
  isPrivate: boolean;

  @IsString()
  @IsOptional()
  description: string;

  @IsOptional()
  users: string[];
}
