import { BadRequestException, Injectable } from '@nestjs/common';
import { CommunityRepository } from '@repository/community.repository';
import { UserRepository } from '@repository/user.repository';
import {
  CreateCommunityDto,
  AppendUsersToCommunityDto,
  ModifyCommunityDto,
  DeleteCommunityDto,
} from './dto';
import { IsUserInCommunity, makeCommunityObj } from '@community/helper';
import { communityInUser } from '@user/dto/community-in-user.dto';
import { ChannelRepository } from '@repository/channel.repository';
import { getCommunityBasicInfo } from '@community/helper/getCommunityBasicInfo';
import { getChannelBasicInfo } from '@channel/helper/getChannelBasicInfo';
import { RequestUserAboutCommunityDto } from '@community/dto/request-user-about-community.dto';
import { getUserBasicInfo } from '@user/helper/getUserBasicInfo';
import { ChatListRespository } from '@repository/chat-list.respository';
import { sortedByCreateTime } from '@community/helper/sortedByCreateTime';
import { ChannelDocument } from '@schemas/channel.schema';
import { CommunityDocument } from '@schemas/community.schema';

@Injectable()
export class CommunityService {
  constructor(
    private readonly communityRepository: CommunityRepository,
    private readonly userRepository: UserRepository,
    private readonly channelRepository: ChannelRepository,
    private readonly chatListRepository: ChatListRespository,
  ) {}

  async getCommunities(requestUserId: string) {
    const user = await this.userRepository.findById(requestUserId);
    if (user.communities === undefined || Object.keys(user.communities).length == 0) {
      return { communities: [] };
    }
    const communitiesInfo = await Promise.all(
      Array.from(user.communities.values()).map(async (userCommunity) => {
        const { _id, channels } = userCommunity as communityInUser;
        const community = await this.communityRepository.findById(_id);
        this.verifyChannelInCommunity(community, channels);
        const channelsInfo = await Promise.all(
          Array.from(channels.keys()).map(async (channelId) => {
            return await this.getChannelInfo(channelId, channels.get(channelId));
          }),
        );
        channelsInfo.sort(sortedByCreateTime);
        return getCommunityBasicInfo(community, channelsInfo);
      }),
    );
    communitiesInfo.sort(sortedByCreateTime);
    return { communities: communitiesInfo };
  }
  async createCommunity(createCommunityDto: CreateCommunityDto) {
    const community = await this.communityRepository.create({
      ...createCommunityDto,
      users: [createCommunityDto.managerId],
    });
    const newCommunity = makeCommunityObj(community._id.toString(), {});
    await this.userRepository.updateObject({ _id: createCommunityDto.managerId }, newCommunity);
    return getCommunityBasicInfo(community, []);
  }

  async appendUsersToCommunity(appendUsersToCommunityDto: AppendUsersToCommunityDto) {
    const { community_id, requestUserId, users } = appendUsersToCommunityDto;
    const communityId = community_id;
    const user = await this.userRepository.findById(requestUserId);
    if (!IsUserInCommunity(user, communityId)) {
      throw new BadRequestException(`??????????????? ????????? ?????? ???????????? ????????? ??? ????????????.`);
    }
    const community = await this.communityRepository.findById(communityId);
    let channels = {};
    if (community && 'channels' in community) {
      // public channel ??? ??????
      channels = await this.getChannels(community);
    }
    const newCommunity = makeCommunityObj(communityId, channels);
    await this.verifyUsersAlreadyInCommunity(users, communityId);
    await Promise.all(
      // ????????? document ????????? ?????? ??? update
      users.map((user_id) => {
        this.userRepository.updateObject({ _id: user_id }, newCommunity);
      }),
    );
    await Promise.all(
      // public ???????????? ????????? ??????
      Array.from(Object.keys(channels)).map((channelId) => {
        this.channelRepository.addArrAtArr({ _id: channelId }, 'users', users);
      }),
    );
    const updatedCommunity = await this.communityRepository.addArrAtArr(
      { _id: communityId },
      'users',
      users,
    );
    await this.verifyUpdatedCommunity(updatedCommunity, newCommunity, users);
  }

  async modifyCommunity(modifyCommunityDto: ModifyCommunityDto) {
    const community = await this.getCommunity(modifyCommunityDto.community_id);
    if (community.managerId != modifyCommunityDto.requestUserId) {
      throw new BadRequestException('???????????? ???????????? ?????? ????????? ????????????.');
    }
    const { community_id, ...updateField } = modifyCommunityDto;
    return await this.communityRepository.updateOne({ _id: community_id }, updateField);
  }

  async deleteCommunity(deleteCommunityDto: DeleteCommunityDto) {
    const updateField = { deletedAt: new Date() };
    const community = await this.communityRepository.findAndUpdateOne(
      {
        _id: deleteCommunityDto.community_id,
        managerId: deleteCommunityDto.requestUserId,
        deletedAt: { $exists: false },
      },
      updateField,
    );
    await this.verifyDeleteCommunity(community, deleteCommunityDto);
    await Promise.all(
      community.users.map((userId) =>
        this.deleteCommunityAtUserDocument(userId, community._id.toString()),
      ),
    );
  }
  async getCommunity(community_id: string, ...otherConditions) {
    const community = await this.communityRepository.findOne({
      _id: community_id,
      ...otherConditions[0],
    });
    if (!community) {
      throw new BadRequestException('???????????? ??????????????? _id??? ???????????? ????????????.');
    }
    return community;
  }

