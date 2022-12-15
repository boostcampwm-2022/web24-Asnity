import { useEffect } from 'react';

const useInterval = (
  callback: (...params: any[]) => void,
  intervalTime = 1000,
  deps: any[] = [],
) => {
  useEffect(() => {
    const interval = setInterval(callback, intervalTime);

    return () => clearInterval(interval);
  }, deps);
};

export default useInterval;
