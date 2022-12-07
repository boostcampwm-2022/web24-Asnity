import type { Nullable } from '@@types/common';
import type Scrollbars from 'react-custom-scrollbars-2';

/**
 * 스크롤바가 바닥에서 offset 이하만큼 떨어져 있다면 true를 반환합니다.
 */
export const isScrollTouchedBottom = (
  $scrollbar: Nullable<Scrollbars>,
  offset = 0,
) => {
  if (!$scrollbar) return false;

  const { clientHeight, scrollHeight, scrollTop } = $scrollbar.getValues();

  return clientHeight + scrollTop + offset >= scrollHeight;
};
