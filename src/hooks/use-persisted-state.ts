import { Dispatch, useEffect, useState } from "react";
import { storageManager } from "../utils/storage-manager";

function usePersistedState<V = string>(
  key: string,
  initialValue: V
): [V, Dispatch<React.SetStateAction<V>>] {
  const [value, setValue] = useState<V>(() => {
    if (initialValue) {
      return initialValue;
    }

    const storagedValue = storageManager.getItem<V>(key);

    if (!storagedValue) {
      return initialValue;
    }

    return storagedValue;
  });

  useEffect(() => {
    storageManager.setItem(key, value);
  }, [value]);

  return [value, setValue];
}

export default usePersistedState;
