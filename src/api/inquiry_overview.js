import useSWR from 'swr';
import { useMemo } from 'react';
import { fetcher } from 'src/utils/axios';
import { useAuthContext } from 'src/auth/hooks';

export function useGetInquiryOverview() {
  const { user } = useAuthContext();
  const URL = `${import.meta.env.VITE_AUTH_API}/api/company/${user?.company_id}/inquiry/overview`;
  const { data, error, isValidating, mutate } = useSWR(URL, fetcher);
  if (error) {
    console.error('Error fetching data:', error);
  }
  const memoizedValue = useMemo(() => {
    const inquiryOverview = data || [];
    const isLoading = !data && !error;
    return {
      inquiryOverview,
      inquiryLoading: isLoading,
      inquiryError: error,
      inquiryValidating: isValidating,
      inquiryEmpty: !isLoading && inquiryOverview.length === 0,
      mutate,
    };
  }, [data, error, isValidating, mutate]);

  return memoizedValue;
}
