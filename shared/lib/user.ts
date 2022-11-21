export type UserStatus = 'online' | 'offline' | 'afk';

export interface User {
  _id: string;
  id: string;
  nickname: string;
  status: UserStatus;
  profileUrl: string;
  descrption: string;
}

export interface GetUsersReponse {
  statusCode: number;
  result: {
    users: User[];
  };
}
