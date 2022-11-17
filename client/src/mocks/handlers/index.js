import AuthHandlers from './Auth';
import FriendHandlers from './Friend';

export const handlers = [...AuthHandlers, ...FriendHandlers];
