import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateCommunityDto } from '@api/src/community/dto/create-community.dto';
import { CommunityRepository } from '@repository/community.repository';
import { UserRepository } from '@repository/user.repository';
import { AppendUsersToCommunityDto } from '@api/src/community/dto/append-particitants-to-community.dto';
import { ModifyCommunityDto } from '@api/src/community/dto/modify-community.dto';

@Injectable()
export class CommunityService {
  constructor(
    private readonly communityRepository: CommunityRepository,
    private readonly userRepository: UserRepository,
  ) {}

  async createCommunity(createCommunityDto: CreateCommunityDto) {
    return await this.communityRepository.create({
      ...createCommunityDto,
      users: [createCommunityDto.managerId],
    });
  }

  async appendParticipantsToCommunity(appendUsersToCommunityDto: AppendUsersToCommunityDto) {
    await Promise.all(
      appendUsersToCommunityDto.users.map(async (user_id) => {
        const user = await this.userRepository.findById(user_id);
        if (!user) {
          throw new BadRequestException(
            `커뮤니티에 추가를 요청한 사용자 _id(${user_id})가 올바르지 않습니다.`,
          );
        }
        await this.userRepository.addArrAtArr({ _id: user_id }, 'communities', [
          appendUsersToCommunityDto.community_id,
        ]);
      }),
    );
    const community = await this.communityRepository.addArrAtArr(
      { _id: appendUsersToCommunityDto.community_id },
      'users',
      appendUsersToCommunityDto.users,
    );
    if (!community) {
      await Promise.all(
        appendUsersToCommunityDto.users.map((user_id) => {
          this.userRepository.deleteElementAtArr(
            { _id: user_id },
            { communities: [appendUsersToCommunityDto.community_id] },
          );
        }),
      );
      throw new BadRequestException('해당하는 커뮤니티의 _id가 올바르지 않습니다.');
    }
    return { message: '커뮤니티 사용자 추가 완료' };
  }

  async modifyCommunity(modifyCommunityDto: ModifyCommunityDto) {
    this.verfiyManager(modifyCommunityDto.managerId);
    this.verfiyCommunity(modifyCommunityDto.community_id);
  }

  async verfiyManager(managerId: string) {
    const manager = await this.userRepository.findById(managerId);
    if (!manager) {
      throw new BadRequestException('해당하는 매니저의 _id가 올바르지 않습니다.');
    }
    return manager;
  }

  async verfiyCommunity(community_id: string) {
    const community = await this.communityRepository.findOne(community_id);
    if (!community) {
      throw new BadRequestException('해당하는 커뮤니티의 _id가 올바르지 않습니다.');
    }
    return community;
  }
}
