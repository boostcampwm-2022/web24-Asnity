import type { ComponentPropsWithRef, FC } from 'react';

import React, { forwardRef } from 'react';

interface Props extends ComponentPropsWithRef<'input'> {
  className?: string;
}

const Input: FC<Props> = forwardRef(({ className, ...restProps }, ref) => {
  return (
    <div className={`min-w-[280px] h-[40px] rounded-xl ${className}`}>
      <input
        {...restProps}
        ref={ref}
        className={`border w-full h-full text-s14 rounded-xl px-[12px] border-line bg-inputBackground focus:bg-offWhite disabled:bg-line disabled:opacity-30 disabled:border-line`}
      />
    </div>
  );
});

Input.displayName = 'Input';

export default Input;
