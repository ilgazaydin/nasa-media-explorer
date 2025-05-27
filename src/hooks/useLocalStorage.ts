/**
 * @file useLocalStorage.ts
 * @description A custom React hook for managing state that persists in localStorage.
 *
 * @template T - The type of the stored value.
 * @param {string} key - The localStorage key.
 * @param {T} initialValue - The initial value to use if nothing is found in localStorage.
 * @returns {[T, (valOrFn: T | ((prev: T) => T)) => void]} - The current value and a setter function.
 *
 * @example
 * const [name, setName] = useLocalStorage("username", "Guest");
 *
 * setName("John");
 * setName(prev => prev + " Doe");
 */

import { useEffect, useState } from "react";

export function useLocalStorage<T>(key: string, initialValue: T) {
  const [value, setValue] = useState<T>(() => {
    const json = localStorage.getItem(key);
    return json ? JSON.parse(json) : initialValue;
  });

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);

  const setStoredValue = (valOrFn: T | ((prev: T) => T)) => {
    setValue((prev) => {
      const newValue =
        typeof valOrFn === "function"
          ? (valOrFn as (prev: T) => T)(prev)
          : valOrFn;
      return newValue;
    });
  };

  return [value, setStoredValue] as const;
}
