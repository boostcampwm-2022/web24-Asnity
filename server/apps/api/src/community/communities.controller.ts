import { Controller, Get, Inject, LoggerService, Req, UseGuards } from '@nestjs/common';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { CommunityService } from '@api/src/community/community.service';
import { responseForm } from '@utils/responseForm';
import { JwtAccessGuard } from '@api/src/auth/guard';

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
}
