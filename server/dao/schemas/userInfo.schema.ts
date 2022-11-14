import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { IsNotEmpty, IsString } from 'class-validator';

export type UserInfoDocument = UserInfo & Document;

@Schema()
export class UserInfo {
  @Prop()
  name: string;

  @Prop({
    required: true,
    unique: true,
  })
  @IsString()
  @IsNotEmpty()
  id: string;

  @Prop()
  @IsString()
  pw: string;

  @Prop()
  @IsString()
  refreshToken: string;
}
export const UserInfoSchema = SchemaFactory.createForClass(UserInfo);
