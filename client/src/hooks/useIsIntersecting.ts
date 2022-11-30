import type { RefObject } from 'react';

import React, { useEffect, useRef, useState } from 'react';

export const useIsIntersecting = <T extends HTMLElement>(
  targetRef: RefObject<T>,
) => {
  const observerRef = useRef<IntersectionObserver | null>(null);
  const [isIntersecting, setIsIntersecting] = useState(false);

  useEffect(() => {
    if (!targetRef.current) return;

    if (!observerRef.current) {
      observerRef.current = new IntersectionObserver((entries) =>
        setIsIntersecting(entries.some((entry) => entry.isIntersecting)),
      );
    }

    observerRef.current.observe(targetRef.current);

    /* eslint-disable consistent-return */
    return () => observerRef?.current?.disconnect();
  }, [targetRef.current]);
  return isIntersecting;
};

export default useIsIntersecting;
