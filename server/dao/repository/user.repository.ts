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
  수;
  async findById(_id: string) {
    return await this.userModel.findById(_id);
  }

  appendFollowing(addFollowingDto: followerDto) {
    // TODO : 하위 append follower와 합치도록 추상화하기
    this.userModel.updateOne(
      { _id: addFollowingDto.myId },
      { $push: { followings: addFollowingDto.followId } },
      (err, res) => {
        if (err) throw err;
      },
    );
  }

  appendFollower(addFollowingDto: followerDto) {
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

  async deleteElementAtArr(condition, removeElement) {
    await this.userModel.updateOne(condition, { $pullAll: removeElement });
  }
}
