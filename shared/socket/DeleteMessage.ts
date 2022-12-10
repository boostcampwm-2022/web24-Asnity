export interface DeleteMessage {
  type: string;
  channelId: string;
  message: string;
  messageId: string;
  cb: () => void;
}
