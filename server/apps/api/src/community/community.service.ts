import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateCommunityDto } from '@api/src/community/dto/create-community.dto';
import { CommunityRepository } from '@repository/community.repository';
import { UserRepository } from '@repository/user.repository';
import { ModifyCommunityDto } from '@api/src/community/dto/modify-community.dto';

@Injectable()
export class CommunityService {
  constructor(
    private readonly communityRepository: CommunityRepository,
    private readonly userRepository: UserRepository,
  ) {}

  async createCommunity(createCommunityDto: CreateCommunityDto) {
    await this.verfiyManager(createCommunityDto.managerId);
    return await this.communityRepository.create({
      ...createCommunityDto,
      users: [createCommunityDto.managerId],
    });
  }

  async modifyCommunity(modifyCommunityDto: ModifyCommunityDto) {
    await this.verfiyManager(modifyCommunityDto.managerId);
    const community = await this.verfiyCommunity(modifyCommunityDto.community_id);
    if (community.managerId != modifyCommunityDto.managerId) {
      throw new BadRequestException('사용자의 커뮤니티 수정 권한이 없습니다.');
    }
    const { managerId, community_id, ...updateField } = modifyCommunityDto;
    // TODO: 꼭 기다려줘야하는지 생각해보기
    return await this.communityRepository.updateOne({ _id: community_id }, updateField);
  }

  async verfiyManager(managerId: string) {
    const manager = await this.userRepository.findById(managerId);
    if (!manager) {
      throw new BadRequestException('해당하는 매니저의 _id가 올바르지 않습니다.');
    }
    return manager;
  }

  async verfiyCommunity(community_id: string) {
    const community = await this.communityRepository.findOne({ _id: community_id });
    if (!community) {
      throw new BadRequestException('해당하는 커뮤니티의 _id가 올바르지 않습니다.');
    }
    return community;
  }
}
