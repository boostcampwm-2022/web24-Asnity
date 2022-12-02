import type { FC } from 'react';

import React from 'react';
import { Oval } from 'react-loader-spinner';

export interface Props {
  className?: string;
  size?: number;
  strokeWidth?: number;
  ariaLabel?: string;
}

/**
 * className props 주면 기본 적용된 클래스가 제거됩니다.
 */
const Spinner: FC<Props> = ({
  className = 'loader-default',
  size = 50,
  strokeWidth = 5,
  ariaLabel = '',
}) => {
  return (
    <div className={className}>
      <Oval
        color="#1D1D50"
        secondaryColor="#6E7191"
        ariaLabel={ariaLabel}
        width={size}
        height={size}
        strokeWidth={strokeWidth}
      />
    </div>
  );
};

export default Spinner;
