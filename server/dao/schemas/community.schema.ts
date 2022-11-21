import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { IsNotEmpty, IsString } from 'class-validator';

export type CommunityDocument = Community & Document;

@Schema()
export class Community {
  @Prop()
  @IsString()
  @IsNotEmpty()
  name: string;

  @Prop({
    required: true,
    unique: true,
  })
  @IsString()
  @IsNotEmpty()
  managerId: string;

  @Prop({ default: 'default community description' })
  @IsString()
  description: string;

  @Prop({ default: 'default community profile' })
  @IsString()
  profileUrl: string;

  @Prop({ default: new Date(), type: mongoose.Schema.Types.Date })
  createdAt: Date;

  @Prop({ default: new Date(), type: mongoose.Schema.Types.Date })
  updatedAt: Date;

  @Prop({ type: mongoose.Schema.Types.Date })
  deletedAt: Date;

  @Prop()
  channels: string[];

  @Prop()
  users: string[];
}
export const CommunitySchema = SchemaFactory.createForClass(Community);
