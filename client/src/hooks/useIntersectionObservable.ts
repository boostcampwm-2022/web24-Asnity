import React, { useRef, useCallback, useEffect } from 'react';

/**
 * @param onIntersection 관찰되는 요소가 화면에 보이면 실행되는 콜백 함수
 * @returns 관찰하려는 요소에 붙이는 callback ref
 * 반환값을 요소의 `ref` 속성에 붙이면 파라미터에 전달한 콜백이 실행됩니다.
 */
const useIntersectionObservable = (
  onIntersection: (
    // 콜백 인터페이스 변경
    entry: IntersectionObserverEntry,
    observer: IntersectionObserver,
  ) => void,
) => {
  const observer = useRef<IntersectionObserver | null>(null); // 네이밍 변경

  const ref = useCallback(
    (node: HTMLElement | null) => {
      if (!node) return; // 얼리 리턴으로 변경

      if (!observer.current) {
        observer.current = new IntersectionObserver((entries, _observer) => {
          // observer.current === _observer (동일한 값입니다.)
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              onIntersection(entry, _observer);
            }
          });
        });
      }

      observer.current.observe(node);
    },
    [onIntersection], // 이 값이 없으면, onIntersection내부에서 사용되는 isFetching 등의 값이 메모된 값으로 고정됩니다.
  );

  useEffect(() => {
    // 클린업.
    return () => observer.current?.disconnect();
  }, []);

  return ref;
};

export default useIntersectionObservable;
