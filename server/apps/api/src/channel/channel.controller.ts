import { Controller, Post, UseGuards } from '@nestjs/common';
import { ChannelService } from '@channel/channel.service';
import { JwtAccessGuard } from '@auth/guard';
import { CreateChannelDto } from '@channel/dto';
import { responseForm } from '@utils/responseForm';
import { ReceivedData } from '@custom/decorator/ReceivedData.decorator';
import { userToManagerPipe } from '@custom/pipe/userToManger.pipe';
import { BotService } from '@channel/bot.service';

@Controller('api/channel')
export class ChannelController {
  constructor(private channelService: ChannelService, private botService: BotService) {}

  @Post()
  @UseGuards(JwtAccessGuard)
  async createChannel(@ReceivedData(userToManagerPipe) createChannelDto: CreateChannelDto) {
    const newChannel = await this.channelService.createChannel(createChannelDto);
    await this.botService.infoMakeChannel(newChannel._id, createChannelDto.nickname);

    delete newChannel.users;
    return responseForm(200, newChannel);
  }
}
