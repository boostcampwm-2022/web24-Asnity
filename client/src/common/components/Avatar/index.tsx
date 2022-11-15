import React from 'react';

export interface AvatarProps {
  size: 'small' | 'medium';
  variant: 'circle' | 'rectangle';
  name: string;
  url?: string;
}

const ROUNDED = {
  rectangle: 'rounded-2xl',
  circle: 'rounded-full',
};

const WH = {
  small: 'w-[57px] h-[57px]',
  medium: 'w-[65px] h-[65px]',
};

const Avatar: React.FC<AvatarProps> = ({ name, url, size, variant }) => {
  return (
    <div
      className={`flex justify-center items-center ${WH[size]} border border-line ${ROUNDED[variant]} text-s24 italic font-bold overflow-hidden select-none`}
    >
      {url ? (
        <img
          className="object-cover"
          src={url}
          alt={`커뮤니티 ${name}의 프로필 이미지`}
        />
      ) : (
        name.at(0)
      )}
    </div>
  );
};

export default Avatar;
