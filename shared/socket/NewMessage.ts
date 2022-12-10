export interface NewMessage {
  type: string;
  channelId: string;
  user_id: string;
  message: string;
  id: string;
  time: Date;
  cb: () => void;
}
