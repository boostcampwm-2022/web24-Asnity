import type { Chat } from '@apis/chat';

export interface SendChatPayload {
  chatType: 'new';
  channelId: string;
  content: string;
}

export interface EditChatPayload {
  chatType: 'modify';
  channelId: string;
  chatId: number;
  content: string;
}

export interface RemoveChatPayload {
  chatType: 'delete';
  channelId: string;
  chatId: number;
}

export interface SocketChatInfo extends Chat {
  channelId: string;
  communityId: string;
}

export type ChatMutationEmitCallbackParameter =
  | { written: true; chatInfo: SocketChatInfo }
  | { written: false; chatInfo: undefined };

export type ChatMutationEmitCallback = (
  param: ChatMutationEmitCallbackParameter,
) => void;
