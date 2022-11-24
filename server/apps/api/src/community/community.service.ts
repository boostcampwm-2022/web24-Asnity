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

@Injectable()
export class CommunityService {
  constructor(
    private readonly communityRepository: CommunityRepository,
    private readonly userRepository: UserRepository,
  ) {}

  async createCommunity(createCommunityDto: CreateCommunityDto) {
    const community = await this.communityRepository.create({
      ...createCommunityDto,
      users: [createCommunityDto.managerId],
    });
    const newCommunity = makeCommunityObj(community._id.toString());
    await this.userRepository.updateObject({ _id: createCommunityDto.managerId }, newCommunity);
    return community;
  }

  async appendParticipantsToCommunity(
    reqUser,
    appendUsersToCommunityDto: AppendUsersToCommunityDto,
  ) {
    const communityId = appendUsersToCommunityDto.community_id;
    if (!IsUserInCommunity(reqUser, communityId)) {
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
          this.userRepository.deleteObject({ _id: user_id }, newCommunity);
        }),
      );
      throw new BadRequestException('해당하는 커뮤니티의 _id가 올바르지 않습니다.');
    }
  }

  async modifyCommunity(modifyCommunityDto: ModifyCommunityDto) {
    // TODO : refactoring을 findAndUpdate로 해서 매니저 id, deletedAt인지 바로 검증이랑 동시에 하도록..
    const community = await this.verfiyCommunity(modifyCommunityDto.community_id);
    if (community.managerId != modifyCommunityDto.managerId) {
      throw new BadRequestException('사용자의 커뮤니티 수정 권한이 없습니다.');
    }
    const { managerId, community_id, ...updateField } = modifyCommunityDto;
    // TODO: 꼭 기다려줘야하는지 생각해보기
    return await this.communityRepository.updateOne({ _id: community_id }, updateField);
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
      community = await this.verfiyCommunity(deleteCommunityDto.community_id);
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
  async verfiyCommunity(community_id: string) {
    const community = await this.communityRepository.findOne({ _id: community_id });
    if (!community) {
      throw new BadRequestException('해당하는 커뮤니티의 _id가 올바르지 않습니다.');
    }
    return community;
  }

  deleteCommunityAtUserDocument(user_id: string, community_id: string) {
    this.userRepository.deleteElementAtArr(
      { _id: user_id },
      {
        communities: [community_id],
      },
    );
  }
}
