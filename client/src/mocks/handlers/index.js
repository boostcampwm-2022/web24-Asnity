import { GetUser } from './Auth';
import FriendHandlers from './Friend';

export const handlers = [GetUser, ...FriendHandlers];
