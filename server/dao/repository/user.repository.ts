import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from '@schemas/user.schema';
import mongoose, { Model, Schema } from 'mongoose';
import { CreateUserDto } from '@user/dto/create-user.dto';
import { AddFollowingDto } from '@user/dto/add-following.dto';

@Injectable()
export class UsersRepository {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async create(createUserDto: CreateUserDto) {
    await this.userModel.create(createUserDto);
    return null;
  }

  async findById(id: string) {
    return await this.userModel.findById(id);
  }

  appendFollowing(addFollowingDto: AddFollowingDto) {
    this.userModel.updateOne(
      { _id: addFollowingDto.myId },
      {
        $push: { followings: addFollowingDto.followId },
      },
      (err, res) => {
        if (err) throw err;
      },
    );
  }

  appendFollwer(addFollowingDto: AddFollowingDto) {
    this.userModel.updateOne(
      { _id: addFollowingDto.followId },
      {
        $push: { followers: addFollowingDto.myId },
      },
      (err, res) => {
        if (err) throw err;
      },
    );
  }
}
