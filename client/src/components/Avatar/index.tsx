import type { User } from '@apis/user';
import type { USER_STATUS } from '@constants/user';
import type { ReactNode, FC } from 'react';

import { ASNITY_DEVELOPER } from '@constants/user';
import React, { memo } from 'react';

type BadgeType = keyof typeof USER_STATUS | 'NEW';

const ROUNDED = {
  rectangle: 'rounded-2xl',
  circle: 'rounded-full',
};

const SCALE = {
  sm: 'w-[57px] h-[57px]',
  md: 'w-[65px] h-[65px]',
};

const getFirstLetter = (str: string) => {
  if (!str?.length) {
    console.warn(
      `getFirstLetter의 인자로는 반드시 길이 1이상의 문자열이 들어와야 합니다.`,
    );
    return '';
  }

  return str?.at(0);
};

const BADGE_POSITION = {
  'top-right': 'top-0 right-0',
  'bottom-right': 'bottom-0 right-0',
  'top-left': 'top-0 left-0',
  'bottom-left': 'bottom-0 left-0',
};

const BADGE_COLOR: Record<BadgeType, string> = {
  ONLINE: 'bg-success',
  AFK: 'bg-error',
  OFFLINE: 'bg-label',
  NEW: 'bg-indigo',
};

export interface Props {
  name: string;
  size?: 'sm' | 'md';
  variant?: 'circle' | 'rectangle';
  profileUrl?: string;
  className?: string;
  children?: ReactNode;
  status?: BadgeType;
  badge?: boolean;
  badgePosition?: 'top-right' | 'bottom-right' | 'top-left' | 'bottom-left';
  user?: User;
}

const Avatar: FC<Props> = ({
  user,
  name,
  profileUrl,
  size = 'sm',
  variant = 'circle',
  className = '',
  children,
  badge = false,
  badgePosition = 'bottom-right',
  status = 'OFFLINE',
}) => {
  const isSuperUser = user && ASNITY_DEVELOPER[user.id];
  const _profileUrl = isSuperUser
    ? ASNITY_DEVELOPER[user.id]
    : profileUrl === 'url'
    ? ASNITY_DEVELOPER.default
    : profileUrl;

  return (
    <div className={`relative ${SCALE[size]}`}>
      {badge && (
        <div
          className={`w-[20px] h-[20px] absolute right-0 bottom-0 border border-offWhite rounded-full z-50 ${BADGE_POSITION[badgePosition]} ${BADGE_COLOR[status]}`}
        />
      )}
      <div
        className={`flex h-full w-full justify-center items-center border border-line ${ROUNDED[variant]} text-s24 italic font-bold overflow-hidden select-none ${className}`}
      >
        {children}
        {!children &&
          (_profileUrl ? (
            <img
              className="block object-cover h-full"
              src={_profileUrl}
              alt={`${name}의 프로필 이미지`}
            />
          ) : (
            getFirstLetter(name)
          ))}
      </div>
    </div>
  );
};

export default memo(Avatar);
