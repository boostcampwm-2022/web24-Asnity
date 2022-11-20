export interface User {
  _id: string;
  id: string;
  nickname: string;
  status: string;
  profileUrl: string;
  descrption: string;
}

export interface GetUserReponse {
  statusCode: number;
  result: {
    users: User[];
  };
}
