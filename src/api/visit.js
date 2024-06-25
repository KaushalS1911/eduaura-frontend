import useSWR from 'swr';
import { useMemo } from 'react';

import { fetcher } from '../utils/axios';
import { useAuthContext } from '../auth/hooks/index.js';

export function useGetVisits() {
  const { user } = useAuthContext();

  const URL = `https://admin-panel-dmawv.ondigitalocean.app/api/v2/${user.company_id}/visit`;

  const { data, isLoading, error, isValidating ,mutate} = useSWR(URL, fetcher);
  const memoizedValue = useMemo(
    () => ({
      visit: data?.data || [],
      visitLoading: isLoading,
      visitError: error,
      visitValidating: isValidating,
      visitEmpty: !isLoading && !data?.data.length,
      mutate
    }),
    [data?.data, error, isLoading, isValidating]
  );

  return memoizedValue;
}
