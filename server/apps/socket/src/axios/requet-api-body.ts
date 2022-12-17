export const getBodyData = (data) => {
  if (data.chatType === 'new') {
    return {
      type: 'TEXT',
      content: data.content,
    };
  } else if (data.chatType === 'delete') {
    return undefined;
  } else if (data.chatType === 'modify') {
    return { content: data.content };
  } else {
    throw Error('Unknown Message Request Type');
  }
};
