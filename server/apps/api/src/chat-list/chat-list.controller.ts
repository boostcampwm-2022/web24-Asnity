import { Body, Controller, Inject, LoggerService, Post, UseGuards } from '@nestjs/common';
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

  @Post('/')
  @UseGuards(JwtAccessGuard)
  async restoreMessage(@Body() restoreMessageDto: RestoreMessageDto) {
    try {
      await this.chatListService.restoreMessage(restoreMessageDto);
      return responseForm(200, { message: '채팅 저장 성공!' });
    } catch (error) {
      this.logger.error(JSON.stringify(error.response));
      throw error;
    }
  }
}
