import type { ComponentPropsWithRef } from 'react';

import { MagnifyingGlassIcon } from '@heroicons/react/20/solid';
import React, { forwardRef } from 'react';

export interface Props extends ComponentPropsWithRef<'input'> {}

const SearchInput: React.FC<Props> = forwardRef(
  ({ className, value, onChange, placeholder, ...restProps }, ref) => {
    return (
      <div className={`relative h-[40px] ${className}`}>
        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
          <span className="sr-only">검색</span>
          <MagnifyingGlassIcon className="w-5 h-5 fill-label" />
        </div>
        <input
          {...restProps}
          ref={ref}
          type="text"
          id="input-group-1"
          className="h-full bg-inputBackground border border-line text-s14 text-label rounded-2xl min-w-full pl-10 focus:outline-line focus:bg-offWhite focus:font-bold"
          placeholder={placeholder}
          value={value}
          onChange={onChange}
        />
      </div>
    );
  },
);

SearchInput.displayName = 'SearchInput';

export default SearchInput;
