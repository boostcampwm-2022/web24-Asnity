import type { ReactNode, FC } from 'react';

import React, { memo, useMemo } from 'react';

const messageSize = {
  lg: 'text-s16',
  md: 'text-s14',
  sm: 'text-s12',
} as const;

export interface Props {
  children: ReactNode;
  size?: keyof typeof messageSize;
  className?: string;
}

const ErrorMessage: FC<Props> = ({ children, size = 'sm', className = '' }) => {
  const memoizedSize = useMemo(() => messageSize[size], [size]);

  return (
    <div className={`text-error ${memoizedSize} ${className}`}>{children}</div>
  );
};

export default memo(ErrorMessage);
