import type { ReactNode, FC } from 'react';

import useHover from '@hooks/useHover';
import cn from 'classnames';
import React, { memo, useRef } from 'react';
import ReactDOM from 'react-dom';

interface Props {
  children: ReactNode;
  disableLeftFillBar?: boolean;
  isActive?: boolean;
  tooltip?: string;
}

const $tooltip = document.getElementById('tooltip') as HTMLDivElement;

interface TooltipProps {
  visible?: boolean;
  children: ReactNode;
}

const Tooltip = ({ visible, children }: TooltipProps) => {
  if (!$tooltip) {
    return null;
  }

  return !visible ? null : ReactDOM.createPortal(children, $tooltip);
};

const GnbItemContainer: FC<Props> = ({
  children,
  disableLeftFillBar = false,
  isActive = false,
  tooltip,
}) => {
  const { isHover, ...hoverHandlers } = useHover(false);
  const leftFillBarClassnames = disableLeftFillBar
    ? ''
    : cn({
        'bg-primary-light': isHover,
        'bg-primary-dark': isActive,
      });

  const ref = useRef<HTMLDivElement>(null);
  const clientRect = ref.current?.getBoundingClientRect();
  const tooltipStyle = {
    left: (clientRect?.left || 0) + (clientRect?.width || 0) + 5,
    top: clientRect?.top || 0,
  };

  return (
    <div className="relative w-full mb-[10px]" ref={ref}>
      <div
        className={`absolute left-0 top-0 h-full w-[6px] transition-[background-color] ${leftFillBarClassnames}`}
      ></div>
      <div className="flex justify-center">
        <div className="max-w-min" {...hoverHandlers}>
          {children}
        </div>
      </div>
      {tooltip && ref.current && isHover && (
        <Tooltip visible>
          <div
            className="absolute flex items-center p-[12px] rounded-xl w-max h-[56px] bg-titleActive text-offWhite z-[9000px] font-mont text-s20 italic"
            style={tooltipStyle}
          >
            {tooltip}
            <div className="absolute w-0 h-0 bg-titleActive border border-titleActive border-[10px] border-l-0 border-y-background -translate-x-[22px]" />
          </div>
        </Tooltip>
      )}
    </div>
  );
};

export default memo(GnbItemContainer);
