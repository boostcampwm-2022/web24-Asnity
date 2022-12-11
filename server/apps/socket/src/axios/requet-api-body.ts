import { RestoreMessageDto } from '@chat-list/dto';

export const getBodyData = (userId, data) => {
  if (data.chatType === 'new') {
    return {
      type: 'TEXT',
      content: data.message,
    } as RestoreMessageDto;
  } else if (data.chatType === 'delete') {
    return undefined;
  } else if (data.chatType === 'modify') {
    return { content: data.content };
  } else {
    throw Error('Unknown Message Request Type');
  }
};
