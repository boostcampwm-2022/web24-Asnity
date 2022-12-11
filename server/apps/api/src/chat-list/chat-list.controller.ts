import { Controller, Get, Param, Post, Query, Req, UseGuards } from '@nestjs/common';
import { ChatListService } from '@chat-list/chat-list.service';
import { JwtAccessGuard } from '@auth/guard';
import { RestoreMessageDto } from '@chat-list/dto';
import { ReceivedData } from '@custom/decorator/ReceivedData.decorator';
import { userToSenderPipe } from '@custom/pipe/userToSender.pipe';

@Controller('api/channels')
export class ChatListController {
  constructor(private chatListService: ChatListService) {}

  @Post(':channel_id/chat')
  @UseGuards(JwtAccessGuard)
  async restoreMessage(@ReceivedData(userToSenderPipe) restoreMessageDto: RestoreMessageDto) {
    return await this.chatListService.restoreMessage(restoreMessageDto);
  }

  @Get(':channel_id/message')
  @UseGuards(JwtAccessGuard)
  async getMessage(@Param('channel_id') channel_id, @Query() query: any, @Req() req: any) {
    const requestUserId = req.user._id;
    const chatList = await this.chatListService.getMessage({
      ...query,
      requestUserId,
      channel_id,
    });
    return chatList;
  }
  @Get(':channel_id/unread-message')
  @UseGuards(JwtAccessGuard)
  async getUnreadMessagePoint(@Param('channel_id') channel_id, @Req() req: any) {
    const requestUserId = req.user._id;
    const unreadChatId = await this.chatListService.getUnreadMessagePoint({
      requestUserId,
      channel_id,
    });
    return { unreadChatId };
  }
}
