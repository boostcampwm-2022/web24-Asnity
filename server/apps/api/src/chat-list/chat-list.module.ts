import { Module } from '@nestjs/common';
import { ChatListController } from './chat-list.controller';
import { ChatListService } from './chat-list.service';
import { ChatListRespository } from '@repository/chat-list.respository';

@Module({
  controllers: [ChatListController],
  providers: [ChatListService, ChatListRespository],
})
export class ChatListModule {}
