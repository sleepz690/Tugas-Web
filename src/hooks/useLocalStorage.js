import { useEffect, useState } from "react";

/**
 * usePersistentState — like useState, but persisted to localStorage.
 * Demonstrates a reusable custom Hook built on top of useState + useEffect.
 *
 * @param {string} key      The localStorage key.
 * @param {*}      initial  The initial value (used when nothing is stored yet).
 */
export function usePersistentState(key, initial) {
  const [value, setValue] = useState(() => {
    // Lazy initializer: read from localStorage only once on mount.
    try {
      const stored = window.localStorage.getItem(key);
      if (stored !== null) return JSON.parse(stored);
    } catch (error) {
      console.warn(`Gagal membaca "${key}" dari localStorage:`, error);
    }
    // Support both a plain value and a lazy initializer function (like useState).
    return typeof initial === "function" ? initial() : initial;
  });

  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.warn(`Gagal menyimpan "${key}" ke localStorage:`, error);
    }
  }, [key, value]);

  return [value, setValue];
}
