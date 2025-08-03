import { useState, useCallback, useRef, useEffect } from 'react';

// The function signature remains flexible
type ApiFunction<T = any> = (...args: any[]) => Promise<T>;

interface UseApiOptions<T> {
  onSuccess?: (data: T) => void;
  onError?: (error: Error) => void;
}

export const useApi = <T,>(
  apiFunction: ApiFunction<T>,
  options: UseApiOptions<T> = {}
) => {
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // ✨ 1. Use a ref to store the latest callbacks
  // This prevents the main `request` function from being recreated if the
  // component re-renders with new inline `onSuccess` or `onError` functions.
  const optionsRef = useRef(options);
  useEffect(() => {
    optionsRef.current = options;
  }, [options]);

  // ✨ 2. Memoize the `request` function with useCallback
  // This ensures the `request` function has a stable identity across re-renders,
  // making it safe to use in dependency arrays of other hooks (like useEffect).
  const request = useCallback(async (...args: Parameters<typeof apiFunction>) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await apiFunction(...args);
      setData(response);
      // Call the latest callback from the ref
      optionsRef.current.onSuccess?.(response);
      return response;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('An unknown error occurred');
      setError(error);
      // Call the latest callback from the ref
      optionsRef.current.onError?.(error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [apiFunction]); // Now only depends on apiFunction

  return { data, error, isLoading, request };
};