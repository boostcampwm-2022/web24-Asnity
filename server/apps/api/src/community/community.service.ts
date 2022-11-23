import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateCommunityDto } from '@api/src/community/dto/create-community.dto';
import { CommunityRepository } from '@repository/community.repository';
import { UserRepository } from '@repository/user.repository';
import { ModifyCommunityDto } from '@api/src/community/dto/modify-community.dto';
import { AppendUsersToCommunityDto } from '@api/src/community/dto/append-particitants-to-community.dto';

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

  async modifyCommunity(modifyCommunityDto: ModifyCommunityDto) {
    const community = await this.verfiyCommunity(modifyCommunityDto.community_id);
    if (community.managerId != modifyCommunityDto.managerId) {
      throw new BadRequestException('사용자의 커뮤니티 수정 권한이 없습니다.');
    }
    const { managerId, community_id, ...updateField } = modifyCommunityDto;
    // TODO: 꼭 기다려줘야하는지 생각해보기
    return await this.communityRepository.updateOne({ _id: community_id }, updateField);
  }

  async verfiyCommunity(community_id: string) {
    const community = await this.communityRepository.findOne({ _id: community_id });
    if (!community) {
      throw new BadRequestException('해당하는 커뮤니티의 _id가 올바르지 않습니다.');
    }
    return community;
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
}
