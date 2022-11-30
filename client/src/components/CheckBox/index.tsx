import type { ComponentPropsWithRef, FC } from 'react';

import { CheckCircleIcon } from '@heroicons/react/24/solid';
import React from 'react';

interface Props extends ComponentPropsWithRef<'input'> {}

const CheckBox: FC<Props> = ({ checked, ...restProps }) => {
  return (
    <div className="w-[25px] h-[25px] flex items-center">
      <label className="w-full h-full">
        <input
          type="checkbox"
          className="sr-only"
          checked={checked}
          {...restProps}
        />
        <div className="w-full h-full border rounded-full">
          {checked && <CheckCircleIcon className="fill-indigo" />}
        </div>
      </label>
    </div>
  );
};

export default CheckBox;
