import React, { useState, useRef, useCallback, useEffect } from 'react';

/**
 * ## `useSetIntersectingRef` TODO: 적절한 이름이 필요함
 * @param onIntersection 관찰되는 요소가 화면에 보이면 실행되는 콜백 함수
 * @returns 관찰하려는 요소에 붙이는 callback ref
 * 반환값을 요소의 `ref` 속성에 붙이면 파라미터에 전달한 콜백이 실행됩니다.
 */
const useSetIntersectingRef = (onIntersection: () => void) => {
  const [isIntersecting, setIsIntersecting] = useState(false);
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    if (isIntersecting) onIntersection();
  }, [isIntersecting]);

  const setRef = useCallback((node: HTMLElement | null) => {
    if (node) {
      if (!observerRef.current) {
        observerRef.current = new IntersectionObserver((entries) =>
          setIsIntersecting(entries.some((entry) => entry.isIntersecting)),
        );
      }
      observerRef.current.observe(node);
    }
  }, []);

  return setRef;
};

export default useSetIntersectingRef;
