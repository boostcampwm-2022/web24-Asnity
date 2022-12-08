import { Controller, Post, UseGuards } from '@nestjs/common';
import { ChannelService } from '@channel/channel.service';
import { JwtAccessGuard } from '@auth/guard';
import { CreateChannelDto } from '@channel/dto';
import { responseForm } from '@utils/responseForm';
import { ReceivedData } from '@custom/decorator/ReceivedData.decorator';

@Controller('api/channel')
export class ChannelController {
  constructor(private channelService: ChannelService) {}

  @Post()
  @UseGuards(JwtAccessGuard)
  async createChannel(@ReceivedData() createChannelDto: CreateChannelDto) {
    createChannelDto['managerId'] = createChannelDto.requestUserId;
    delete createChannelDto.requestUserId;

    const newChannel = await this.channelService.createChannel(createChannelDto);

    delete newChannel.users;
    return responseForm(200, newChannel);
  }
}
