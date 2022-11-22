const queryKeyCreator = {
  me: () => ['me'],
  signUp: () => ['signUp'],
  signIn: () => ['signIn'],
  followings: (): [string] => ['followings'],
} as const;

export default queryKeyCreator;
