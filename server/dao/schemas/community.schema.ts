import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { IsNotEmpty, IsString } from 'class-validator';

export type CommunityDocument = Community & Document;

@Schema({ timestamps: true })
export class Community {
  @Prop()
  @IsString()
  @IsNotEmpty()
  name: string;

  @Prop({
    required: true,
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

  @Prop({ type: mongoose.Schema.Types.Date })
  deletedAt: Date;

  @Prop()
  channels: string[];

  @Prop()
  users: string[];
}
export const CommunitySchema = SchemaFactory.createForClass(Community);
