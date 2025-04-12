import { useCallback, useRef } from "react";

export function useDebouncedFunction(fn, delay) {
  const timeoutRef = useRef(undefined);

  const debouncedFn = useCallback(
    (...args) => {
      return new Promise((resolve, reject) => {
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }

        timeoutRef.current = window.setTimeout(async () => {
          try {
            const result = await fn(...args);
            resolve(result);
          } catch (error) {
            reject(error);
          }
        }, delay);
      });
    },
    [fn, delay]
  );

  return debouncedFn;
}