const queryKeyCreator = {
  me: () => ['me'],
  signUp: () => ['signUp'],
  signIn: () => ['signIn'],
  followings: (): [string] => ['followings'],
  followers: (): [string] => ['followers'],
} as const;

export default queryKeyCreator;
