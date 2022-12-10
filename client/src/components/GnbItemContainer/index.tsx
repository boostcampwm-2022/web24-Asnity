import type { ReactNode, FC } from 'react';

import useHover from '@hooks/useHover';
import cn from 'classnames';
import React, { memo } from 'react';

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
  const { isHover, ...hoverHandlers } = useHover(false);
  const leftFillBarClassnames = disableLeftFillBar
    ? ''
    : cn({
        'bg-primary-light': isHover,
        'bg-primary-dark': isActive,
      });

  return (
    <div className="relative w-full mb-[10px]">
      <div
        className={`absolute left-0 top-0 h-full w-[6px] transition-[background-color] ${leftFillBarClassnames}`}
      ></div>
      <div className="flex justify-center">
        {/* Item 영역 */}
        <div className="max-w-min" {...hoverHandlers}>
          {children}
        </div>
      </div>
    </div>
  );
};

export default memo(GnbItemContainer);
