import {
  Body,
  Controller,
  Delete,
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
import {
  CreateCommunityDto,
  AppendUsersToCommunityDto,
  ModifyCommunityDto,
  DeleteCommunityDto,
} from './dto';

@Controller('api/community')
export class CommunityController {
  constructor(
    @Inject(WINSTON_MODULE_NEST_PROVIDER) private readonly logger: LoggerService,
    private communityService: CommunityService,
  ) {}

  @Post()
  @UseGuards(JwtAccessGuard)
  async crateCommunity(@Body() createCommunityDto: CreateCommunityDto, @Req() req: any) {
    try {
      const _id = req.user._id;
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

  @Post('participants')
  @UseGuards(JwtAccessGuard)
  async appendParticipantsToCommunity(
    // @Param('community_id') community_id: string,
    // @Body('users') users: string[],
    @Body() appendUsersToCommunityDto: AppendUsersToCommunityDto,
    @Req() req: any,
  ) {
    try {
      const _id = req.user._id;
      // const appendUsersToCommunityDto: AppendUsersToCommunityDto = {
      //   requestUser_id: _id,
      //   community_id,
      // };
      // console.log(users);
      const result = await this.communityService.appendParticipantsToCommunity({
        ...appendUsersToCommunityDto,
        requestUser_id: _id,
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

  @Delete(':_id')
  @UseGuards(JwtAccessGuard)
  async deleteCommunity(@Param('_id') community_id: string, @Req() req: any) {
    try {
      const managerId = req.user._id;
      const deleteCommunityDto: DeleteCommunityDto = { managerId, community_id };
      const result = await this.communityService.deleteCommunity(deleteCommunityDto);
      return responseForm(200, {});
    } catch (error) {
      this.logger.error(JSON.stringify(error.response));
      if (process.env.NODE_ENV == 'prod') {
        throw error;
      } else {
        return error.response;
      }
    }
  }
}
