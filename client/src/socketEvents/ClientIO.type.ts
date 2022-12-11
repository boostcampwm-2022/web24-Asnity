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
