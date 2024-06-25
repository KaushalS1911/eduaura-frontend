import useSWR from 'swr';
import { useMemo } from 'react';

import { useAuthContext } from 'src/auth/hooks';
import { fetcher } from '../utils/axios';

export function useGetSeminar() {
  const { user } = useAuthContext();
  const URL = `${import.meta.env.VITE_AUTH_API}/api/company/${user.company_id}/seminar`;
  const { data, error, isValidating, mutate } = useSWR(URL, fetcher);

  if (error) {
    console.error('Error fetching data:', error);
  }

  const memoizedValue = useMemo(() => {
    const seminars = data?.data || [];
    const isLoading = !data && !error;
    return {
      seminars,
      SeminarLoading: isLoading,
      SeminarError: error,
      SeminarValidating: isValidating,
      SeminarEmpty: !isLoading && seminars.length === 0,
      mutate,
    };
  }, [data, error, isValidating, mutate]);

  return memoizedValue;
}
