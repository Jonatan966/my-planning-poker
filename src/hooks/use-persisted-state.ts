import { Dispatch, useEffect, useState } from "react";
import { localStorageManager } from "../utils/local-storage-manager";

function usePersistedState<V = string>(
  key: string,
  initialValue: V
): [V, Dispatch<React.SetStateAction<V>>] {
  const [value, setValue] = useState<V>(() => {
    if (initialValue) {
      return initialValue;
    }

    const storagedValue = localStorageManager.getItem<V>(key);

    if (!storagedValue) {
      return initialValue;
    }

    return storagedValue;
  });

  useEffect(() => {
    localStorageManager.setItem(key, value);
  }, [value]);

  return [value, setValue];
}

export default usePersistedState;
