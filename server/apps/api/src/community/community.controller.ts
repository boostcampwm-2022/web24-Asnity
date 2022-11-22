import {
  Body,
  Controller,
  Inject,
  LoggerService,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { CommunityService } from '@api/src/community/community.service';
import { CreateCommunityDto } from '@api/src/community/dto/create-community.dto';
import { responseForm } from '@utils/responseForm';
import { ModifyUserDto } from '@user/dto/modify-user.dto';
import { JwtAccessGuard } from '@api/src/auth/guard';
import { ModifyCommunityDto } from '@api/src/community/dto/modify-community.dto';

@Controller('api/community')
export class CommunityController {
  constructor(
    @Inject(WINSTON_MODULE_NEST_PROVIDER) private readonly logger: LoggerService,
    private communityService: CommunityService,
  ) {}

  @Post()
  async crateCommunity(@Body() createCommunityDto: CreateCommunityDto) {
    try {
      const _id = '6379c1b25d4f08bbe0c940e1';
      const result = await this.communityService.createCommunity({
        managerId: _id,
        ...createCommunityDto,
      });
      return responseForm(200, result);
    } catch (error) {
      this.logger.error(JSON.stringify(error.response));
      if (process.env.NODE_ENV == 'prod') {
        throw error;
      } else {
        return error.response;
      }
    }
  }

  @Patch('settings')
  @UseGuards(JwtAccessGuard)
  async modifyCommunitySetting(@Body() modifyCommunityDto: ModifyCommunityDto, @Req() req: any) {
    try {
      const _id = req.user._id;
      await this.communityService.modifyCommunity({ ...modifyCommunityDto, managerId: _id });
      return responseForm(200, {});
    } catch (error) {
      this.logger.error(JSON.stringify(error.response));
      // TODO : error response header status code 어떻게 할지 논의
      throw error; // 이렇게하면 header status code 400 간다.
    }
  }
}
