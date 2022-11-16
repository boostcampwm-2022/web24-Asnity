import { BadRequestException, ConflictException, Injectable, Param } from '@nestjs/common';
import { followerDto } from '@user/dto/follower.dto';
import { UserRepository } from '@repository/user.repository';
import { getUserBasicInfo } from '@user/dto/user-basic-info.dto';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  // createUser(createUserDto: CreateUserDto) {
  //   this.userRepository.create(createUserDto);
  // }

  async addFollowing(addFollowingDto: followerDto) {
    const user = await this.userRepository.findById(addFollowingDto.myId);
    const otherUser = await this.userRepository.findById(addFollowingDto.followId);
    if (!user || !otherUser) {
      throw new BadRequestException('해당하는 사용자의 _id가 올바르지 않습니다.');
    } else if (user.followings.includes(addFollowingDto.followId)) {
      throw new BadRequestException('팔로우 요청한 사용자는 이미 팔로우되어있습니다.');
    } else if (otherUser.followers.includes(addFollowingDto.myId)) {
      throw new ConflictException('상대방의 팔로워 목록에 이미 있습니다.');
    }

    this.userRepository.appendElementAtArr(
      { _id: addFollowingDto.myId },
      { followings: addFollowingDto.followId },
    );
    this.userRepository.appendElementAtArr(
      { _id: addFollowingDto.followId },
      { followers: addFollowingDto.myId },
    );
  }

  async unFollowing(unFollowingDto: followerDto) {
    const user = await this.userRepository.findById(unFollowingDto.myId);
    const otherUser = await this.userRepository.findById(unFollowingDto.followId);
    if (!user || !otherUser) {
      throw new BadRequestException('해당하는 사용자의 _id가 올바르지 않습니다.');
    } else if (!user.followings.includes(unFollowingDto.followId)) {
      throw new BadRequestException(
        `팔로우 요청한 사용자 ${user.nickname}은 ${otherUser.nickname}을 팔로우하고 있지 않습니다.`,
      );
    } else if (!otherUser.followers.includes(unFollowingDto.myId)) {
      throw new ConflictException(
        `${otherUser.nickname}의 팔로워 목록에 ${user.nickname}가 없습니다.`,
      );
    }
    this.userRepository.deleteElementAtArr(
      { _id: unFollowingDto.myId },
      { followings: [unFollowingDto.followId] },
    );
    this.userRepository.deleteElementAtArr(
      { _id: unFollowingDto.followId },
      { followers: [unFollowingDto.myId] },
    );
  }

  async getUser(_id: string) {
    const user = await this.userRepository.findById(_id);
    if (!user) {
      throw new BadRequestException('요청한 사용자는 없는 사용자입니다.');
    }
    return getUserBasicInfo(user);
  }

  async getFollowers(_id: string) {
    const user = await this.userRepository.findById(_id);
    if (!user) {
      throw new BadRequestException('요청한 사용자는 없는 사용자입니다.');
    }
    const { followers } = user;
    // TODO: 배열을 순회하면서 찾지 않고 한번에 db에서 찾도록하는 mongoose 명령 있는지 확인하기
    const result = await Promise.all(
      followers.map(async (followerId) => {
        return getUserBasicInfo(await this.userRepository.findById(followerId));
      }),
    );
    return { followers: result };
  }

  async getFollowings(_id: string) {
    const user = await this.userRepository.findById(_id);
    if (!user) {
      throw new BadRequestException('요청한 사용자는 없는 사용자입니다.');
    }
    const { followings } = user;
    // TODO: 배열을 순회하면서 찾지 않고 한번에 db에서 찾도록하는 mongoose 명령 있는지 확인하기
    const result = await Promise.all(
      followings.map(async (followingId) => {
        return getUserBasicInfo(await this.userRepository.findById(followingId));
      }),
    );
    return { followers: result };
  }
}
