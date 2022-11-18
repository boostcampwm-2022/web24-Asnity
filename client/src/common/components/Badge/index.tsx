import React from 'react';

interface BadgeProps {
  children?: React.ReactNode;
  size?: 'small' | 'medium';
  color?: 'success' | 'error' | 'default';
}

const scale = {
  small: 'w-5 h-5',
  medium: 'w-7 h-7',
};

const background = {
  success: 'bg-success',
  error: 'bg-error',
  default: 'bg-label',
};

const Badge: React.FC<BadgeProps> = ({
  children,
  size = 'small',
  color = 'default',
}) => {
  return (
    <div className={`relative`}>
      <div
        className={`absolute bottom-0 right-0 rounded-full ${scale[size]} border-2 border-offWhite ${background[color]}`}
      />
      {children}
    </div>
  );
};

export default Badge;
