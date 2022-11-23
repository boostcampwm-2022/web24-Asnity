import {
  Body,
  Controller,
  Inject,
  LoggerService,
  Patch,
  Param,
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
import { AppendUsersToCommunityDto } from '@community/dto/append-particitants-to-community.dto';

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
}
