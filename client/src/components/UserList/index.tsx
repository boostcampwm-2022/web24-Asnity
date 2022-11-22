import React, { ComponentPropsWithoutRef, ReactNode } from 'react';

interface Props extends ComponentPropsWithoutRef<'ul'> {
  children?: ReactNode;
}

const UserList = ({ children }: Props) => {
  return <ul className="flex flex-col divide-y divide-line">{children}</ul>;
};

export default UserList;
