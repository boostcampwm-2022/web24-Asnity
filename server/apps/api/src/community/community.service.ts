import { BadRequestException, Injectable } from '@nestjs/common';
import { CommunityRepository } from '@repository/community.repository';
import { UserRepository } from '@repository/user.repository';
import {
  CreateCommunityDto,
  AppendUsersToCommunityDto,
  ModifyCommunityDto,
  DeleteCommunityDto,
} from './dto';

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
        await this.userRepository.addArrAtArr(user_id, 'communities', [
          appendUsersToCommunityDto.community_id,
        ]);
      }),
    );
    const community = await this.communityRepository.addArrAtArr(
      appendUsersToCommunityDto.community_id,
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
    // TODO : refactoring을 findAndUpdate로 해서 매니저 id, deletedAt인지 바로 검증이랑 동시에 하도록..
    const community = await this.verfiyCommunity(modifyCommunityDto.community_id);
    if (community.managerId != modifyCommunityDto.managerId) {
      throw new BadRequestException('사용자의 커뮤니티 수정 권한이 없습니다.');
    }
    const { managerId, community_id, ...updateField } = modifyCommunityDto;
    // TODO: 꼭 기다려줘야하는지 생각해보기
    return await this.communityRepository.updateOne({ _id: community_id }, updateField);
  }

  async deleteCommunity(deleteCommunityDto: DeleteCommunityDto) {
    const updateField = { deletedAt: new Date() };
    let community = await this.communityRepository.findAndUpdateOne(
      {
        _id: deleteCommunityDto.community_id,
        managerId: deleteCommunityDto.managerId,
        deletedAt: { $exists: false },
      },
      updateField,
    );
    if (!community) {
      community = await this.verfiyCommunity(deleteCommunityDto.community_id);
      if (community.managerId != deleteCommunityDto.managerId) {
        throw new BadRequestException('사용자의 커뮤니티 수정 권한이 없습니다.');
      } else if (community.deletedAt) {
        throw new BadRequestException('이미 삭제된 커뮤니티입니다.');
      }
    }
    return community;
  }
  async verfiyCommunity(community_id: string) {
    const community = await this.communityRepository.findOne({ _id: community_id });
    if (!community) {
      throw new BadRequestException('해당하는 커뮤니티의 _id가 올바르지 않습니다.');
    }
    return community;
  }
}
