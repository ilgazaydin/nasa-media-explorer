/**
 * @file useLocalStorage.ts
 * @description A custom React hook for managing state that persists in localStorage.
 *
 * Handles serialization and deserialization of values, with support for strings, objects,
 * and null. Gracefully catches and logs read/write errors to prevent app crashes.
 *
 * @template T - The type of the stored value.
 * @param {string} key - The localStorage key.
 * @param {T} initialValue - The initial value to use if nothing is found or parsing fails.
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
    try {
      const stored = localStorage.getItem(key);
      if (stored === null) return initialValue;

      if (typeof initialValue === "string" || initialValue === null) {
        return stored as T;
      }

      return JSON.parse(stored);
    } catch (err) {
      console.warn(`Error reading localStorage key "${key}":`, err);
      return initialValue;
    }
  });
  useEffect(() => {
    try {
      if (value === null) {
        localStorage.removeItem(key);
      } else if (typeof value === "string") {
        localStorage.setItem(key, value);
      } else {
        localStorage.setItem(key, JSON.stringify(value));
      }
    } catch (err) {
      console.warn(`Error writing localStorage key "${key}":`, err);
    }
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
