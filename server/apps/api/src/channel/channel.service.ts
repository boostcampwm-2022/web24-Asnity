import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { ChannelRepository } from '@repository/channel.repository';
import { CommunityRepository } from '@repository/community.repository';
import { UserRepository } from '@repository/user.repository';
import { getChannelToUserForm } from '@channel/helper/addObjectForm';
import { CreateChannelDto, DeleteChannelDto, ModifyChannelDto } from '@channel/dto';
import { ExitChannelDto } from '@channel/dto/exit-channel.dto';

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
            getChannelToUserForm(communityId, channelId),
          );
        }),
      );
    } catch (error) {
      throw new BadRequestException('유저 도큐먼트에 communities 필드 업데이트 중 오류 발생!');
    }
  }

  async exitChannel(exitChannelDto: ExitChannelDto) {
    const { channel_id, user_id } = exitChannelDto;
    // channel도큐먼트에 users필드에서 user_id 제거
    await this.channelRepository.deleteElementAtArr({ _id: channel_id }, { users: [user_id] });
    const channel = await this.channelRepository.findOne({ _id: channel_id });

    // user도큐먼트에 community 필드에 channel_id 제거
    const deleteChannel = getChannelToUserForm(channel.communityId, channel_id);
    await this.userRepository.deleteObject({ _id: user_id }, deleteChannel);
  }

  async getChannelInfo(channel_id) {
    const channelInfo = await this.channelRepository.findOne({ _id: channel_id });
    return JSON.parse(JSON.stringify(channelInfo));
  }

  async deleteChannel(deleteChannelDto: DeleteChannelDto) {
    const { channel_id, user_id } = deleteChannelDto;
    // 관리자가 아니면 채널 삭제 에러 처리
    const channel = await this.channelRepository.findOne({ _id: channel_id });
    if (user_id !== channel.managerId) {
      throw new BadRequestException('관리자가 아닙니다!');
    }

    // channel에 속한 모든 user들에 대하여 user 도큐먼트에 communities:channels 필드 수정
    await Promise.all(
      channel.users.map((user) => {
        this.userRepository.deleteObject(
          { _id: user },
          getChannelToUserForm(channel.communityId, channel_id),
        );
      }),
    );

    // channel 도큐먼트 softDelete
    const updateField = { deletedAt: new Date() };
    await this.channelRepository.findAndUpdateOne(
      {
        _id: channel_id,
        managerId: user_id,
        deletedAt: { $exists: false },
      },
      updateField,
    );
  }
}
