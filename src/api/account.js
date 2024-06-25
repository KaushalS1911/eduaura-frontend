import useSWR from 'swr';
import { useMemo } from 'react';

import { fetcher } from '../utils/axios';
import { useAuthContext } from 'src/auth/hooks';

export function useGetAccount(startDate, endDate) {
  const { user } = useAuthContext();
  // `https://admin-panel-dmawv.ondigitalocean.app/api/company/${user?.company_id}/account?startDate=${startDate}&endDate=${endDate}`;
  const URL = `https://admin-panel-dmawv.ondigitalocean.app/api/company/${user?.company_id}/account`;

  const { data, isLoading, error, isValidating } = useSWR(URL, fetcher);
  const memoizedValue = useMemo(() => {
    const Account = data?.data?.data || [];
    return {
      Account,
      AccountLoading: isLoading,
      AccountError: error,
      AccountValidating: isValidating,
      AccountEmpty: !isLoading && Account.length === 0,
    };
  }, [data, isLoading, error, isValidating]);

  return memoizedValue;
}

export function useGetAccountOverDue(startDate, endDate) {
  const { user } = useAuthContext();
  const URL = `https://admin-panel-dmawv.ondigitalocean.app/api/v2/${user?.company_id}/student/fee-detail/overdue`;

  const { data, isLoading, error, isValidating } = useSWR(URL, fetcher);
  const memoizedValue = useMemo(() => {
    const overdue = data?.data?.data || [];
    return {
      overdue,
      overdueLoading: isLoading,
      overdueError: error,
      overdueValidating: isValidating,
      overdueEmpty: !isLoading && overdue.length === 0,
    };
  }, [data, isLoading, error, isValidating]);

  return memoizedValue;
}
