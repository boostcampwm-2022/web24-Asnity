import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from '@schemas/user.schema';
import { Model } from 'mongoose';
import { CreateUserDto } from '@user/dto/create-user.dto';

@Injectable()
export class UserRepository {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async create(createUserDto: CreateUserDto) {
    await this.userModel.create(createUserDto);
    return null;
  }

  async findOne(condition: any) {
    return await this.userModel.findOne(condition);
  }

  async findOr(conditions: any) {
    return await this.userModel.find({ $or: conditions });
  }

  async findById(_id: string) {
    return await this.userModel.findById(_id);
  }

  async updateOne(filter, updateField) {
    await this.userModel.updateOne(filter, updateField);
  }

  async appendElementAtArr(filter, appendElement) {
    await this.userModel.updateOne(filter, { $push: appendElement });
  }

  async updateObject(filter, appendElement) {
    await this.userModel.updateOne(filter, { $set: appendElement });
  }

  async deleteElementAtArr(filter, removeElement) {
    await this.userModel.updateOne(filter, { $pullAll: removeElement });
  }

  async deleteElementAtArr2(_id, removeElement) {
    await this.userModel.findByIdAndUpdate(_id, { $pullAll: removeElement }, { new: true });
  }

  async addArrAtArr(filter, attribute, appendArr) {
    const addArr = {};
    addArr[attribute] = { $each: appendArr };
    return await this.userModel.findByIdAndUpdate(filter, { $addToSet: addArr }, { new: true });
  }

  // async set(filter, obj) {
  //   const user = new User();
  //
  //   this.userModel.find(filter).communities.set();
  // }
}
