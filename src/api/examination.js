import useSWR from 'swr';
import { useMemo } from 'react';

import { fetcher } from '../utils/axios';

export function useGetExam(company_id) {
  const URL = `${import.meta.env.VITE_AUTH_API}/api/company/${company_id}/exam`;
  const { data, isLoading, error, isValidating, mutate } = useSWR(URL, fetcher);
  const memoizedValue = useMemo(
    () => ({
      exam: data?.data?.exams || [],
      examLoading: isLoading,
      examError: error,
      examValidating: isValidating,
      examEmpty: !isLoading && !data?.data?.exams?.length,
      mutate,
    }),
    [data?.data?.exams, error, isLoading, isValidating, mutate]
  );

  return memoizedValue;
}
