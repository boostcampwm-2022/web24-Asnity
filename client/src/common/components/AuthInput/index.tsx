import type {
  ChangeEventHandler,
  ComponentPropsWithoutRef,
  HTMLInputTypeAttribute,
} from 'react';

import classnames from 'classnames';
import React from 'react';

interface Props extends ComponentPropsWithoutRef<'input'> {
  type?: HTMLInputTypeAttribute;
  value: string;
  onChange: ChangeEventHandler<HTMLInputElement>;
  className?: string;
  placeholder?: string;
}

const AuthInput: React.FC<Props> = ({
  type = 'text',
  value,
  onChange,
  className = '',
  placeholder = 'Default',
  ...restProps
}) => {
  const inputValueFilled = value.length >= 1;

  const movePlaceholderTop = classnames([
    {
      'top-[16px]': inputValueFilled,
      'text-s12': inputValueFilled,
    },
  ]);

  const moveInputValueBottom = classnames([
    {
      'pt-8': inputValueFilled,
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
      />
      <div
        className={`absolute top-1/2 -translate-y-1/2 transition-all px-6 pointer-events-none text-placeholder ${movePlaceholderTop}`}
      >
        {placeholder}
      </div>
    </div>
  );
};

export default AuthInput;