  deleteCommunityAtUserDocument(userId: string, community_id: string) {
    return this.userRepository.deleteObject(
      { _id: userId },
      {
        [`communities.${community_id}`]: 1,
      },
    );
  }

  async getUsersInCommunity(requestUserAboutCommunityDto: RequestUserAboutCommunityDto) {
    const community = await this.getCommunity(requestUserAboutCommunityDto.community_id, {
      users: { $elemMatch: { $eq: requestUserAboutCommunityDto.requestUserId } },
    });
    const users = await Promise.all(
      community.users.map(async (_id) => {
        const user = await this.userRepository.findByIdAfterCache(_id);
        return getUserBasicInfo(user);
      }),
    );
    return { users };
  }

  async exitUserInCommunity(requestUserAboutCommunityDto: RequestUserAboutCommunityDto) {
    const { requestUserId, community_id } = requestUserAboutCommunityDto;
    const user = await this.userRepository.findById(requestUserId);
    const community = await this.communityRepository.findById(community_id);
    if (!user) {
      throw new BadRequestException(`????????? ????????? _id(${requestUserId})??? ???????????? ????????????.`);
    } else if (!community) {
      throw new BadRequestException(`????????? ???????????? _id??? ???????????? ????????????.`);
    } else if (requestUserId === community.managerId && community.users.length > 1) {
      throw new BadRequestException(`???????????? ?????????????????? ????????? ??? ????????????. ????????? ???????????????.`);
    } else if (requestUserId === community.managerId && community.users.length === 1) {
      this.deleteCommunity(requestUserAboutCommunityDto);
      return;
    }

    // user doc?????? community ????????????
    await this.deleteCommunityAtUserDocument(requestUserId, community_id);
    // community doc?????? users??? ????????? ????????????
    await this.communityRepository.deleteElementAtArr(
      { _id: community_id },
      { users: [requestUserId] },
    );
    // user??? ?????? ?????? community??? channel doc ?????? ????????????
    if (user.communities.get(community_id).channels === undefined) {
      return;
    }
    await Promise.all(
      Array.from(user.communities.get(community_id).channels.keys()).map((channelId) =>
        this.channelRepository.deleteElementAtArr({ _id: channelId }, { users: [requestUserId] }),
      ),
    );
  }

  async getChannelInfo(_id: string, lastRead) {
    const channel = await this.channelRepository.findOne({
      _id,
      deletedAt: { $exists: false },
    });
    if (!channel || channel.deletedAt) {
      throw new BadRequestException('???????????? ?????? ???????????????.');
    }
    const channelInfo = getChannelBasicInfo(channel);
    channelInfo['existUnreadChat'] = await this.checkUnreadChat(lastRead, channel);
    return channelInfo;
  }

  async checkUnreadChat(lastRead: Date, channel: ChannelDocument) {
    // ????????? ?????? ?????? ??? ??????
    const lastChatList = await this.chatListRepository.findById(channel.chatLists.at(-1));
    const lastChatTime = lastChatList.chat.at(-1).get('createdAt');
    return lastRead.getTime() <= lastChatTime;
  }

  async getChannels(community) {
    return await community.channels.reduce(async (acc, channelId) => {
      const result = await acc;
      const channel = await this.channelRepository.findOne({
        _id: channelId,
        isPrivate: false,
      });
      if (channel) {
        result[channelId] = new Date();
      }
      return Promise.resolve(result);
    }, Promise.resolve({}));
  }

  verifyChannelInCommunity(community, channels) {
    if (!community) {
      throw new BadRequestException('???????????? ??????????????? _id??? ???????????? ????????????.');
    }
    Array.from(channels.keys()).forEach((channelId: string) => {
      if (!community.channels.includes(channelId)) {
        throw new BadRequestException('??????????????? ?????? ??????????????? ????????? ???????????????.');
      }
    });
  }

  async verifyUsersAlreadyInCommunity(users, communityId) {
    await Promise.all(
      // ????????? document ?????? (????????? ???????????????, ?????? ???????????? ?????? ??????????????? ???????????? ????????? ?????????)
      users.map(async (userId) => {
        const newUsers = await this.userRepository.findById(userId);
        if (!newUsers) {
          throw new BadRequestException(
            `??????????????? ????????? ????????? ????????? _id(${userId})??? ???????????? ????????????.`,
          );
        } else if (IsUserInCommunity(newUsers, communityId)) {
          throw new BadRequestException(`?????? ??????????????? ????????? ????????? ?????????.`);
        }
      }),
    );
  }

  async verifyUpdatedCommunity(updatedCommunity, newCommunity, users) {
    if (!updatedCommunity) {
      await Promise.all(
        // ????????? document?????? ?????? ??????
        users.map((_id) => {
          this.userRepository.deleteObject({ _id }, newCommunity);
        }),
      );
      throw new BadRequestException('???????????? ??????????????? _id??? ???????????? ????????????.');
    }
  }

  async verifyDeleteCommunity(community: CommunityDocument, { community_id, requestUserId }) {
    if (!community) {
      const { managerId, deletedAt } = await this.getCommunity(community_id);
      if (managerId != requestUserId) {
        throw new BadRequestException('???????????? ???????????? ?????? ????????? ????????????.');
      } else if (deletedAt) {
        throw new BadRequestException('?????? ????????? ?????????????????????.');
      }
    }
  }
}
