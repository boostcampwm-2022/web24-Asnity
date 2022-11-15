import { Injectable } from '@nestjs/common';
import { CreateUserDto } from '@user/dto/create-user.dto';
import { UserRepository } from '@repository/user.repository';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  // getAllFollowers() {}
  //
  // createUser(createUserDto: CreateUserDto) {
  //   this.userRepository.create(createUserDto);
  // }
}
