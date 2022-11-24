import AuthHandlers from './Auth';
import FriendHandlers from './Friend';
import UserHandlers from './User';

export const handlers = [...AuthHandlers, ...FriendHandlers, ...UserHandlers];
