import useSWR from 'swr';
import { useMemo } from 'react';

import { useAuthContext } from 'src/auth/hooks';
import { fetcher } from '../utils/axios';

export function useGetBatches() {
  const { user } = useAuthContext();
  const URL = `${import.meta.env.VITE_AUTH_API}/api/company/${user.company_id}/batch`;
  const { data, isLoading, error, isValidating, mutate } = useSWR(URL, fetcher);
  const memoizedValue = useMemo(
    () => ({
      batch: data?.data || [],
      batchLoading: isLoading,
      batchError: error,
      batchValidating: isValidating,
      batchEmpty: !isLoading && !data?.data?.length,
      mutate,
    }),
    [data?.data, error, isLoading, isValidating, mutate]
  );

  return memoizedValue;
}

export function useGetSingleBatches(SingleBatchID) {
  const URL = `${import.meta.env.VITE_AUTH_API}/api/company/batch/${SingleBatchID}`;
  const { data, isLoading, error, isValidating, mutate } = useSWR(URL, fetcher);

  const memoizedValue = useMemo(
    () => ({
      Singlebatch: data?.data?.batch || [],
      SinglebatchLoading: isLoading,
      SinglebatchError: error,
      SinglebatchValidating: isValidating,
      SinglebatchEmpty: !isLoading && !data?.data?.length,
      mutate,
    }),
    [data?.data?.batch, error, isLoading, isValidating, mutate]
  );

  return memoizedValue;
}
