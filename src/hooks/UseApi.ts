import { useState } from 'react';

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

  const request = async (...args: Parameters<typeof apiFunction>) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await apiFunction(...args);
      setData(response);
      options.onSuccess?.(response);
      return response;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('An unknown error occurred');
      setError(error);
      options.onError?.(error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return { data, error, isLoading, request };
};