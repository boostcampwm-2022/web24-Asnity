import type { ObjValues } from '@@types/common';

export const TAB_KEY = {
  FOLLOWINGS: 'followings',
  FOLLOWERS: 'followers',
  USER_SEARCH: 'user-search',
} as const;

export type TabKeys = ObjValues<typeof TAB_KEY>;

export const tabs = [
  { key: TAB_KEY.FOLLOWINGS, tabName: '팔로잉' },
  { key: TAB_KEY.FOLLOWERS, tabName: '팔로워' },
  { key: TAB_KEY.USER_SEARCH, tabName: '사용자 검색' },
] as const;
