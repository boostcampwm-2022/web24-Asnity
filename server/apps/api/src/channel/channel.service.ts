import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { ChannelRepository } from '@repository/channel.repository';
import { CommunityRepository } from '@repository/community.repository';
import { UserRepository } from '@repository/user.repository';
import { addChannelToUserForm } from '@channel/helper/addObjectForm';
import { CreateChannelDto, ModifyChannelDto } from '@channel/dto';

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
      const newChannel = addChannelToUserForm(community._id, channel._id);
      await this.userRepository.updateObject({ _id: createChannelDto.managerId }, newChannel);
    } catch (error) {
      throw new BadRequestException('채널 생성 중 오류 발생!');
    }
  }

  async modifyChannel(modifyChannelDto: ModifyChannelDto) {
    // 채널의 관리자가 아니면 예외처리
    const channel = await this.channelRepository.findOne({ id: modifyChannelDto.channelId });
    if (channel === undefined || modifyChannelDto.managerId !== channel.managerId) {
      throw new UnauthorizedException('채널 관리자가 아닙니다.');
    }

    // 채널 수정
    try {
      await this.channelRepository.updateOne({ id: modifyChannelDto.channelId }, modifyChannelDto);
    } catch (error) {
      throw new BadRequestException('채널 수정 중 오류 발생!');
    }
  }
}
