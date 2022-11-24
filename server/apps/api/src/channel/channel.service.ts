import { BadRequestException, Injectable } from '@nestjs/common';
import { ChannelRepository } from '@repository/channel.repository';
import { CreateChannelDto } from '@api/src/channel/dto';
import { CommunityRepository } from '@repository/community.repository';
import { UserRepository } from '@repository/user.repository';

@Injectable()
export class ChannelService {
  constructor(
    private readonly channelRepository: ChannelRepository,
    private readonly communityRepository: CommunityRepository,
    private readonly userRepository: UserRepository,
  ) {}

  async createChannel(createChannelDto: CreateChannelDto) {
    // 자신이 속한 커뮤니티 찾기
    try {
      const community = await this.communityRepository.findById(createChannelDto.communityId);

      // 채널 생성
      const channel = await this.channelRepository.create({
        ...createChannelDto,
        users: [createChannelDto.managerId],
      });

      // 커뮤니티 목록에 채널 업데이트
      await this.communityRepository.addArrAtArr({ _id: community.id }, 'channels', [
        channel._id.toString(),
      ]);

      // 유저 목록에 자신이 속한 채널 업데이트
      const newChannel = {};
      newChannel[`communities.${community._id.toString()}.channels.${channel._id}`] = new Date();
      await this.userRepository.updateObject({ _id: createChannelDto.managerId }, newChannel);
    } catch (error) {
      throw new BadRequestException('채널 생성 중 오류 발생!');
    }
  }
}
