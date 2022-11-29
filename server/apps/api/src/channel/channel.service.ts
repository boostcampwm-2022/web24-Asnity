import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { ChannelRepository } from '@repository/channel.repository';
import { CommunityRepository } from '@repository/community.repository';
import { UserRepository } from '@repository/user.repository';
import {
  CreateChannelDto,
  DeleteChannelDto,
  InviteChannelDto,
  ModifyChannelDto,
  UpdateLastReadDto,
} from '@channel/dto';
import { ExitChannelDto } from '@channel/dto/exit-channel.dto';
import { getChannelBasicInfo, getChannelToUserForm } from '@channel/helper';

@Injectable()
export class ChannelService {
  constructor(
    private readonly channelRepository: ChannelRepository,
    private readonly communityRepository: CommunityRepository,
    private readonly userRepository: UserRepository,
  ) {}

  async createChannel(createChannelDto: CreateChannelDto) {
    const { communityId, isPrivate, managerId } = createChannelDto;
    // 자신이 속한 커뮤니티 찾기
    const community = await this.communityRepository.findById(communityId);
    // 채널 생성
    const channel = await this.channelRepository.create({
      ...createChannelDto,
    });
    // community 도큐먼트의 channel 필드 업데이트
    await this.communityRepository.addArrAtArr({ _id: community.id }, 'channels', [
      channel._id.toString(),
    ]);

    if (isPrivate) {
      // 비공개 채널일 경우 : 채널 유저에 생성자만 존재
      await this.addUserToChannel(community._id, channel._id, [managerId]);
    } else {
      // 공개 채널일 경우 : 채널 유저에 커뮤니티 사용자 모두 존재
      await this.addUserToChannel(community._id, channel._id, community.users);
    }
  }

  async modifyChannel(modifyChannelDto: ModifyChannelDto) {
    const { channel_id, requestUserId } = modifyChannelDto;
    // 채널의 관리자가 아니면 예외처리
    const channel = await this.channelRepository.findOne({
      _id: channel_id,
      managerId: requestUserId,
    });
    if (channel === undefined) {
      throw new UnauthorizedException('채널 관리자가 아닙니다.');
    }

    // 채널 수정
    try {
      await this.channelRepository.updateOne({ _id: channel_id }, modifyChannelDto);
    } catch (error) {
      throw new BadRequestException('채널 수정 중 오류 발생!');
    }
  }

  async addUserToChannel(community_id, channel_id, newUsers) {
    // 채널 도큐먼트의 유저 필드 업데이트
    try {
      await this.channelRepository.addArrAtArr({ _id: channel_id }, 'users', newUsers);
    } catch (error) {
      throw new BadRequestException('채널에 user 추가 중 오류 발생!');
    }
    // 유저 도큐먼트의 커뮤니티:채널 필드 업데이트
    try {
      await Promise.all(
        newUsers.map((userId) => {
          this.userRepository.updateObject(
            { _id: userId },
            getChannelToUserForm(community_id, channel_id),
          );
        }),
      );
    } catch (error) {
      throw new BadRequestException('유저 도큐먼트에 communities 필드 업데이트 중 오류 발생!');
    }
  }

  async getChannelInfo(channel_id) {
    const channelInfo = await this.channelRepository.findOne({ _id: channel_id });
    return getChannelBasicInfo(channelInfo);
  }

  async exitChannel(exitChannelDto: ExitChannelDto) {
    const { channel_id, requestUserId } = exitChannelDto;

    // channel 관리자이고 channel의 users에 2명이상 존재 시 채널 퇴장 불가능
    const channel = await this.channelRepository.findById(channel_id);
    if (requestUserId === channel.managerId) {
      if (channel.users.length > 1) {
        throw new BadRequestException('관리자를 변경하고 채널을 퇴장하십시오!');
      }
      // 관리자 혼자 채널에 존재하고 채널을 나갈 경우 채널 제거
      this.deleteChannel({ channel_id, requestUserId });
    }

    // channel도큐먼트에 users필드에서 user_id 제거
    await this.channelRepository.deleteElementAtArr(
      { _id: channel_id },
      { users: [requestUserId] },
    );

    // user도큐먼트에 community 필드에 channel_id 제거
    const deleteChannel = getChannelToUserForm(channel.communityId, channel_id);
    await this.userRepository.deleteObject({ _id: requestUserId }, deleteChannel);
  }

  async deleteChannel(deleteChannelDto: DeleteChannelDto) {
    const { channel_id, requestUserId } = deleteChannelDto;
    // 관리자가 아니면 채널 삭제 에러 처리
    const channel = await this.channelRepository.findById(channel_id);
    if (requestUserId !== channel.managerId) {
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
    // community 도큐먼트의 channels 필드 업데이트
    await this.communityRepository.deleteElementAtArr(
      { _id: channel.communityId },
      { channels: [channel_id] },
    );
    // channel 도큐먼트 softDelete
    const updateField = { deletedAt: new Date() };
    await this.channelRepository.findAndUpdateOne(
      {
        _id: channel_id,
        managerId: requestUserId,
        deletedAt: { $exists: false },
      },
      updateField,
    );
  }

  async inviteChannel(inviteChannelDto: InviteChannelDto) {
    const { community_id, channel_id, inviteUsers } = inviteChannelDto;
    // 유저 도큐먼트의 커뮤니티:채널 필드 업데이트
    await this.addUserToChannel(community_id, channel_id, inviteUsers);
  }

  async updateLastRead(updateLastReadDto: UpdateLastReadDto) {
    const { community_id, channel_id, requestUserId } = updateLastReadDto;
    // 유저 도큐먼트의 커뮤니티:채널 필드 업데이트
    await this.userRepository.updateObject(
      { _id: requestUserId },
      getChannelToUserForm(community_id, channel_id),
    );
  }
}
