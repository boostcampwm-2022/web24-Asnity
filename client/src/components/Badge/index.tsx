import type { FC } from 'react';

import React, { memo } from 'react';

interface BadgeProps {
  children?: React.ReactNode;
  size?: 'small' | 'medium';
  color?: 'success' | 'error' | 'default' | 'primary';
  vertical?: 'top' | 'bottom';
  horizontal?: 'right' | 'left';
}

const scale = {
  small: 'w-5 h-5',
  medium: 'w-6 h-6',
};

const background = {
  success: 'bg-success',
  error: 'bg-error',
  default: 'bg-label',
  primary: 'bg-indigo',
};

const verticalPosition = {
  top: 'top-0',
  bottom: 'bottom-0',
};

const horizontalPosition = {
  right: 'right-0',
  left: 'left-0',
};

const Badge: FC<BadgeProps> = ({
  children,
  size = 'small',
  color = 'default',
  vertical = 'bottom',
  horizontal = 'right',
}) => {
  return (
    <div className={`relative`}>
      <div
        className={`absolute ${verticalPosition[vertical]} ${horizontalPosition[horizontal]} rounded-full ${scale[size]} border-2 border-offWhite ${background[color]}`}
      />
      {children}
    </div>
  );
};

export default memo(Badge);
