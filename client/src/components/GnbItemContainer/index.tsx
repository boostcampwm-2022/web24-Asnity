import type { ReactNode, FC } from 'react';

import cn from 'classnames';
import React, { useState, memo, useCallback } from 'react';

interface Props {
  children: ReactNode;
  disableLeftFillBar?: boolean;
  isActive?: boolean;
  tooltip?: string;
}

// TODO: Tooltip 추가하기
const GnbItemContainer: FC<Props> = ({
  children,
  disableLeftFillBar = false,
  isActive = false,
}) => {
  const [isItemHover, setIsItemHover] = useState(false);
  const leftFillBarClassnames = disableLeftFillBar
    ? ''
    : cn({
        'bg-primary-light': isItemHover,
        'bg-primary-dark': isActive,
      });

  const handleMouseEnterOnItem = useCallback(() => setIsItemHover(true), []);
  const handleMouseLeaveFromItem = useCallback(() => setIsItemHover(false), []);

  return (
    <div className="relative w-full mb-[10px]">
      <div
        className={`absolute left-0 top-0 h-full w-[6px] transition-[background-color] ${leftFillBarClassnames}`}
      ></div>
      <div className="flex justify-center">
        {/* Item 영역 */}
        <div
          className="max-w-min"
          onMouseEnter={handleMouseEnterOnItem}
          onMouseLeave={handleMouseLeaveFromItem}
        >
          {children}
        </div>
      </div>
    </div>
  );
};

export default memo(GnbItemContainer);
