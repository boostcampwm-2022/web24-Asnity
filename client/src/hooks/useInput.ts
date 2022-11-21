import type { ChangeEvent } from 'react';

import { useCallback, useState } from 'react';

const useInput = <T>(initialValue: T) => {
  const [value, setValue] = useState(initialValue);

  const onChange = useCallback(
    (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setValue(e.target.value as T);
    },
    [],
  );

  return [value, onChange, setValue];
};

export default useInput;
