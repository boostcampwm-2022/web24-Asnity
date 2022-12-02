import type { FC } from 'react';

import { ExclamationTriangleIcon } from '@heroicons/react/24/solid';
import React from 'react';

export interface Props {
  className?: string;
  description?: string;
}

const ErrorIcon: FC<Props> = ({
  description = '데이터를 불러오는데 오류가 발생했습니다.',
  className = 'error-icon-default',
}) => {
  return (
    <div className={className}>
      <span className="sr-only">{description}</span>
      <ExclamationTriangleIcon className="fill-error w-8 h-8" />
    </div>
  );
};

export default ErrorIcon;
