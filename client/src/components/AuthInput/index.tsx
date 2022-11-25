import type {
  ChangeEventHandler,
  ComponentPropsWithRef,
  HTMLInputTypeAttribute,
} from 'react';

import cn from 'classnames';
import React, { forwardRef } from 'react';

interface Props extends ComponentPropsWithRef<'input'> {
  type?: HTMLInputTypeAttribute;
  value: string;
  onChange: ChangeEventHandler<HTMLInputElement>;
  className?: string;
  placeholder?: string;
}

const AuthInput: React.FC<Props> = forwardRef(
  (
    {
      type = 'text',
      value = '',
      onChange,
      className = '',
      placeholder = 'Default',
      ...restProps
    },
    ref,
  ) => {
    const inputValueFilled = value.length >= 1;

    const movePlaceholderTop = cn([
      {
        'top-1/2': !inputValueFilled,
        'text-s16': !inputValueFilled,
        'top-[16px]': inputValueFilled,
        'text-s12': inputValueFilled,
      },
    ]);

    const moveInputValueBottom = cn([
      {
        'pt-6': inputValueFilled,
      },
    ]);

    return (
      <div
        className={`block relative min-w-[340px] w-[340px] h-[56px] ${className}`}
      >
        <input
          type={type}
          value={value}
          onChange={onChange}
          className={`block w-[100%] h-[56px] text-s16 transition-all px-6 py-2 bg-inputBackground rounded-2xl focus:bg-offWhite ${moveInputValueBottom}`}
          {...restProps}
          ref={ref}
        />
        <div
          className={`absolute -translate-y-1/2 transition-all px-6 pointer-events-none text-placeholder ${movePlaceholderTop}`}
        >
          {placeholder}
        </div>
      </div>
    );
  },
);

AuthInput.displayName = 'AuthInput';

export default AuthInput;
