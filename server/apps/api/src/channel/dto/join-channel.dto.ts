import { IsMongoId, IsNotEmpty } from 'class-validator';

export class JoinChannelDto {
  @IsMongoId()
  @IsNotEmpty()
  requestUserId: string;

  @IsMongoId()
  @IsNotEmpty()
  channel_id: string;

  @IsMongoId()
  @IsNotEmpty()
  community_id: string;
}
