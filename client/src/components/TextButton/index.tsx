import type {
  ReactNode,
  ComponentPropsWithoutRef,
  CSSProperties,
  FC,
} from 'react';

import cn from 'classnames';
import React from 'react';

const textButtonSize = {
  xl: 'text-s20',
  lg: 'text-s18',
  md: 'text-s16',
  sm: 'text-s14',
  xs: 'text-s12',
};

const textButtonColor = {
  default: '',
  primary: 'text-primary hover:text-primary-dark active:text-primary',
  secondary: 'text-secondary hover:text-secondary-dark active:text-secondary',
  dark: 'text-body hover:text-titleActive active:text-body',
};

export type TextButtonColor = keyof typeof textButtonColor;
export type TextButtonSize = keyof typeof textButtonSize;

export interface Props extends ComponentPropsWithoutRef<'button'> {
  children: ReactNode;
  size: TextButtonSize;
  color?: TextButtonColor;
  style?: CSSProperties;
  className?: string;
}

const TextButton: FC<Props> = ({
  children,
  size,
  color = 'default',
  className,
  style,
  ...restProps
}) => {
  const classes = cn([textButtonSize[size], textButtonColor[color], className]);

  return (
    <button style={style} {...restProps} className={classes}>
      {children}
    </button>
  );
};

export default TextButton;
