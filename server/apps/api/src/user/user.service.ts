import { BadRequestException, ConflictException, Injectable } from '@nestjs/common';
import { UserRepository } from '@repository/user.repository';
import { FollowerDto, ModifyUserDto } from './dto';
import { getUserBasicInfo } from '@user/helper/getUserBasicInfo';
import { checkRelation } from '@user/helper/checkRelation';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  async toggleFollowing(followerDto: FollowerDto) {
    const user = await this.userRepository.findById(followerDto.myId);
    const otherUser = await this.userRepository.findById(followerDto.followId);
    if (!user || !otherUser) {
      throw new BadRequestException('해당하는 사용자의 _id가 올바르지 않습니다.');
    }
    const expectedRelation = checkRelation(user.followings, otherUser.followers, followerDto);
    if (expectedRelation === RELATION.FOLLOW) {
      // 팔로우 되어있지 않은 경우 팔로우 필요
      this.userRepository.appendElementAtArr(
        { _id: followerDto.myId },
        { followings: followerDto.followId },
      );
      this.userRepository.appendElementAtArr(
        { _id: followerDto.followId },
        { followers: followerDto.myId },
      );
      return { message: '팔로우 신청 완료' };
    } else if (expectedRelation === RELATION.UNFOLLOW) {
      // 팔로우 되어있어 언팔로우 필요
      this.userRepository.deleteElementAtArr(
        { _id: followerDto.myId },
        { followings: [followerDto.followId] },
      );
      this.userRepository.deleteElementAtArr(
        { _id: followerDto.followId },
        { followers: [followerDto.myId] },
      );
      return { message: '언팔로우 완료' };
    }
  }

  async getUser(id: string) {
    const users = await this.userRepository.findUser([
      { id: { $regex: id } },
      { nickname: { $regex: id } },
    ]);
    return users.map((user) => getUserBasicInfo(user));
  }

  // TODO : feature 수정으로 인해 안쓰는 코드로 유추 재확인
  async getRelatedUsers(_id: string, option: string) {
    const user = await this.userRepository.findById(_id);
    if (!user) {
      throw new BadRequestException('요청한 사용자는 없는 사용자입니다.');
    }

    const { followings, followers } = user;
    const userIdList = option == 'followers' ? followers : followings;
    // TODO: 배열을 순회하면서 찾지 않고 한번에 db에서 찾도록하는 mongoose 명령 있는지 확인하기
    return await Promise.all(
      userIdList.map(async (userId) => {
        return getUserBasicInfo(await this.userRepository.findById(userId));
      }),
    );
  }

  async modifyUser(modifyUserDto: ModifyUserDto) {
    const { _id, ...updateField } = modifyUserDto;
    const user = await this.userRepository.findById(_id);
    if (!user) {
      throw new BadRequestException('요청한 사용자는 없는 사용자입니다.');
    }
    // TODO: 꼭 기다려줘야하는지 생각해보기
    return await this.userRepository.updateOne({ _id }, updateField);
  }
}
