import { Dispatch, useEffect, useState } from "react";
import { cookieStorageManager } from "../utils/cookie-storage-manager";

function usePersistedState<V = string>(
  key: string,
  initialValue: V
): [V, Dispatch<React.SetStateAction<V>>] {
  const [value, setValue] = useState<V>(() => {
    if (initialValue) {
      return initialValue;
    }

    const storagedValue = cookieStorageManager.getItem<V>(key);

    if (!storagedValue) {
      return initialValue;
    }

    return storagedValue;
  });

  useEffect(() => {
    cookieStorageManager.setItem(key, value);
  }, [value]);

  return [value, setValue];
}

export default usePersistedState;
