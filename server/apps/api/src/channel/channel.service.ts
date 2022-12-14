import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { ChannelRepository } from '@repository/channel.repository';
import { CommunityRepository } from '@repository/community.repository';
import { UserRepository } from '@repository/user.repository';
import {
  CreateChannelDto,
  DeleteChannelDto,
  InviteChannelDto,
  JoinChannelDto,
  ModifyChannelDto,
  UpdateLastReadDto,
} from '@channel/dto';
import { ExitChannelDto } from '@channel/dto/exit-channel.dto';
import { getChannelBasicInfo, getChannelToUserForm } from '@channel/helper';
import { getUserBasicInfo } from '@user/helper/getUserBasicInfo';
import { ChatListRespository } from '@repository/chat-list.respository';

@Injectable()
export class ChannelService {
  constructor(
    private readonly channelRepository: ChannelRepository,
    private readonly communityRepository: CommunityRepository,
    private readonly chatListRepository: ChatListRespository,
    private readonly userRepository: UserRepository,
  ) {}

  async createChannel(createChannelDto: CreateChannelDto) {
    const { communityId, isPrivate, managerId } = createChannelDto;
    // 자신이 속한 커뮤니티 찾기
    // const community = await this.communityRepository.findById(communityId);
    const community = await this.communityRepository.findOne({
      _id: communityId,
      deletedAt: undefined,
    });

    if (!community) throw new BadRequestException('커뮤니티가 없습니다.');
    if (!community.users.includes(managerId))
      throw new BadRequestException('커뮤니티에 존재하지 않는 유저입니다.');
    // 채널 생성
    const channel = await this.channelRepository.create(createChannelDto);
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

    return getChannelBasicInfo(channel);
  }

  async modifyChannel(modifyChannelDto: ModifyChannelDto) {
    const { channel_id, requestUserId } = modifyChannelDto;
    // 채널의 관리자가 아니면 예외처리
    const channel = await this.channelRepository.findOne({
      _id: channel_id,
      deletedAt: undefined,
    });
    if (!channel) {
      throw new UnauthorizedException('존재하지 않는 채널입니다.');
    }
    if (channel.managerId !== requestUserId)
      throw new UnauthorizedException('채널 관리자가 아닙니다.');

    // 채널 수정
    try {
      await this.channelRepository.updateOne({ _id: channel_id }, modifyChannelDto);
    } catch (error) {
      throw new BadRequestException('채널 수정 중 오류 발생!');
    }
  }

  async getChannelInfo(channel_id) {
    const channel = await this.channelRepository.findOne({ _id: channel_id, deletedAt: undefined });
    if (!channel) throw new BadRequestException('존재하지 않는 채널입니다.');
    const users = await Promise.all(
      channel.users.map(async (user_id) => {
        const user = await this.userRepository.findByIdAfterCache(user_id);
        return getUserBasicInfo(user);
      }),
    );
    channel['users'] = users as any;
    return getChannelBasicInfo(channel);
  }

  async exitChannel(exitChannelDto: ExitChannelDto) {
    const { channel_id, requestUserId } = exitChannelDto;

    // channel 관리자이고 channel의 users에 2명이상 존재 시 채널 퇴장 불가능
    const channel = await this.channelRepository.findOne({
      _id: channel_id,
      deletedAt: undefined,
    });

    if (!channel) throw new BadRequestException('존재하지 않는 채널입니다.');
    if (requestUserId === channel.managerId) {
      if (channel.users.length > 1) {
        throw new BadRequestException('관리자를 변경하고 채널을 퇴장하십시오!');
      }
      // 관리자 혼자 채널에 존재하고 채널을 나갈 경우 채널 제거
      await this.deleteChannel({ channel_id, requestUserId });
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
    const channel = await this.channelRepository.findOne({ _id: channel_id, deletedAt: undefined });
    if (!channel) throw new BadRequestException('존재하지 않는 채널입니다.');

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
    const { community_id, channel_id, users } = inviteChannelDto;
    const channel = await this.channelRepository.findOne({ _id: channel_id, deletedAt: undefined });
    if (!channel) throw new BadRequestException('존재하지 않는 채널입니다.');

    await this.checkUserInCommunity(community_id, users);
    await this.addUserToChannel(community_id, channel_id, users);

    const channelInfo = getChannelBasicInfo(await this.channelRepository.findById(channel_id));
    if (!channelInfo) throw new BadRequestException();
    return { ...channelInfo, existUnreadChat: false };
  }

  async updateLastRead(updateLastReadDto: UpdateLastReadDto) {
    const { community_id, channel_id, requestUserId } = updateLastReadDto;
    const channel = await this.channelRepository.findOne({
      _id: channel_id,
      deletedAt: undefined,
      users: requestUserId,
    });
    if (!channel) throw new BadRequestException('사용자가 존재하는 채널이 아닙니다.');

    // 유저 도큐먼트의 커뮤니티:채널 필드 업데이트
    await this.userRepository.updateObject(
      { _id: requestUserId },
      getChannelToUserForm(community_id, channel_id),
    );
  }

  async joinChannel(joinChannelDto: JoinChannelDto) {
    const { requestUserId, channel_id, community_id } = joinChannelDto;
    const channel = await this.channelRepository.findOne({ _id: channel_id, deletedAt: undefined });
    if (!channel) throw new BadRequestException('존재하지 않는 채널입니다.');

    await this.checkUserInCommunity(community_id, [requestUserId]);
    await this.addUserToChannel(community_id, channel_id, [requestUserId]);

    const channelInfo = getChannelBasicInfo(await this.channelRepository.findById(channel_id));
    if (!channelInfo) throw new BadRequestException();
    return { ...channelInfo, lastRead: false };
  }

  async checkUserInCommunity(community_id, newUsers) {
    const community = await this.communityRepository.findOne({
      _id: community_id,
      deletedAt: undefined,
    });
    if (!community) throw new UnauthorizedException('존재하지 않는 커뮤니티 입니다.');
    const userSet = new Set(community.users);
    newUsers.map((user) => {
      if (!userSet.has(user)) {
        throw new BadRequestException('커뮤니티에 없는 유저는 채널에 참여할 수 없습니다.');
      }
    });
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
}
