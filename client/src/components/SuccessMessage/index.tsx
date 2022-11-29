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
}

const SuccessMessage: FC<Props> = ({ children, size = 'sm' }) => {
  const memoizedSize = useMemo(() => messageSize[size], [size]);

  return <div className={`text-success ${memoizedSize}`}>{children}</div>;
};

export default memo(SuccessMessage);
