import { RestoreMessageDto } from '@chat-list/dto';

export const makeChat = (chatNum: number, restoreMessageDto: RestoreMessageDto) => {
  return {
    id: chatNum,
    type: restoreMessageDto.type,
    content: restoreMessageDto.content,
    senderId: restoreMessageDto.senderId,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
};
