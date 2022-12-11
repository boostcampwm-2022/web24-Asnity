import { BOT_ID } from '@utils/def';
import { makeChat } from '@chat-list/helper/makeChat';
import { ChatListRespository } from '@repository/chat-list.respository';
import { ChannelRepository } from '@repository/channel.repository';
import { Injectable } from '@nestjs/common';

const makeBotMessageDate = () =>
  new Date().toLocaleDateString('ko', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
  });

@Injectable()
export class BotService {
  constructor(
    private readonly chatListRepository: ChatListRespository,
    private readonly channelRepository: ChannelRepository,
  ) {}
  async infoMakeChannel(channel_id, nickname) {
    const botMessage = {
      channel_id: channel_id,
      type: 'SYSTEM',
      content: `${nickname}님이 이 채널을 ${makeBotMessageDate()}에 생성했습니다.`,
      senderId: BOT_ID,
    } as const;
    const newChatList = await this.chatListRepository.create({
      chat: [makeChat(0, botMessage, new Date())],
    });
    await this.channelRepository.addArrAtArr({ _id: channel_id }, 'chatLists', [
      newChatList._id.toString(),
    ]);
  }
}
