import AuthHandlers from './Auth';
import CommunityHandlers from './Community';
import DMHandlers from './DM';
import FriendHandlers from './Friend';
import UserHandlers from './User';

export const handlers = [
  ...AuthHandlers,
  ...FriendHandlers,
  ...UserHandlers,
  ...DMHandlers,
  ...CommunityHandlers,
];
