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
    const community = await this.communityRepository.findById(createChannelDto.communityId);
    if (community === null) {
      throw new BadRequestException('커뮤니티가 존재하지 않음');
    }
    if (createChannelDto.name in community.channels) {
      throw new BadRequestException('중복된 이름의 채널이 같은 커뮤니티에 있습니다.');
    }

    // 채널 생성
    const channel = await this.channelRepository.create({
      ...createChannelDto,
      users: [createChannelDto.managerId],
    });
    const newChannel = {};
    newChannel[`communities.${community._id.toString()}.channels.${channel._id}`] = new Date();

    // 커뮤니티 목록에 채널 업데이트
    await this.communityRepository.addArrAtArr({ id: community.id }, 'channels', [channel._id]);

    // 유저 목록에 자신이 속한 채널 업데이트
    await this.userRepository.updateObject({ _id: createChannelDto.managerId }, newChannel);
  }
}
