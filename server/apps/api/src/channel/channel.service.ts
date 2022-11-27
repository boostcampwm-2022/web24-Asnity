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
    const community = await this.communityRepository.findById(createChannelDto.communityId);

    // 채널 생성
    const channel = await this.channelRepository.create({
      ...createChannelDto,
      users: [createChannelDto.managerId],
    });

    // 커뮤니티 도큐먼트의 채널 필드 업데이트
    await this.communityRepository.addArrAtArr({ _id: community.id }, 'channels', [
      channel._id.toString(),
    ]);

    if (createChannelDto.isPrivate) {
      // 비공개 채널일 경우 : 채널 유저에 생성자만 존재
      await this.addUserToChannel(community._id, channel._id, [createChannelDto.managerId]);
    } else {
      // 공개 채널일 경우 : 채널 유저에 커뮤니티 사용자 모두 존재
      await this.addUserToChannel(community._id, channel._id, community.users);
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

  async addUserToChannel(communityId, channelId, newUserList) {
    // 채널 도큐먼트의 유저 필드 업데이트
    try {
      this.channelRepository.addArrAtArr({ _id: channelId }, 'channels', newUserList);
    } catch (error) {
      throw new BadRequestException('채널에 user 추가 중 오류 발생!');
    }
    // 유저 도큐먼트의 커뮤니티:채널 필드 업데이트
    try {
      await Promise.all(
        newUserList.map((userId) => {
          this.userRepository.updateObject(
            { _id: userId },
            addChannelToUserForm(communityId, channelId),
          );
        }),
      );
    } catch (error) {
      throw new BadRequestException('유저 도큐먼트에 communities 필드 업데이트 중 오류 발생!');
    }
  }
}
