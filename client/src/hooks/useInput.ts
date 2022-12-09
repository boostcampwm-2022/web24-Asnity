import type { ChangeEvent } from 'react';

import { useCallback, useState } from 'react';

const useInput = <E extends HTMLInputElement | HTMLTextAreaElement, T>(
  initialValue: T,
) => {
  const [value, setValue] = useState(initialValue);
  const [isDirty, setIsDirty] = useState(false);

  const onChange = useCallback(
    (e: ChangeEvent<E>) => {
      const newValue = e.target.value as T;

      setValue(newValue);
      setIsDirty(initialValue !== newValue);
    },
    [initialValue],
  );

  return [value, onChange, isDirty, setValue] as const;
};

export default useInput;
