const queryKeyCreator = {
  me: () => ['me'],
  signUp: () => ['signUp'],
  signIn: () => ['signIn'],
  followings: () => ['followings'],
} as const;

export default queryKeyCreator;
