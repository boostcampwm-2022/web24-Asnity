export const getUserBasicInfo = (user) => {
  return {
    id: user.id,
    nickname: user.nickname,
    status: user.status,
    profileUrl: user.profileUrl,
    description: user.description,
  };
};
