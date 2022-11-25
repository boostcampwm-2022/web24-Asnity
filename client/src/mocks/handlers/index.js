import AuthHandlers from './Auth';
import DMHandlers from './DM';
import FriendHandlers from './Friend';
import UserHandlers from './User';

export const handlers = [
  ...AuthHandlers,
  ...FriendHandlers,
  ...UserHandlers,
  ...DMHandlers,
];
