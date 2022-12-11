import type { Chat } from '@apis/chat';
import type { UserUID } from '@apis/user';

export const CHAT_MUTATION_TYPE = {
  NEW: 'new',
  EDIT: 'modify',
  REMOVE: 'delete',
} as const;

export interface JoinChannelsPayload {
  channels: string[];
}

export interface SendChatPayload {
  chatType: typeof CHAT_MUTATION_TYPE.NEW;
  channelId: string;
  content: string;
}

export interface EditChatPayload {
  chatType: typeof CHAT_MUTATION_TYPE.EDIT;
  channelId: string;
  chatId: number;
  content: string;
}

export interface RemoveChatPayload {
  chatType: typeof CHAT_MUTATION_TYPE.REMOVE;
  channelId: string;
  chatId: number;
}

export interface InviteUserToChannelPayload {
  communityId: string;
  channelId: string;
  users: UserUID[];
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
