import React from 'react';

const useDebouncedValue = <T>(value: T, delay = 500) => {
  const [debouncedValue, setDebouncedValue] = React.useState<T>(value);

  React.useEffect(() => {
    const timerId = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(timerId);
    };
  }, [value, delay]);
  return debouncedValue;
};

export default useDebouncedValue;
