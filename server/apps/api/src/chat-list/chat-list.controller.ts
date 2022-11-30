import {
  Body,
  Controller,
  Get,
  Inject,
  LoggerService,
  Param,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { ChatListService } from '@chat-list/chat-list.service';
import { JwtAccessGuard } from '@auth/guard';
import { RestoreMessageDto } from '@chat-list/dto';
import { responseForm } from '@utils/responseForm';

@Controller('api/chat')
export class ChatListController {
  constructor(
    @Inject(WINSTON_MODULE_NEST_PROVIDER) private readonly logger: LoggerService,
    private chatListService: ChatListService,
  ) {}

  @Post(':channel_id')
  @UseGuards(JwtAccessGuard)
  async restoreMessage(
    @Param('channel_id') channel_id,
    @Body() restoreMessageDto: RestoreMessageDto,
  ) {
    try {
      await this.chatListService.restoreMessage({ ...restoreMessageDto, channel_id });
      return responseForm(200, { message: '채팅 저장 성공!' });
    } catch (error) {
      this.logger.error(JSON.stringify(error.response));
      throw error;
    }
  }

  @Get(':channel_id')
  @UseGuards(JwtAccessGuard)
  async getMessage(@Param('channel_id') channel_id, @Query() query: any, @Req() req: any) {
    const requestUserId = req.user.id;
    try {
      const chatList = await this.chatListService.getMessage({
        ...query,
        requestUserId,
        channel_id,
      });
      return responseForm(200, { chat: chatList });
    } catch (error) {
      this.logger.error(JSON.stringify(error.response));
      throw error;
    }
  }
}
