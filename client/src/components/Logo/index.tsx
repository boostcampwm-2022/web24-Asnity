import type { FC } from 'react';

import logoUrl from '@icons/logo.svg';
import React, { memo } from 'react';

const logoSize = {
  xl: 'w-[140px]',
  lg: 'w-[120px]',
  md: 'w-[100px]',
  sm: 'w-[80px]',
  xs: 'w-[60px]',
} as const;

export interface Props {
  size?: keyof typeof logoSize;
}

const Logo: FC<Props> = ({ size = 'md' }) => {
  return (
    <div className="inline-flex">
      <img src={logoUrl} alt="" className={`${logoSize[size]}`} />
    </div>
  );
};

export default memo(Logo);
