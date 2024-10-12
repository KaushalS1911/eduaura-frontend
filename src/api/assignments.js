import useSWR from 'swr';
import { useMemo } from 'react';

import { fetcher } from '../utils/axios';

export function useGetAssignment(company_id) {
  const URL = `${import.meta.env.VITE_AUTH_API}/api/company/${company_id}/assignment`;
  const { data, isLoading, error, isValidating, mutate } = useSWR(URL, fetcher);
  const memoizedValue = useMemo(
    () => ({
      assignment: data?.data?.assignments || [],
      assignmentLoading: isLoading,
      assignmentError: error,
      assignmentValidating: isValidating,
      assignmentEmpty: !isLoading && !data?.data?.assignments?.length,
      mutate,
    }),
    [data?.data?.assignments, error, isLoading, isValidating, mutate]
  );

  return memoizedValue;
}
export function useGetSingleAssignment(BactchAssignmentID) {
  const URL = `${import.meta.env.VITE_AUTH_API}/api/company/assignment/${BactchAssignmentID}`;
  const { data, isLoading, error, isValidating, mutate } = useSWR(URL, fetcher);
  const memoizedValue = useMemo(
    () => ({
      batchAssignmentData: data?.data?.assignment || [],
      batchAssignmentDataLoading: isLoading,
      batchAssignmentDataError: error,
      batchAssignmentDataValidating: isValidating,
      batchAssignmentDataEmpty: !isLoading && !data?.data?.assignments?.length,
      mutate,
    }),
    [data?.data?.assignments, error, isLoading, isValidating, mutate]
  );

  return memoizedValue;
}
