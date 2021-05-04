import { useCallback, useEffect, useState } from "react";

export function useLocalStorage<T>(
  key: string,
  initialValue: T
): [T, (value: T) => void] {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      if (!item) window.localStorage.setItem(key, JSON.stringify(initialValue));
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      return initialValue;
    }
  });

  useEffect(() => {
    const storageEventHandler = () => {
      const item = window.localStorage.getItem(key);
      setStoredValue(item ? JSON.parse(item) : initialValue);
    };
    window.addEventListener("storage", storageEventHandler);
    return () => {
      window.removeEventListener("storage", storageEventHandler);
    };
  }, [key, initialValue]);

  const setValue = useCallback(
    (value: T) => {
      try {
        const valueToStore =
          value instanceof Function ? value(storedValue) : value;
        setStoredValue(valueToStore);
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
      } catch (error) {}
    },

    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  return [storedValue, setValue];
}
