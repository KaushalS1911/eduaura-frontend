import useSWR from 'swr';
import { useMemo } from 'react';

import { fetcher } from '../utils/axios';
import { useAuthContext } from '../auth/hooks/index.js';

export function useGetVisitsOverview() {
  const { user } = useAuthContext();

  const URL = `https://admin-panel-dmawv.ondigitalocean.app/api/v2/${user?.company_id}/visit/overview`;

  const { data, isLoading, error, isValidating, mutate } = useSWR(URL, fetcher);
  console.log(data);
  const memoizedValue = useMemo(
    () => ({
      visit: data || [],
      visitLoading: isLoading,
      visitError: error,
      visitValidating: isValidating,
      visitEmpty: !isLoading,
      mutate,
    }),
    [data, error, isLoading, isValidating],
  );

  return memoizedValue;
}
