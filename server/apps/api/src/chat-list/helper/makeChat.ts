export const makeChat = (chatNum, restoreMessageDto) => {
  return {
    id: chatNum,
    type: restoreMessageDto.type,
    content: restoreMessageDto.content,
    senderId: restoreMessageDto.senderId,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
};
