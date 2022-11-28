import {
  Body,
  Controller,
  Get,
  Inject,
  LoggerService,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { CommunityService } from '@api/src/community/community.service';
import { responseForm } from '@utils/responseForm';
import { JwtAccessGuard } from '@api/src/auth/guard';
import { AppendUsersToCommunityDto } from '@community/dto';

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

  @Post(':_id/participants')
  @UseGuards(JwtAccessGuard)
  async appendParticipantsToCommunity(
    @Param('_id') community_id: string,
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
}
