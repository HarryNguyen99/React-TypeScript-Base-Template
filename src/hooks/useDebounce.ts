import { useState, useEffect, useRef, useCallback } from 'react';

/**
 * Debounce a value - returns debounced value after delay
 * Use for search inputs, filters, etc.
 *
 * @example
 * const [search, setSearch] = useState('');
 * const debouncedSearch = useDebounce(search, 300);
 *
 * useEffect(() => {
 *   // API call with debouncedSearch
 * }, [debouncedSearch]);
 */
export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);

  return debouncedValue;
}

type AnyFunction = (...args: unknown[]) => unknown;

/**
 * Debounce a callback function
 * Use for event handlers like onChange, onScroll, etc.
 *
 * @example
 * const debouncedSave = useDebounceCallback((value: string) => {
 *   saveToServer(value);
 * }, 500);
 *
 * <input onChange={(e) => debouncedSave(e.target.value)} />
 */
export function useDebounceCallback<T extends AnyFunction>(
  callback: T,
  delay: number
): T {
  const callbackRef = useRef(callback);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  const debouncedCallback = useCallback(
    (...args: unknown[]) => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      timeoutRef.current = setTimeout(() => {
        callbackRef.current(...args);
      }, delay);
    },
    [delay]
  ) as T;

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return debouncedCallback;
}

interface UseAdvancedDebounceReturn<T extends AnyFunction> {
  debounced: T;
  cancel: () => void;
  flush: () => void;
  isPending: boolean;
}

/**
 * Advanced debounce with cancel, flush, and pending state
 * Use when you need more control over the debounced function
 *
 * @example
 * const { debounced, cancel, flush, isPending } = useAdvancedDebounce(
 *   (value: string) => saveToServer(value),
 *   500
 * );
 *
 * // Cancel pending call on unmount or navigation
 * useEffect(() => () => cancel(), [cancel]);
 *
 * // Immediately execute pending call
 * <button onClick={flush} disabled={!isPending}>Save Now</button>
 */
export function useAdvancedDebounce<T extends AnyFunction>(
  callback: T,
  delay: number
): UseAdvancedDebounceReturn<T> {
  const callbackRef = useRef(callback);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const argsRef = useRef<unknown[] | null>(null);
  const [isPending, setIsPending] = useState(false);

  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  const cancel = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = undefined;
      argsRef.current = null;
      setIsPending(false);
    }
  }, []);

  const flush = useCallback(() => {
    if (timeoutRef.current && argsRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = undefined;
      callbackRef.current(...argsRef.current);
      argsRef.current = null;
      setIsPending(false);
    }
  }, []);

  const debounced = useCallback(
    (...args: unknown[]) => {
      argsRef.current = args;

      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      setIsPending(true);

      timeoutRef.current = setTimeout(() => {
        if (argsRef.current) {
          callbackRef.current(...argsRef.current);
          argsRef.current = null;
        }
        timeoutRef.current = undefined;
        setIsPending(false);
      }, delay);
    },
    [delay]
  ) as T;

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return { debounced, cancel, flush, isPending };
}

// Default delays for common use cases
export const DEBOUNCE_DELAYS = {
  SEARCH: 300,
  FORM_VALIDATION: 500,
  RESIZE: 150,
  SCROLL: 100,
  API_CALL: 400,
} as const;
