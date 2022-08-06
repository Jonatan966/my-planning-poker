import { Dispatch, useEffect, useState } from "react";

function usePersistedState<V = string>(
  key: string,
  initialValue: V
): [V, Dispatch<React.SetStateAction<V>>] {
  const [value, setValue] = useState<V>(() => {
    if (initialValue) {
      return initialValue;
    }

    const storagedValue = localStorage.getItem(key);

    if (!storagedValue) {
      return initialValue;
    }

    return JSON.parse(storagedValue) as V;
  });

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value));
  }, [value]);

  return [value, setValue];
}

export default usePersistedState;
