import { useRef } from "react";

export function useDebounce(delay: number, outerAction?: Function) {
  const debounceTimerRef = useRef(0);

  function debounce(innerAction?: Function) {
    clearTimeout(debounceTimerRef.current);

    debounceTimerRef.current = window.setTimeout(() => {
      (innerAction || outerAction)?.();
    }, delay);
  }

  return debounce;
}
