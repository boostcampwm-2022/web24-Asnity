export interface DeleteMessage {
  chatType: string;
  channelId: string;
  chatId: string;
  cb: () => void;
}
