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
import { responseForm } from '@utils/responseForm';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { ChannelService } from '@channel/channel.service';
import { InviteChannelDto, ModifyChannelDto, UpdateLastReadDto } from '@channel/dto';
import { JwtAccessGuard } from '@auth/guard';

@Controller('api/channels')
export class ChannelsController {
  constructor(
    @Inject(WINSTON_MODULE_NEST_PROVIDER) private readonly logger: LoggerService,
    private channelService: ChannelService,
  ) {}

  @Patch(':channel_id/settings')
  @UseGuards(JwtAccessGuard)
  async modifyChannel(
    @Param('channel_id') channel_id,
    @Body() modifyChannelDto: ModifyChannelDto,
    @Req() req: any,
  ) {
    const requestUserId = req.user._id;
    try {
      await this.channelService.modifyChannel({ ...modifyChannelDto, channel_id, requestUserId });
      return responseForm(200, { message: '채널 수정 성공!' });
    } catch (error) {
      this.logger.error(JSON.stringify(error.response));
      throw error;
    }
  }

  @Delete(':channel_id/me')
  @UseGuards(JwtAccessGuard)
  async exitChannel(@Param('channel_id') channel_id, @Req() req: any) {
    const requestUserId = req.user._id;
    try {
      await this.channelService.exitChannel({ channel_id, requestUserId });
      return responseForm(200, { message: '채널 퇴장 성공!' });
    } catch (error) {
      this.logger.error(JSON.stringify(error.response));
      throw error;
    }
  }

  @Get(':channel_id')
  @UseGuards(JwtAccessGuard)
  async getChannelInfo(@Param('channel_id') channel_id: string) {
    try {
      const channelInfo = await this.channelService.getChannelInfo(channel_id);
      return responseForm(200, channelInfo);
    } catch (error) {
      this.logger.error(JSON.stringify(error.response));
      throw error;
    }
  }

  @Delete(':channel_id')
  @UseGuards(JwtAccessGuard)
  async deleteChannel(@Param('channel_id') channel_id, @Req() req: any) {
    const requestUserId = req.user._id;
    try {
      await this.channelService.deleteChannel({ channel_id, requestUserId });
      return responseForm(200, { message: '채널 삭제 성공' });
    } catch (error) {
      this.logger.error(JSON.stringify(error.response));
      throw error;
    }
  }

  @Post(':channel_id/users')
  @UseGuards(JwtAccessGuard)
  async inviteChannel(@Param('channel_id') channel_id, @Body() inviteChannelDto: InviteChannelDto) {
    try {
      await this.channelService.inviteChannel({ ...inviteChannelDto, channel_id });
      return responseForm(200, { message: '채널 초대 성공' });
    } catch (error) {
      this.logger.error(JSON.stringify(error.response));
      throw error;
    }
  }

  @Patch(':channel_id/lastRead')
  @UseGuards(JwtAccessGuard)
  async updateLastRead(
    @Param('channel_id') channel_id,
    @Body() updateLastReadDto: UpdateLastReadDto,
    @Req() req: any,
  ) {
    const requestUserId = req.user._id;
    try {
      await this.channelService.updateLastRead({ ...updateLastReadDto, requestUserId, channel_id });
      return responseForm(200, { message: 'Last Read 업데이트 성공' });
    } catch (error) {
      this.logger.error(JSON.stringify(error.response));
      throw error;
    }
  }

  @Post(':channel_id')
  @UseGuards(JwtAccessGuard)
  async joinChannel(@Param('channel_id') channel_id, @Body() { community_id }, @Req() req: any) {
    const requestUserId = req.user._id;
    try {
      await this.channelService.joinChannel({ requestUserId, channel_id, community_id });
      return responseForm(200, { message: '채널 접속 성공!' });
    } catch (error) {
      this.logger.error(JSON.stringify(error.response));
      throw error;
    }
  }
}
