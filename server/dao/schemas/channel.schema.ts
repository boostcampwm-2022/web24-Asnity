import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { CHANNEL_TYPE } from '@utils/def';
import { IsBoolean, IsIn, IsNotEmpty, IsString, Length } from 'class-validator';

export type ChannelDocument = Channel & Document;

@Schema({ timestamps: true })
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
  })
  @IsString()
  @IsNotEmpty()
  managerId: string;

  @Prop({ default: 'default channel description' })
  @IsString()
  description: string;

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

  @Prop({ type: mongoose.Schema.Types.Date })
  deletedAt: Date;
}
export const ChannelSchema = SchemaFactory.createForClass(Channel);
