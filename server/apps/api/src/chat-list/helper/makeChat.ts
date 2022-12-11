import { RestoreMessageDto } from '@chat-list/dto';

export const makeChat = (chatNum: number, restoreMessageDto: RestoreMessageDto, date: Date) => {
  return {
    id: chatNum,
    type: restoreMessageDto.type,
    content: restoreMessageDto.content,
    senderId: restoreMessageDto.senderId,
    createdAt: date,
    updatedAt: date,
  };
};
