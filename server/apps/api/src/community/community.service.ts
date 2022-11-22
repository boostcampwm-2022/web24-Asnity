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
    this.verfiyManager(createCommunityDto.managerId);
    return await this.communityRepository.create({
      ...createCommunityDto,
      users: [createCommunityDto.managerId],
    });
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
