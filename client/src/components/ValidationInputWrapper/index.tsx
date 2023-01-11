import type { ComponentPropsWithRef, FC, ReactNode } from 'react';

import ErrorMessage from '@components/ErrorMessage';
import SuccessMessage from '@components/SuccessMessage';
import React from 'react';

interface Props extends ComponentPropsWithRef<'input'> {
  children: ReactNode;
  errorMessage?: string;
  successMessage?: string;
}

const ValidationInputWrapper: FC<Props> = ({
  children,
  errorMessage,
  successMessage,
}) => {
  return (
    <div className="mb-5">
      {children}
      <div className="pl-6">
        {errorMessage ? (
          <ErrorMessage>{errorMessage}</ErrorMessage>
        ) : (
          successMessage && <SuccessMessage>{successMessage}</SuccessMessage>
        )}
      </div>
    </div>
  );
};

export default ValidationInputWrapper;
