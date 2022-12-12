import { Controller, Post, UseGuards } from '@nestjs/common';
import { ChannelService } from '@channel/channel.service';
import { JwtAccessGuard } from '@auth/guard';
import { CreateChannelDto } from '@channel/dto';
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
    const updateLastReadDto = {
      requestUserId: newChannel.managerId,
      community_id: newChannel.communityId,
      channel_id: newChannel._id,
    };
    await this.channelService.updateLastRead(updateLastReadDto);
    delete newChannel.users;
    return newChannel;
  }
}
