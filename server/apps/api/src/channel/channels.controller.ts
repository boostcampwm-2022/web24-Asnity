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

  @Patch('settings')
  @UseGuards(JwtAccessGuard)
  async modifyChannel(@Body() modifyChannelDto: ModifyChannelDto, @Req() req: any) {
    const _id = req.user._id;
    try {
      await this.channelService.modifyChannel({ ...modifyChannelDto, managerId: _id });
      return responseForm(200, { message: '채널 수정 성공!' });
    } catch (error) {
      this.logger.error(JSON.stringify(error.response));
      throw error;
    }
  }

  @Delete('/:channel_id/me')
  @UseGuards(JwtAccessGuard)
  async exitChannel(@Param('channel_id') channel_id, @Req() req: any) {
    const user_id = req.user._id;
    try {
      await this.channelService.exitChannel({ channel_id, user_id });
      return responseForm(200, { message: '채널 퇴장 성공!' });
    } catch (error) {
      this.logger.error(JSON.stringify(error.response));
      throw error;
    }
  }

  @Get(':id')
  @UseGuards(JwtAccessGuard)
  async getChannelInfo(@Param('id') channel_id: string) {
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
    const user_id = req.user._id;
    try {
      await this.channelService.deleteChannel({ channel_id, user_id });
      return responseForm(200, { message: '채널 삭제 성공' });
    } catch (error) {
      this.logger.error(JSON.stringify(error.response));
      throw error;
    }
  }

  @Post('invite')
  @UseGuards(JwtAccessGuard)
  async inviteChannel(@Body() inviteChannelDto: InviteChannelDto) {
    try {
      await this.channelService.inviteChannel(inviteChannelDto);
      return responseForm(200, { message: '채널 초대 성공' });
    } catch (error) {
      this.logger.error(JSON.stringify(error.response));
      throw error;
    }
  }

  @Post('update/lastRead')
  @UseGuards(JwtAccessGuard)
  async updateLastRead(@Body() updateLastReaddto: UpdateLastReadDto, @Req() req: any) {
    const user_id = req.user._id;
    try {
      await this.channelService.updateLastRead({ ...updateLastReaddto, user_id });
      return responseForm(200, { message: 'Last Read 업데이트 성공' });
    } catch (error) {
      this.logger.error(JSON.stringify(error.response));
      throw error;
    }
  }
}