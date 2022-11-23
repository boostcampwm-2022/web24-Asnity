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
    const community = await this.communityRepository.findById(createChannelDto.communityId);
    if (community === null) {
      throw new BadRequestException('커뮤니티가 존재하지 않음');
    }
    if (createChannelDto.name in community.channels) {
      throw new BadRequestException('중복된 이름의 채널이 같은 커뮤니티에 있습니다.');
    }
    const channel = await this.channelRepository.create({
      ...createChannelDto,
      users: [createChannelDto.managerId],
    });
    await this.communityRepository.addArrAtArr({ id: community.id }, 'channels', [channel._id]);
    // // TODO: 유저 도큐먼트에 채널 추가
  }
}
