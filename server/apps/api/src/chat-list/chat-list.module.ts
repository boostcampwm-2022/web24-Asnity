import { forwardRef, Module } from '@nestjs/common';
import { ChatListController } from '@chat-list/chat-list.controller';
import { ChatListService } from '@chat-list/chat-list.service';
import { ChatListRespository } from '@repository/chat-list.respository';
import { ChannelRepository } from '@repository/channel.repository';
import { MongooseModule } from '@nestjs/mongoose';
import { ChatList, ChatListSchema } from '@schemas/chat-list.schema';
import { ChannelModule } from '@channel/channel.module';
import { UserRepository } from '@repository/user.repository';
import { UserModule } from '@user/user.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: ChatList.name, schema: ChatListSchema }]),
    forwardRef(() => ChannelModule),
    UserModule,
  ],
  controllers: [ChatListController],
  providers: [ChatListService, ChatListRespository, ChannelRepository, UserRepository],
  exports: [MongooseModule],
})
export class ChatListModule {}
