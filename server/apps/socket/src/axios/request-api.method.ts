export const filterHttpMethod = (type) =>
  type === 'new' ? 'post' : type === 'modify' ? 'patch' : 'delete';
