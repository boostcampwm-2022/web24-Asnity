import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from '@schemas/user.schema';
import mongoose, { Model, Schema, Types } from 'mongoose';
import { followerDto } from '@user/dto/follower.dto';
import { SignUpDto } from '@api/src/auth/dto';

@Injectable()
export class UserRepository {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async create(createUserDto: SignUpDto) {
    await this.userModel.create(createUserDto);
    return null;
  }

  async findOne(condition: any) {
    return await this.userModel.findOne(condition);
  }

  async findById(_id: string) {
    return await this.userModel.findById(_id);
  }

  async appendElementAtArr(filter, appendElement) {
    await this.userModel.updateOne(filter, { $push: appendElement });
  }

  async deleteElementAtArr(filter, removeElement) {
    await this.userModel.updateOne(filter, { $pullAll: removeElement });
  }
}
