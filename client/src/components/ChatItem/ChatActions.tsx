import type { ComponentPropsWithoutRef, FC, ReactNode } from 'react';

import {
  DocumentDuplicateIcon,
  TrashIcon,
  PencilIcon,
} from '@heroicons/react/24/solid';
import React from 'react';

const defaultActionButtonShapeClassnames = `p-1 rounded-lg`;
const defaultActionButtonColorClassnames = `bg-placeholder hover:bg-indigo`;
const removeActionButtonColorClassnames = `bg-error hover:bg-error-dark`;
const defaultIconClassnames = `w-5 h-5 fill-offWhite pointer-events-none`;

export interface ContainerProps {
  className?: string;
  children: ReactNode;
}

const Container: FC<ContainerProps> = ({ children, className = '' }) => {
  return (
    <div
      className={`flex gap-1 h-[38px] border border-placeholder p-1 rounded-lg ${className}`}
    >
      {children}
    </div>
  );
};

export interface ActionProps extends ComponentPropsWithoutRef<'button'> {}

const Copy: FC<ActionProps> = (props) => {
  return (
    <button
      type="button"
      className={`${defaultActionButtonShapeClassnames} ${defaultActionButtonColorClassnames}`}
      {...props}
    >
      <span className="sr-only">복사하기</span>
      <DocumentDuplicateIcon className={defaultIconClassnames} />
    </button>
  );
};

const Remove: FC<ActionProps> = (props) => {
  return (
    <button
      type="button"
      className={`${defaultActionButtonShapeClassnames} ${removeActionButtonColorClassnames}`}
      {...props}
    >
      <span className="sr-only">삭제하기</span>
      <TrashIcon className={defaultIconClassnames} />
    </button>
  );
};

const Edit: FC<ActionProps> = (props) => {
  return (
    <button
      type="button"
      className={`${defaultActionButtonShapeClassnames} ${defaultActionButtonColorClassnames}`}
      {...props}
    >
      <span className="sr-only">수정하기</span>
      <PencilIcon className={defaultIconClassnames} />
    </button>
  );
};

const ChatActions = {
  Container,
  Remove,
  Edit,
  Copy,
};

export default ChatActions;
