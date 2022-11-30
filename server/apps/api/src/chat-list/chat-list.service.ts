import { Injectable } from '@nestjs/common';
import { GetMessageDto, RestoreMessageDto } from '@chat-list/dto';
import { ChannelRepository } from '@repository/channel.repository';
import { ChatListRespository } from '@repository/chat-list.respository';
import { GetUnreadMessagePointDto } from '@chat-list/dto/get-unread-message-point.dto';
import { UserRepository } from '@repository/user.repository';

@Injectable()
export class ChatListService {
  constructor(
    private readonly channelRepository: ChannelRepository,
    private readonly chatListRespository: ChatListRespository,
    private readonly userRepository: UserRepository,
  ) {}
  async restoreMessage(restoreMessageDto: RestoreMessageDto) {
    const { channel_id } = restoreMessageDto;

    const channel = await this.channelRepository.findById(channel_id);

    if (channel.chatLists.length === 0) {
      // chatList가 없는 경우 새로 생성
      const newChatList = await this.chatListRespository.create({
        chat: [this.makeChat(0, restoreMessageDto)],
      });
      await this.channelRepository.addArrAtArr({ _id: channel_id }, 'chatLists', [
        newChatList._id.toString(),
      ]);
      return;
    }

    const chatLists = await this.chatListRespository.findById(channel.chatLists.at(-1));
    const chatNum = (channel.chatLists.length - 1) * 100 + chatLists.chat.length;

    if (chatNum % 100 === 0) {
      // chatList가 꽉 찼을 때
      const newChatList = await this.chatListRespository.create({
        chat: [this.makeChat(chatNum, restoreMessageDto)],
      });
      await this.channelRepository.addArrAtArr({ _id: channel_id }, 'chatLists', [
        newChatList._id.toString(),
      ]);
    } else {
      await this.chatListRespository.addArrAtArr({ _id: chatLists._id }, 'chat', [
        this.makeChat(chatNum, restoreMessageDto),
      ]);
      if (chatNum % 100 === 99) {
        await this.chatListRespository.updateOne(
          { _id: chatLists._id },
          { lastChatTime: new Date() },
        );
      }
    }
  }

  makeChat(chatNum, restoreMessageDto) {
    return {
      id: chatNum,
      type: restoreMessageDto.type,
      content: restoreMessageDto.content,
      senderId: restoreMessageDto.senderId,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
  }

  async getMessage(getMessageDto: GetMessageDto) {
    const { prev, next, channel_id } = getMessageDto;
    const channel = await this.channelRepository.findById(channel_id);

    // 채팅 리스트가 존재하지 않는 경우 아무것도 반환하지 않음
    if (channel.chatLists.length === 0) return;

    // 요청받은 chatList의 idx
    let chatListIdx = Number(prev ?? next);
    if (chatListIdx === -1) chatListIdx = channel.chatLists.length - 1;

    // 요청받은 chatList idx로 chatList 정보 찾기
    const chatListId = channel.chatLists[chatListIdx];
    const chatList = await this.chatListRespository.findById(chatListId);

    return JSON.parse(JSON.stringify(chatList)).chat;
  }

  async getUnreadMessagePoint(getUnreadMessagePointDto: GetUnreadMessagePointDto) {
    const { channel_id, requestUserId } = getUnreadMessagePointDto;
    const user = JSON.parse(JSON.stringify(await this.userRepository.findById(requestUserId)));
    const channel = await this.channelRepository.findById(channel_id);
    if (channel.chatLists.length === 0) return;
    const lastRead = new Date(user.communities[`${channel.communityId}`].channels[`${channel_id}`]);
    const unreadChatList = JSON.parse(
      JSON.stringify(await this.getUnreadChatList(channel.chatLists, lastRead)),
    );
    const unreadChatId = await this.getUnreadChatId(unreadChatList.chat, lastRead);

    return unreadChatId;
  }

  async getUnreadChatList(chatLists, lastRead) {
    for (let i = chatLists.length - 1; i >= 0; i--) {
      const chatList = await this.chatListRespository.findById(chatLists[i]);
      console.log(new Date(chatList.firstChatTime));
      console.log(lastRead);
      if (new Date(chatList.firstChatTime) < lastRead) {
        return chatList;
      }
    }
  }

  async getUnreadChatId(unreadChatList, lastRead) {
    let L = 0;
    let R = unreadChatList.length - 1;
    let M;
    while (L <= R) {
      M = Math.floor((L + R) / 2);
      if (new Date(unreadChatList[M].createdAt) < lastRead) {
        L = M + 1;
      } else {
        R = M - 1;
      }
    }
    return unreadChatList[M].id;
  }
}
