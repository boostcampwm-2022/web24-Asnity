import { IsMongoId, IsNotEmpty } from 'class-validator';

export class InviteChannelDto {
  @IsMongoId()
  @IsNotEmpty()
  community_id: string;

  @IsMongoId()
  @IsNotEmpty()
  channel_id: string;

  @IsNotEmpty()
  users: string[];
}
