import { Controller, Get, Post, UseGuards } from '@nestjs/common';
import { ChatListService } from '@chat-list/chat-list.service';
import { JwtAccessGuard } from '@auth/guard';
import { GetMessageDto, RestoreMessageDto } from '@chat-list/dto';
import { ReceivedData } from '@custom/decorator/ReceivedData.decorator';
import { userToSenderPipe } from '@custom/pipe/userToSender.pipe';
import { GetUnreadMessagePointDto } from '@chat-list/dto/get-unread-message-point.dto';

@Controller('api/channels')
export class ChatListController {
  constructor(private chatListService: ChatListService) {}

  @Post(':channel_id/chat')
  @UseGuards(JwtAccessGuard)
  async restoreMessage(@ReceivedData(userToSenderPipe) restoreMessageDto: RestoreMessageDto) {
    return await this.chatListService.restoreMessage(restoreMessageDto);
  }

  @Get(':channel_id/chat')
  @UseGuards(JwtAccessGuard)
  async getMessage(@ReceivedData() getMessageDto: GetMessageDto) {
    return await this.chatListService.getMessage(getMessageDto);
  }

  @Get(':channel_id/unread-chat')
  @UseGuards(JwtAccessGuard)
  async getUnreadMessagePoint(@ReceivedData() getUnreadMessageDto: GetUnreadMessagePointDto) {
    const unreadChatId = await this.chatListService.getUnreadMessagePoint(getUnreadMessageDto);
    return { unreadChatId };
  }
}
