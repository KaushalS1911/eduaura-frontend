import useSWR from 'swr';
import { useMemo } from 'react';

import { fetcher } from '../utils/axios';
import { useAuthContext } from '../auth/hooks/index.js';

export function useGetTasks() {
  const { user } = useAuthContext();

  const URL = `https://admin-panel-dmawv.ondigitalocean.app/api/company/task/${user._id}`;

  const { data, isLoading, error, isValidating,mutate } = useSWR(URL, fetcher);
  const memoizedValue = useMemo(
    () => ({
      tasks: data?.data || [],
      tasksLoading: isLoading,
      tasksError: error,
      tasksValidating: isValidating,
      tasksEmpty: !isLoading && !data?.data.length,
      mutate,
    }),
    [data?.data, error, isLoading, isValidating]
  );

  return memoizedValue;
}
