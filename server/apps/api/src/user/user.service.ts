import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from '../../../../dao/schemas/user.schema';
import { Model } from 'mongoose';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private doc: Model<UserDocument>) {}

  getAllFollowers() {}

  createUser(createUserDto: CreateUserDto) {
    const { id, pw } = createUserDto;
    const user = {
      id,
      pw,
      description: 'mongodb test',
    };

  }
}
