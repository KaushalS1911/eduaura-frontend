import useSWR from 'swr';
import { useMemo } from 'react';

import { useAuthContext } from 'src/auth/hooks';

import { fetcher } from '../utils/axios';

export function useGetComplaints() {
  const { user } = useAuthContext();

  const URL = `https://server-eduaura-pyjuy.ondigitalocean.app/api/v2/${user?.company_id}/complain`;

  const { data, isLoading, error, isValidating, mutate } = useSWR(URL, fetcher);

  const memoizedValue = useMemo(
    () => ({
      complaints: data?.data || [],
      complaintsLoading: isLoading,
      complaintsError: error,
      complaintsValidating: isValidating,
      complaintsEmpty: !isLoading && !data?.data?.length,
      mutate,
    }),
    [data?.data, error, isLoading, isValidating, mutate],
  );

  return memoizedValue;
}
