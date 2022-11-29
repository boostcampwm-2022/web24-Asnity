import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  LoggerService,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { CommunityService } from '@api/src/community/community.service';
import { responseForm } from '@utils/responseForm';
import { JwtAccessGuard } from '@api/src/auth/guard';
import { AppendUsersToCommunityDto, DeleteCommunityDto, ModifyCommunityDto } from '@community/dto';
import { RequestUserAboutCommunityDto } from '@community/dto/request-user-about-community.dto';

@Controller('api/communities')
export class CommunitiesController {
  constructor(
    @Inject(WINSTON_MODULE_NEST_PROVIDER) private readonly logger: LoggerService,
    private communityService: CommunityService,
  ) {}

  @Get()
  @UseGuards(JwtAccessGuard)
  async getCommunities(@Req() req: any) {
    try {
      const _id = req.user._id;
      const result = await this.communityService.getCommunities(_id);
      return responseForm(200, result);
    } catch (error) {
      this.logger.error(JSON.stringify(error.response));
      throw error;
    }
  }

  @Post(':community_id/users')
  @UseGuards(JwtAccessGuard)
  async appendParticipantsToCommunity(
    @Param('community_id') community_id: string,
    @Body() appendUsersToCommunityDto: AppendUsersToCommunityDto,
    @Req() req: any,
  ) {
    try {
      const requestUserId = req.user._id;
      await this.communityService.appendParticipantsToCommunity({
        ...appendUsersToCommunityDto,
        community_id,
        requestUserId,
      });
      return responseForm(200, { message: '커뮤니티 사용자 추가 완료' });
    } catch (error) {
      this.logger.error(JSON.stringify(error.response));
      throw error;
    }
  }

  @Delete(':community_id')
  @UseGuards(JwtAccessGuard)
  async deleteCommunity(@Param('community_id') community_id: string, @Req() req: any) {
    try {
      const managerId = req.user._id;
      const deleteCommunityDto: DeleteCommunityDto = { managerId, community_id };
      await this.communityService.deleteCommunity(deleteCommunityDto);
      return responseForm(200, { message: '커뮤니티 삭제 성공' });
    } catch (error) {
      this.logger.error(JSON.stringify(error.response));
      throw error;
    }
  }

  @Get(':community_id/users')
  @UseGuards(JwtAccessGuard)
  async getParticipantsInCommunity(@Param('community_id') community_id: string, @Req() req: any) {
    try {
      const requestUserId = req.user._id;
      const requestUserAboutCommunityDto: RequestUserAboutCommunityDto = {
        community_id,
        requestUserId,
      };
      const result = await this.communityService.getParticipantsInCommunity(
        requestUserAboutCommunityDto,
      );
      return responseForm(200, result);
    } catch (error) {
      this.logger.error(JSON.stringify(error.response));
      throw error;
    }
  }

  @Delete(':community_id/me')
  @UseGuards(JwtAccessGuard)
  async exitUserInCommunity(@Param(':community_id') community_id: string, @Req() req: any) {
    try {
      const requestUserId = req.user._id;
      const requestUserAboutCommunityDto: RequestUserAboutCommunityDto = {
        community_id,
        requestUserId,
      };
      await this.communityService.exitUserInCommunity(requestUserAboutCommunityDto);
      return responseForm(200, { message: '사용자 커뮤니티 탈퇴 성공' });
    } catch (error) {
      this.logger.error(JSON.stringify(error.response));
      throw error;
    }
  }

  @Patch(':community_id/settings')
  @UseGuards(JwtAccessGuard)
  async modifyCommunitySetting(
    @Param(':community_id') community_id: string,
    @Body() modifyCommunityDto: ModifyCommunityDto,
    @Req() req: any,
  ) {
    try {
      const requestUserId = req.user._id;
      await this.communityService.modifyCommunity({
        ...modifyCommunityDto,
        community_id,
        requestUserId,
      });
      return responseForm(200, { message: '커뮤니티 정보 수정 완료' });
    } catch (error) {
      this.logger.error(JSON.stringify(error.response));
      throw error;
    }
  }
}
