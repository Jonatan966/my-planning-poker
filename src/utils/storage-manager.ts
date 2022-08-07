function getItem<V = string>(key: string): V | undefined {
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
  const preparedValue = JSON.stringify(value);

  try {
    localStorage.setItem(key, preparedValue);

    return true;
  } catch {
    return false;
  }
}

export const storageManager = { getItem, setItem };
