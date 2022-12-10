import { useState } from 'react';

const useHover = (initialValue = false) => {
  const [isHover, setIsHover] = useState(initialValue);

  const onMouseEnter = () => setIsHover(true);
  const onMouseLeave = () => setIsHover(false);

  return { isHover, onMouseEnter, onMouseLeave };
};

export default useHover;
