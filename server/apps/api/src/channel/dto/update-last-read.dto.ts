import { IsMongoId, IsNotEmpty } from 'class-validator';

export class UpdateLastReadDto {
  @IsMongoId()
  @IsNotEmpty()
  requestUserId: string;

  @IsMongoId()
  @IsNotEmpty()
  community_id: string;

  @IsMongoId()
  @IsNotEmpty()
  channel_id: string;
}
