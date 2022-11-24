import type { ReactNode } from 'react';

import React from 'react';

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

const Avatar: React.FC<AvatarProps> = ({
  name,
  url,
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
        (url ? (
          <img
            className="object-cover"
            src={url}
            alt={`${name}의 프로필 이미지`}
          />
        ) : (
          getFirstLetter(name)
        ))}
    </div>
  );
};

export default Avatar;
