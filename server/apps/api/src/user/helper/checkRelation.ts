import { ConflictException } from '@nestjs/common';
import { RELATION } from './Relation';

export const checkRelation = (myFollowings, yourFollowers, followerDto) => {
  const isAlreadyFollow = myFollowings.includes(followerDto.followId);
  const isAlreadyFollowAtOther = yourFollowers.includes(followerDto.requestUserId);
  if (!isAlreadyFollow && isAlreadyFollowAtOther) {
    throw new ConflictException('갱신 이상! (팔로우 안되어있으나, 상대방에겐 내가 팔로우됨)');
  } else if (isAlreadyFollow && !isAlreadyFollowAtOther) {
    throw new ConflictException(
      '갱신 이상! (팔로우 되어있으나, 상대방에겐 내가 팔로우되어있지 않음)',
    );
  } else if (!isAlreadyFollow && !isAlreadyFollowAtOther) {
    return RELATION.FOLLOW;
  } else if (isAlreadyFollow && isAlreadyFollowAtOther) {
    return RELATION.UNFOLLOW;
  }
};
