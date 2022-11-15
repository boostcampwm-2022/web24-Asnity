import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { IsIn, IsString } from 'class-validator';
import mongoose, { Document } from 'mongoose';
import { STATUS } from '@utils/def';

export type UserDocument = User & Document;

@Schema()
export class User {
  @Prop()
  name: string;

  @Prop({
    required: true,
    unique: true,
  })
  @IsString()
  id: string;

  @Prop()
  @IsString()
  pw: string;

  @Prop()
  @IsString()
  refreshToken: string;

  @Prop({ require: true })
  @IsString()
  nickname: string;

  @Prop({ default: 'url' })
  @IsString()
  profileUrl: string;

  @Prop({ require: true })
  @IsString()
  provider: string;

  @Prop({ default: 'default description' })
  @IsString()
  description: string;

  @Prop({ default: 'ONLINE' })
  @IsString()
  @IsIn(STATUS)
  status: string;

  @Prop({ default: new Date(), type: mongoose.Schema.Types.Date })
  lastLogin: Date;

  @Prop({ default: new Date(), type: mongoose.Schema.Types.Date })
  createdAt: Date;

  @Prop({ default: new Date(), type: mongoose.Schema.Types.Date })
  updatedAt: Date;

  @Prop({ type: mongoose.Schema.Types.Date })
  deletedAt: Date;

  @Prop()
  @IsString()
  followings: string[];

  @Prop()
  @IsString()
  followers: string[];

  @Prop()
  communities: string[];
}
export const UserSchema = SchemaFactory.createForClass(User);
