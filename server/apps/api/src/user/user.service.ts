import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UsersRepository } from '@repository/user.repository';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UsersRepository) {}

  // getAllFollowers() {}

  createUser(createUserDto: CreateUserDto) {
    this.userRepository.create(createUserDto);
  }
}
