import { Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { responseForm } from '@utils/responseForm';
import { ChannelService } from '@channel/channel.service';
import {
  DeleteChannelDto,
  ExitChannelDto,
  InviteChannelDto,
  JoinChannelDto,
  ModifyChannelDto,
  UpdateLastReadDto,
} from '@channel/dto';
import { JwtAccessGuard } from '@auth/guard';
import { ReceivedData } from '@custom/decorator/ReceivedData.decorator';
import { ObjectIdValidationPipe } from '@custom/pipe/mongodbObjectIdValidation.pipe';

@Controller('api/channels')
export class ChannelsController {
  constructor(private channelService: ChannelService) {}

  @Patch(':channel_id/settings')
  @UseGuards(JwtAccessGuard)
  async modifyChannel(@ReceivedData() modifyChannelDto: ModifyChannelDto) {
    await this.channelService.modifyChannel(modifyChannelDto);
    return responseForm(200, { message: '채널 수정 성공!' });
  }

  @Delete(':channel_id/me')
  @UseGuards(JwtAccessGuard)
  async exitChannel(@ReceivedData() exitChannelDto: ExitChannelDto) {
    await this.channelService.exitChannel(exitChannelDto);
    return responseForm(200, { message: '채널 퇴장 성공!' });
  }

  @Get(':channel_id')
  @UseGuards(JwtAccessGuard)
  async getChannelInfo(@Param('channel_id', ObjectIdValidationPipe) channel_id) {
    const channelInfo = await this.channelService.getChannelInfo(channel_id);
    return responseForm(200, channelInfo);
  }

  @Delete(':channel_id')
  @UseGuards(JwtAccessGuard)
  async deleteChannel(@ReceivedData() deleteChannelDto: DeleteChannelDto) {
    await this.channelService.deleteChannel(deleteChannelDto);
    return responseForm(200, { message: '채널 삭제 성공' });
  }

  @Post(':channel_id/users')
  @UseGuards(JwtAccessGuard)
  async inviteChannel(@ReceivedData() inviteChannelDto: InviteChannelDto) {
    const channelInfo = await this.channelService.inviteChannel(inviteChannelDto);
    return responseForm(200, channelInfo);
  }

  @Patch(':channel_id/lastRead')
  @UseGuards(JwtAccessGuard)
  async updateLastRead(@ReceivedData() updateLastReadDto: UpdateLastReadDto) {
    await this.channelService.updateLastRead(updateLastReadDto);
    return responseForm(200, { message: 'Last Read 업데이트 성공' });
  }

  @Post(':channel_id')
  @UseGuards(JwtAccessGuard)
  async joinChannel(@ReceivedData() joinChannelDto: JoinChannelDto) {
    const channelInfo = await this.channelService.joinChannel(joinChannelDto);
    return responseForm(200, channelInfo);
  }
}
