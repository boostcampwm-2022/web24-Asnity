export interface ModifyMessage {
  chatType: string;
  channelId: string;
  content: string;
  chatId: string;
  cb: () => void;
}
