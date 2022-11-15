import { BadRequestException, ConflictException, Injectable } from '@nestjs/common';
import { AddFollowingDto } from '@user/dto/add-following.dto';
import { CreateUserDto } from '@user/dto/create-user.dto';
import { UserRepository } from '@repository/user.repository';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  // createUser(createUserDto: CreateUserDto) {
  //   this.userRepository.create(createUserDto);
  // }

  async addFollowing(addFollowingDto: AddFollowingDto) {
    const user = await this.userRepository.findById(addFollowingDto.myId);
    const otherUser = await this.userRepository.findById(addFollowingDto.followId);
    if (!user || !otherUser) {
      throw new BadRequestException('해당하는 사용자의 _id가 올바르지 않습니다.');
    } else if (user.followings.includes(addFollowingDto.followId)) {
      throw new BadRequestException('팔로우 요청한 사용자는 이미 팔로우되어있습니다.');
    } else if (otherUser.followers.includes(addFollowingDto.myId)) {
      throw new ConflictException('상대방의 팔로워 목록에 이미 있습니다.');
    }
    this.userRepository.appendFollowing(addFollowingDto);
    this.userRepository.appendFollwer(addFollowingDto);
  }
}
