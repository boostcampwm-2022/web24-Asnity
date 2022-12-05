import { Body, Controller, Get, Param, Post, Query, Req, UseGuards } from '@nestjs/common';
import { ChatListService } from '@chat-list/chat-list.service';
import { JwtAccessGuard } from '@auth/guard';
import { RestoreMessageDto } from '@chat-list/dto';
import { responseForm } from '@utils/responseForm';

@Controller('api/chat')
export class ChatListController {
  constructor(private chatListService: ChatListService) {}

  @Post(':channel_id')
  @UseGuards(JwtAccessGuard)
  async restoreMessage(
    @Param('channel_id') channel_id,
    @Body() restoreMessageDto: RestoreMessageDto,
  ) {
    await this.chatListService.restoreMessage({ ...restoreMessageDto, channel_id });
    return responseForm(200, { message: '채팅 저장 성공!' });
  }

  @Get(':channel_id')
  @UseGuards(JwtAccessGuard)
  async getMessage(@Param('channel_id') channel_id, @Query() query: any, @Req() req: any) {
    const requestUserId = req.user._id;
    const chatList = await this.chatListService.getMessage({
      ...query,
      requestUserId,
      channel_id,
    });
    return responseForm(200, chatList);
  }
  @Get(':channel_id/unread-message')
  @UseGuards(JwtAccessGuard)
  async getUnreadMessagePoint(@Param('channel_id') channel_id, @Req() req: any) {
    const requestUserId = req.user._id;
    const unreadChatId = await this.chatListService.getUnreadMessagePoint({
      requestUserId,
      channel_id,
    });
    return responseForm(200, { unreadChatId });
  }
}
