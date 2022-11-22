import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateCommunityDto } from '@api/src/community/dto/create-community.dto';
import { CommunityRepository } from '@repository/community.repository';
import { UserRepository } from '@repository/user.repository';
import { AppendUsersToCommunityDto } from '@api/src/community/dto/append-particitants-to-community.dto';
import { getUserBasicInfo } from '@user/dto/user-basic-info.dto';

@Injectable()
export class CommunityService {
  constructor(
    private readonly communityRepository: CommunityRepository,
    private readonly userRepository: UserRepository,
  ) {}

  async createCommunity(createCommunityDto: CreateCommunityDto) {
    // const manager = await this.userRepository.findById(createCommunityDto.managerId);
    // if (!manager) {
    //   throw new BadRequestException('해당하는 매니저의 _id가 올바르지 않습니다.');
    // }
    return await this.communityRepository.create({
      ...createCommunityDto,
      users: [createCommunityDto.managerId],
    });
  }

  async appendParticipantsToCommunity(appendUsersToCommunityDto: AppendUsersToCommunityDto) {
    const community = await this.communityRepository.findById(
      appendUsersToCommunityDto.community_id,
    );
    if (!community) {
      throw new BadRequestException('해당하는 커뮤니티의 _id가 올바르지 않습니다.');
    }
    await Promise.all(
      appendUsersToCommunityDto.users.map((user) =>
        this.userRepository.findById(user).then((result) => {
          if (!result) {
            throw new BadRequestException(
              `커뮤니티에 추가를 요청한 사용자 _id(${user})가 올바르지 않습니다.`,
            );
          }
        }),
      ),
    );
    await this.communityRepository.addArrAtArr(
      { _id: appendUsersToCommunityDto.community_id },
      'users',
      appendUsersToCommunityDto.users,
    );
    return { message: '커뮤니티 사용자 추가 완료' };
  }
}
