export const getUserBasicInfo = (user) => {
  return {
    _id: user._id,
    id: user.id,
    nickname: user.nickname,
    status: user.status,
    profileUrl: user.profileUrl,
    description: user.description,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };
};
