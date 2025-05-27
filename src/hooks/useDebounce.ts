/**
 * @file useDebounce.ts
 * @description A generic debounce hook that delays the update of a value until after a specified delay.
 *
 * @template T - The type of the value being debounced.
 * @param {T} value - The input value to debounce.
 * @param {number} delay - The debounce delay in milliseconds.
 * @returns {T} - The debounced value, updated only after the delay.
 *
 * @example
 * const debouncedSearch = useDebounce(searchInput, 300);
 */

import { useEffect, useState } from "react";

export const useDebounce = <T>(value: T, delay: number): T => {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setDebounced(value);
    }, delay);

    return () => clearTimeout(timeout);
  }, [value, delay]);

  return debounced;
};
