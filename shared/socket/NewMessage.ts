export interface NewMessage {
  chatType: string;
  channelId: string;
  content: string;
  cb: () => void;
}
