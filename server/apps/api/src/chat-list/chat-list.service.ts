import { Injectable } from '@nestjs/common';
import { GetMessageDto, RestoreMessageDto } from '@chat-list/dto';
import { ChannelRepository } from '@repository/channel.repository';
import { ChatListRespository } from '@repository/chat-list.respository';
import { GetUnreadMessagePointDto } from '@chat-list/dto/get-unread-message-point.dto';
import { UserRepository } from '@repository/user.repository';
import { makeChat } from '@chat-list/helper/makeChat';

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
    const chatLists = await this.chatListRespository.findById(channel.chatLists.at(-1));
    const chatNum = (channel.chatLists.length - 1) * 100 + chatLists.chat.length;

    if (chatNum % 100 === 0) {
      // chatList가 꽉 찼을 경우 새로운 chatList 생성
      const newChatList = await this.chatListRespository.create({
        chat: [makeChat(chatNum, restoreMessageDto)],
      });
      await this.channelRepository.addArrAtArr({ _id: channel._id }, 'chatLists', [
        newChatList._id.toString(),
      ]);
      return;
    }

    await this.chatListRespository.addArrAtArr({ _id: chatLists._id }, 'chat', [
      makeChat(chatNum, restoreMessageDto),
    ]);
    // chatList의 마지막 메세지일 경우 lastChatTime 업데이트
    if (chatNum % 100 === 99) {
      await this.chatListRespository.updateOne(
        { _id: chatLists._id },
        { lastChatTime: new Date() },
      );
    }
  }

  async getMessage(getMessageDto: GetMessageDto) {
    const { prev, next, channel_id } = getMessageDto;
    const channel = await this.channelRepository.findById(channel_id);

    // TODO: channel 생성 할 때 chat 추가 하는 로직 구현 시, 없앨 로직
    // 채팅 리스트가 존재하지 않는 경우 아무것도 반환하지 않음
    if (channel.chatLists.length === 0) return;

    // 요청받은 chatList의 idx
    let chatListIdx = Number(prev ?? next);
    if (chatListIdx === -1) {
      chatListIdx = channel.chatLists.length - 1;
    }

    // 요청받은 chatList idx로 chatList 정보 찾기
    const chatListId = channel.chatLists[chatListIdx];
    const chatList = await this.chatListRespository.findById(chatListId);

    const chat = JSON.parse(JSON.stringify(chatList)).chat;

    // chatListIdx === -1 : 채팅 처음 로딩 시
    if (Number(prev ?? next) === -1)
      return { prev: chatListIdx - 1 < 0 ? undefined : chatListIdx - 1, chat };
    if (prev) return { prev: +prev - 1 < 0 ? undefined : +prev - 1, chat };
    if (next) return { next: +next + 1 >= channel.chatLists.length ? undefined : +next + 1, chat };
  }

  async getUnreadMessagePoint(getUnreadMessagePointDto: GetUnreadMessagePointDto) {
    const { channel_id, requestUserId } = getUnreadMessagePointDto;
    const user = JSON.parse(JSON.stringify(await this.userRepository.findById(requestUserId)));
    const channel = await this.channelRepository.findById(channel_id);

    // TODO: channel 생성 할 때 chat 추가 하는 로직 구현 시, 없앨 로직
    if (channel.chatLists.length === 0) return;

    const lastRead = new Date(user.communities[`${channel.communityId}`].channels[`${channel_id}`]);
    const unreadChatList = JSON.parse(
      JSON.stringify(await this.getUnreadChatList(channel.chatLists, lastRead)),
    );
    return await this.getUnreadChatId(unreadChatList.chat, lastRead);
  }

  async getUnreadChatList(chatLists, lastRead) {
    for (let i = chatLists.length - 1; i >= 0; i--) {
      const chatList = await this.chatListRespository.findById(chatLists[i]);
      if (new Date(chatList.firstChatTime) < lastRead) {
        return chatList;
      }
    }
  }

  getUnreadChatId(unreadChatList, lastRead) {
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
