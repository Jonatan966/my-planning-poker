import { useState, useRef, MutableRefObject } from "react";

function useStatefulRef<T>(initialVal: T): MutableRefObject<T> {
  let [cur, setCur] = useState<T | null>(initialVal);

  const { current: ref } = useRef({
    current: cur,
  });

  Object.defineProperty(ref, "current", {
    get: () => cur as T,
    set: (value: T) => {
      if (!Object.is(cur, value)) {
        cur = value;
        setCur(value);
      }
    },
  });

  return ref as MutableRefObject<T>;
}

export default useStatefulRef;
