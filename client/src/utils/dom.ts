import type { Nullable } from '@@types/common';

export const resizeElementByScrollHeight = (ref?: Nullable<HTMLElement>) => {
  if (ref) {
    ref.style.height = 'auto';
    ref.style.height = `${ref.scrollHeight}px`;
  }
};
