const queryKeyCreator = {
  me: () => ['me'],
  signUp: () => ['signUp'],
  signIn: () => ['signIn'],
} as const;

export default queryKeyCreator;
