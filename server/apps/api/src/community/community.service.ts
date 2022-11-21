import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateCommunityDto } from '@api/src/community/dto/create-community.dto';
import { CommunityRepository } from '@repository/community.repository';
import { UserRepository } from '@repository/user.repository';

@Injectable()
export class CommunityService {
  constructor(
    private readonly communityRepository: CommunityRepository,
    private readonly userRepository: UserRepository,
  ) {}

  async createCommunity(createCommunityDto: CreateCommunityDto) {
    const manager = await this.userRepository.findById(createCommunityDto.managerId);
    if (!manager) {
      throw new BadRequestException('해당하는 매니저의 _id가 올바르지 않습니다.');
    }
    return await this.communityRepository.create({
      ...createCommunityDto,
      users: [createCommunityDto.managerId],
    });
  }
}
