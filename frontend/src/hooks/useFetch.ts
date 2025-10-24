import { useState, useEffect, useCallback } from 'react';

interface UseFetchOptions {
  immediate?: boolean;
}

interface UseFetchReturn<T> {
  data: T | null;
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export const useFetch = <T>(
  fetchFn: () => Promise<T>,
  deps: any[] = [],
  options: UseFetchOptions = {}
): UseFetchReturn<T> => {
  const [data, setData] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const { immediate = true } = options;

  const executeFetch = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const result = await fetchFn();
      setData(result);
    } catch (err: any) {
      setError(err.message || 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  }, deps);

  useEffect(() => {
    if (immediate) {
      executeFetch();
    }
  }, [executeFetch, immediate]);

  const refetch = useCallback(async () => {
    await executeFetch();
  }, [executeFetch]);

  return {
    data,
    isLoading,
    error,
    refetch,
  };
};