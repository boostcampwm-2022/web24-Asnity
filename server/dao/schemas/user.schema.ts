import { Prop, raw, Schema, SchemaFactory } from '@nestjs/mongoose';
import { IsIn, IsString } from 'class-validator';
import mongoose, { Document } from 'mongoose';
import { STATUS } from '@utils/def';

const channels = {
  _id: { type: String },
  lastRead: { type: Date, default: new Date() },
};

export type UserDocument = User & Document;

@Schema({ timestamps: true })
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
  password: string;

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
  provider: 'asnity' | 'github';

  @Prop({ default: 'default description' })
  @IsString()
  description: string;

  @Prop({ default: 'ONLINE' })
  @IsString()
  @IsIn(STATUS)
  status: string;

  @Prop({ default: new Date(), type: mongoose.Schema.Types.Date })
  lastLogin: Date;

  @Prop({ type: mongoose.Schema.Types.Date })
  deletedAt: Date;

  @Prop()
  @IsString()
  followings: string[];

  @Prop()
  @IsString()
  followers: string[];

  @Prop(
    raw({
      type: Map,
      of: new mongoose.Schema({ _id: { type: String }, channels: { type: Map, of: Date } }),
    }),
  )
  communities;

}

export const UserSchema = SchemaFactory.createForClass(User);
