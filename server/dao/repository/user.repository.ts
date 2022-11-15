import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from '@schemas/user.schema';
import { Model } from 'mongoose';
import { AddFollowingDto } from '@user/dto/add-following.dto';
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

  appendFollowing(addFollowingDto: AddFollowingDto) {
    this.userModel.updateOne(
      { _id: addFollowingDto.myId },
      { $push: { followings: addFollowingDto.followId } },
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
