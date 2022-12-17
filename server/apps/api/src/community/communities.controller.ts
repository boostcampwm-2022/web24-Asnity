import { Controller, Delete, Get, Patch, Post, Req, UseGuards } from '@nestjs/common';
import { CommunityService } from '@api/src/community/community.service';
import { JwtAccessGuard } from '@api/src/auth/guard';
import { AppendUsersToCommunityDto, DeleteCommunityDto, ModifyCommunityDto } from '@community/dto';
import { RequestUserAboutCommunityDto } from '@community/dto/request-user-about-community.dto';
import { ReceivedData } from '@custom/decorator/ReceivedData.decorator';

@Controller('api/communities')
export class CommunitiesController {
  constructor(private communityService: CommunityService) {}

  @Get()
  @UseGuards(JwtAccessGuard)
  async getCommunities(@Req() req: any) {
    const requestUserid = req.user._id;
    const result = await this.communityService.getCommunities(requestUserid);
    return result;
  }

  @Post(':community_id/users')
  @UseGuards(JwtAccessGuard)
  async appendUsersToCommunity(
    @ReceivedData() appendUsersToCommunityDto: AppendUsersToCommunityDto,
  ) {
    await this.communityService.appendUsersToCommunity(appendUsersToCommunityDto);
    return { message: '커뮤니티 사용자 추가 완료' };
  }

  @Delete(':community_id')
  @UseGuards(JwtAccessGuard)
  async deleteCommunity(@ReceivedData() deleteCommunityDto: DeleteCommunityDto) {
    await this.communityService.deleteCommunity(deleteCommunityDto);
    return { message: '커뮤니티 삭제 성공' };
  }

  @Get(':community_id/users')
  @UseGuards(JwtAccessGuard)
  async getUsersInCommunity(
    @ReceivedData() requestUserAboutCommunityDto: RequestUserAboutCommunityDto,
  ) {
    const result = await this.communityService.getUsersInCommunity(requestUserAboutCommunityDto);
    return result;
  }

  @Delete(':community_id/me')
  @UseGuards(JwtAccessGuard)
  async exitUserInCommunity(
    @ReceivedData() requestUserAboutCommunityDto: RequestUserAboutCommunityDto,
  ) {
    await this.communityService.exitUserInCommunity(requestUserAboutCommunityDto);
    return { message: '사용자 커뮤니티 탈퇴 성공' };
  }

  @Patch(':community_id/settings')
  @UseGuards(JwtAccessGuard)
  async modifyCommunitySetting(@ReceivedData() modifyCommunityDto: ModifyCommunityDto) {
    await this.communityService.modifyCommunity(modifyCommunityDto);
    return { message: '커뮤니티 정보 수정 완료' };
  }
}
