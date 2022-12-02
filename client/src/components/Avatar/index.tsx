import type { ReactNode, FC } from 'react';

import React, { memo } from 'react';

export interface AvatarProps {
  size: 'small' | 'medium';
  variant: 'circle' | 'rectangle';
  name: string;
  url?: string;
  className?: string;
  children?: ReactNode;
}

const ROUNDED = {
  rectangle: 'rounded-2xl',
  circle: 'rounded-full',
};

const SCALE = {
  small: 'w-[57px] h-[57px]',
  medium: 'w-[65px] h-[65px]',
};

const getFirstLetter = (str: string) => {
  const firstLetter = str.at(0);

  if (!firstLetter) {
    console.warn(
      `getFirstLetter의 인자로는 반드시 길이 1이상의 문자열이 들어와야 합니다.`,
    );
    return '';
  }

  return firstLetter;
};

// TODO: url 바꿔야함
const Avatar: FC<AvatarProps> = ({
  name,
  url = 'https://cdn-icons-png.flaticon.com/512/1946/1946429.png',
  size,
  variant,
  className = '',
  children,
}) => {
  return (
    <div
      className={`flex justify-center items-center ${SCALE[size]} border border-line ${ROUNDED[variant]} text-s24 italic font-bold overflow-hidden select-none ${className}`}
    >
      {children}
      {!children &&
        (url.length ? (
          <img
            className="block object-cover h-full"
            src={
              url === 'url'
                ? 'https://cdn-icons-png.flaticon.com/512/1946/1946429.png'
                : url
            }
            alt={`${name}의 프로필 이미지`}
          />
        ) : (
          getFirstLetter(name)
        ))}
    </div>
  );
};

export default memo(Avatar);
