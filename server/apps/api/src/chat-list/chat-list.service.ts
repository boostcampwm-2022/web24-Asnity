import { Injectable } from '@nestjs/common';
import { RestoreMessageDto } from '@chat-list/dto';
import { ChannelRepository } from '@repository/channel.repository';
import { ChatListRespository } from '@repository/chat-list.respository';

@Injectable()
export class ChatListService {
  constructor(
    private readonly channelRepository: ChannelRepository,
    private readonly chatListRespository: ChatListRespository,
  ) {}
  async restoreMessage(restoreMessageDto: RestoreMessageDto) {
    const { channel_id } = restoreMessageDto;

    const channel = await this.channelRepository.findById(channel_id);
    console.log(channel.chatLists.length);

    // TODO: channel 도큐먼트의 chatList가 없으면 생성
    if (channel.chatLists.length === 0) {
      const newChatList = await this.chatListRespository.create({
        chat: [this.getChat(0, restoreMessageDto)],
      });
      await this.channelRepository.addArrAtArr({ _id: channel_id }, 'chatLists', [
        newChatList._id.toString(),
      ]);
      return;
    }

    const chatLists = await this.chatListRespository.findById(channel.chatLists.at(-1));
    const chatNum = (channel.chatLists.length - 1) * 100 + chatLists.chat.length;
    console.log(chatNum);

    if (chatNum % 100 === 0) {
      const newChatList = await this.chatListRespository.create({
        chat: [this.getChat(chatNum, restoreMessageDto)],
      });
      await this.channelRepository.addArrAtArr({ _id: channel_id }, 'chatLists', [
        newChatList._id.toString(),
      ]);
    } else {
      await this.chatListRespository.addArrAtArr({ _id: chatLists._id }, 'chat', [
        this.getChat(chatNum, restoreMessageDto),
      ]);
    }
  }

  getChat(chatNum, restoreMessageDto) {
    return {
      id: chatNum,
      type: restoreMessageDto.type,
      content: restoreMessageDto.content,
      senderId: restoreMessageDto.senderId,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
  }
}
