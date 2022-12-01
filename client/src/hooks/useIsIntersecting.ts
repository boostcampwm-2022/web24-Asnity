import type { RefObject } from 'react';

import { useEffect, useRef } from 'react';

export const useIsIntersecting = <T extends HTMLElement>(
  targetRef: RefObject<T>,
  cb: () => void,
) => {
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    if (!targetRef.current) return;

    if (!observerRef.current) {
      observerRef.current = new IntersectionObserver((entries) => {
        cb();
      });
      observerRef.current.observe(targetRef.current);
    }

    /* eslint-disable consistent-return */
    return () => observerRef.current?.disconnect();
  }, [targetRef.current]);
};

export default useIsIntersecting;
