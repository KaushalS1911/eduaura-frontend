import useSWR from 'swr';
import { useMemo } from 'react';

import { fetcher } from '../utils/axios';
import { useAuthContext } from '../auth/hooks';

export function useGetDemos() {
  const { user } = useAuthContext();
  const URL = `https://admin-panel-dmawv.ondigitalocean.app/api/company/${user?.company_id}/upcoming-demo`;
  const { data, isLoading, error, isValidating, mutate } = useSWR(URL, fetcher);

  const memoizedValue = useMemo(
    () => ({
      demos: data?.data || [],
      demosLoading: isLoading,
      demosError: error,
      demosValidating: isValidating,
      demosEmpty: !isLoading && !data?.data?.length,
      mutate,
    }),
    [data?.data, error, isLoading, isValidating, mutate],
  );

  return memoizedValue;
}
export function useGetDashboardData() {
  const { user } = useAuthContext();
  const URL = `https://admin-panel-dmawv.ondigitalocean.app/api/company/${user?.company_id}/dashboard`;
  const { data, isLoading, error, isValidating, mutate } = useSWR(URL, fetcher);

  const memoizedValue = useMemo(
    () => ({
      dashboard: data?.data || [],
      dashboardLoading: isLoading,
      dashboardError: error,
      dashboardValidating: isValidating,
      dashboardEmpty: !isLoading && !data?.data?.length,
      mutate,
    }),
    [data?.data, error, isLoading, isValidating, mutate],
  );

  return memoizedValue;
}
export function useGetCourses() {
  const { user } = useAuthContext();
  const URL = `https://admin-panel-dmawv.ondigitalocean.app/api/company/${user?.company_id}/student/course`;
  const { data, isLoading, error, isValidating, mutate } = useSWR(URL, fetcher);

  const memoizedValue = useMemo(
    () => ({
      courses: data?.data || [],
      coursesLoading: isLoading,
      coursesError: error,
      coursesValidating: isValidating,
      coursesEmpty: !isLoading && !data?.data?.length,
      mutate,
    }),
    [data?.data, error, isLoading, isValidating, mutate],
  );

  return memoizedValue;
}
export function useGetAttendance() {
  const { user } = useAuthContext();
  const URL = `https://admin-panel-dmawv.ondigitalocean.app/api/company/${user?.company_id}/attendance/logs`;
  const { data, isLoading, error, isValidating, mutate } = useSWR(URL, fetcher);

  const memoizedValue = useMemo(
    () => ({
      attendance: data?.data || [],
      attendanceLoading: isLoading,
      attendanceError: error,
      attendanceValidating: isValidating,
      attendanceEmpty: !isLoading && !data?.data?.length,
      mutate,
    }),
    [data?.data, error, isLoading, isValidating, mutate],
  );

  return memoizedValue;
}
