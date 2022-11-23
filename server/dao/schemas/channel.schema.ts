import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { CHANNEL_TYPE } from '@utils/def';
import { IsBoolean, IsIn, IsNotEmpty, IsString, Length } from 'class-validator';

export type ChannelDocument = Channel & Document;

@Schema()
export class Channel {
  @Prop({
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  @Length(2, 20)
  name: string;

  @Prop({
    required: true,
  })
  @IsString()
  communityId: string;

  @Prop({
    required: true,
    unique: true,
  })
  @IsString()
  @IsNotEmpty()
  managerId: string;

  @Prop({ default: 'default channel description' })
  @IsString()
  description: string;

  @Prop({ default: 'default channel profile' })
  @IsString()
  profileUrl: string;

  @Prop()
  @IsIn(CHANNEL_TYPE)
  type: string;

  @Prop({ required: true })
  @IsBoolean()
  isPrivate: boolean;

  @Prop()
  @IsString()
  users: string[];

  @Prop()
  @IsString()
  chatLists: string[];
}
export const ChannelSchema = SchemaFactory.createForClass(Channel);
