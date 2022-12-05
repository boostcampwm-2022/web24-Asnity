import { Body, Controller, Inject, LoggerService, Post, Req, UseGuards } from '@nestjs/common';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { ChannelService } from '@channel/channel.service';
import { JwtAccessGuard } from '@auth/guard';
import { CreateChannelDto } from '@channel/dto';
import { responseForm } from '@utils/responseForm';

@Controller('api/channel')
export class ChannelController {
  constructor(private channelService: ChannelService) {}

  @Post()
  @UseGuards(JwtAccessGuard)
  async createChannel(@Body() createChannelDto: CreateChannelDto, @Req() req: any) {
    const requestUserId = req.user._id;
    const newChannel = await this.channelService.createChannel({
      ...createChannelDto,
      managerId: requestUserId,
    });
    delete newChannel.users;
    return responseForm(200, newChannel);
  }
}
