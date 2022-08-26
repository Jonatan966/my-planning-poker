function getItem<V = string>(key: string): V | undefined {
  if (typeof window === "undefined") {
    return undefined;
  }

  const item = localStorage.getItem(key);

  try {
    if (item) {
      return JSON.parse(item) as V;
    }

    return undefined;
  } catch {
    return undefined;
  }
}

function setItem<V = string>(key: string, value: V): boolean {
  if (typeof window === "undefined") {
    return false;
  }

  const preparedValue = JSON.stringify(value);

  try {
    localStorage.setItem(key, preparedValue);

    return true;
  } catch {
    return false;
  }
}

export const storageManager = { getItem, setItem };
