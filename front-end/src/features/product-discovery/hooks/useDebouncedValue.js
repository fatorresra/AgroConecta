import { useState, useEffect } from "react";

/**
 * Returns a debounced version of the value that only updates after the specified delay.
 * @param {any} value - The value to debounce
 * @param {number} delay - The debounce delay in ms
 */

export function useDebouncedValue(value, delay) {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);

  return debounced;
}