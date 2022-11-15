import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UsersRepository } from '@repository/user.repository';
import {AddFollowingDto} from "@user/dto/add-following.dto";

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UsersRepository) {}

  // getAllFollowers() {}

  createUser(createUserDto: CreateUserDto) {
    this.userRepository.create(createUserDto);
  }

  addFollowing(addFollowingDto: AddFollowingDto) {
    this.userRepository.appendFollowing(addFollowingDto);
    this.userRepository.appendFollwer(addFollowingDto);
  }
}
