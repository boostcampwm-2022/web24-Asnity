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
import { getChannelBasicInfo } from '@api/src/channel/dto/channel-basic-info.dto';
import { RequestUserAboutCommunityDto } from '@community/dto/request-user-about-community.dto';
import { getUserBasicInfo } from '@user/dto';

@Injectable()
export class CommunityService {
  constructor(
    private readonly communityRepository: CommunityRepository,
    private readonly userRepository: UserRepository,
    private readonly channelRepository: ChannelRepository,
  ) {}

  async getCommunities(_id: string) {
    const communitiesInfo = [];
    const user = await this.userRepository.findById(_id);
    await Promise.all(
      Array.from(user.communities.values()).map(async (userCommunity) => {
        const { _id, channels } = userCommunity as communityInUser;
        const community = await this.communityRepository.findById(_id);
        if (!community) {
          throw new BadRequestException('해당하는 커뮤니티의 _id가 올바르지 않습니다.');
        }
        const result = Array.from(channels.keys()).filter(
          (channel_id: string) => !community.channels.includes(channel_id),
        );
        if (result.length > 0) {
          console.log(result);
          throw new BadRequestException('커뮤니티에 없는 비정상적인 채널이 존재합니다.');
        }
        const channelsInfo = [];
        await Promise.all(
          Array.from(channels.keys()).map(async (channelId) => {
            const lastRead = channels.get(channelId);
            const channel = (await this.channelRepository.findById(channelId)) as any;
            if (!channel || channel.deletedAt) {
              throw new BadRequestException('존재하지 않는 채널입니다.');
            }
            const channelInfo = getChannelBasicInfo(channel);
            // TODO : channel document의 updatedAt 아니고 다르값 비교
            channelInfo['lastRead'] = lastRead.getTime() >= channel.updatedAt.getTime();
            channelsInfo.push(channelInfo);
          }),
        );
        const communityInfo = getCommunityBasicInfo(community, channelsInfo);
        communitiesInfo.push(communityInfo);
      }),
    );
    return { communities: communitiesInfo };
  }
  async createCommunity(createCommunityDto: CreateCommunityDto) {
    const community = await this.communityRepository.create({
      ...createCommunityDto,
      users: [createCommunityDto.managerId],
    });
    const newCommunity = makeCommunityObj(community._id.toString());
    await this.userRepository.updateObject({ _id: createCommunityDto.managerId }, newCommunity);
    return getCommunityBasicInfo(community, []);
  }

  async appendParticipantsToCommunity(appendUsersToCommunityDto: AppendUsersToCommunityDto) {
    const communityId = appendUsersToCommunityDto.community_id;
    const user = this.userRepository.findById(appendUsersToCommunityDto.requestUser_id);
    if (!IsUserInCommunity(user, communityId)) {
      throw new BadRequestException(`커뮤니티에 속하지 않는 사용자는 요청할 수 없습니다.`);
    }
    const newCommunity = makeCommunityObj(communityId);
    await Promise.all(
      // 사용자 document 검증 (올바른 사용자인지, 해당 사용자가 이미 커뮤니티에 참여하고 있는건 아닌지)
      appendUsersToCommunityDto.users.map(async (user_id) => {
        const user = await this.userRepository.findById(user_id);
        if (!user) {
          throw new BadRequestException(
            `커뮤니티에 추가를 요청한 사용자 _id(${user_id})가 올바르지 않습니다.`,
          );
        } else if (IsUserInCommunity(user, communityId)) {
          throw new BadRequestException(`이미 커뮤니티에 추가된 사용자 입니다.`);
        }
      }),
    );
    await Promise.all(
      // 사용자 document 검증이 끝난 후 update
      appendUsersToCommunityDto.users.map(async (user_id) => {
        await this.userRepository.updateObject({ _id: user_id }, newCommunity);
      }),
    );
    const community = await this.communityRepository.addArrAtArr(
      { _id: appendUsersToCommunityDto.community_id },
      'users',
      appendUsersToCommunityDto.users,
    );
    if (!community) {
      await Promise.all(
        // 사용자 document에서 다시 삭제
        appendUsersToCommunityDto.users.map((user_id) => {
          this.deleteCommunityAtUserDocument(user_id, communityId);
        }),
      );
      throw new BadRequestException('해당하는 커뮤니티의 _id가 올바르지 않습니다.');
    }
  }

