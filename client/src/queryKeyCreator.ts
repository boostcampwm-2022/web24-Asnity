const queryKeyCreator = {
  me: () => ['me'],
  signUp: () => ['signUp'],
} as const;

export default queryKeyCreator;
