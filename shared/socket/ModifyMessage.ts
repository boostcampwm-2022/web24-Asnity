export interface ModifyMessage {
  type: string;
  channelId: string;
  message: string;
  messageId: string;
  cb: () => void;
}