  async modifyCommunity(modifyCommunityDto: ModifyCommunityDto) {
    // TODO : refactoring을 findAndUpdate로 해서 매니저 id, deletedAt인지 바로 검증이랑 동시에 하도록..
    const community = await this.getCommunity(modifyCommunityDto.community_id);
    if (community.managerId != modifyCommunityDto.requestUserId) {
      throw new BadRequestException('사용자의 커뮤니티 수정 권한이 없습니다.');
    }
    const { requestUserId, community_id, ...updateField } = modifyCommunityDto;
    // TODO: 꼭 기다려줘야하는지 생각해보기
    await this.communityRepository.updateOne({ _id: community_id }, updateField);
  }

  async deleteCommunity(deleteCommunityDto: DeleteCommunityDto) {
    const updateField = { deletedAt: new Date() };
    let community = await this.communityRepository.findAndUpdateOne(
      {
        _id: deleteCommunityDto.community_id,
        managerId: deleteCommunityDto.managerId,
        deletedAt: { $exists: false },
      },
      updateField,
    );
    if (!community) {
      community = await this.getCommunity(deleteCommunityDto.community_id);
      if (community.managerId != deleteCommunityDto.managerId) {
        throw new BadRequestException('사용자의 커뮤니티 수정 권한이 없습니다.');
      } else if (community.deletedAt) {
        throw new BadRequestException('이미 삭제된 커뮤니티입니다.');
      }
    }
    await Promise.all(
      community.users.map((user_id) =>
        this.deleteCommunityAtUserDocument(user_id, community._id.toString()),
      ),
    );
  }
  async getCommunity(community_id: string, ...otherConditions) {
    const community = await this.communityRepository.findOne({
      _id: community_id,
      ...otherConditions[0],
    });
    if (!community) {
      throw new BadRequestException('해당하는 커뮤니티의 _id가 올바르지 않습니다.');
    }
    return community;
  }

  deleteCommunityAtUserDocument(user_id: string, community_id: string) {
    return this.userRepository.deleteObject(
      { _id: user_id },
      {
        communities: { _id: community_id },
      },
    );
  }

  async getParticipantsInCommunity(requestUserAboutCommunityDto: RequestUserAboutCommunityDto) {
    const community = await this.getCommunity(requestUserAboutCommunityDto.community_id, {
      users: { $elemMatch: { $eq: requestUserAboutCommunityDto.requestUser_id } },
    });
    const result = await Promise.all(
      community.users.map(async (_id) => {
        const user = await this.userRepository.findById(_id);
        return getUserBasicInfo(user);
      }),
    );
    return { users: result };
  }

  async exitUserInCommunity(requestUserAboutCommunityDto: RequestUserAboutCommunityDto) {
    const { requestUser_id, community_id } = requestUserAboutCommunityDto;
    const user = await this.userRepository.findById(requestUser_id);
    const community = await this.communityRepository.findById(community_id);
    if (!user) {
      throw new BadRequestException(`요청한 사용자 _id(${requestUser_id})가 올바르지 않습니다.`);
    } else if (!community) {
      throw new BadRequestException(`요청한 커뮤니티 _id가 올바르지 않습니다.`);
    } else if (requestUser_id === community.managerId) {
      throw new BadRequestException(`매니저는 커뮤니티에서 탈퇴할 수 없습니다. 매니저 위임하세요.`);
    }
    await this.deleteCommunityAtUserDocument(requestUser_id, community_id);
    await this.communityRepository.deleteElementAtArr(
      { _id: community_id },
      { users: [requestUser_id] },
    );
  }
}
