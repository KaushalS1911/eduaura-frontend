import { useMemo } from "react";
import { useAuthContext } from "src/auth/hooks";
import { fetcher } from "src/utils/axios";
import useSWR from "swr";

export function useGetFaculty() {
  const { user } = useAuthContext();

  const URL = `${import.meta.env.VITE_AUTH_API}/api/company/${user?.company_id}/faculty`;

  const { data, isLoading, error, isValidating, mutate } = useSWR(URL, fetcher);

  const memoizedValue = useMemo(
    () => ({
      faculty: data?.data || [],
      facultyLoading: isLoading,
      facultyError: error,
      facultyValidating: isValidating,
      facultyEmpty: !isLoading && !data.data.length,
      mutate,
    }),
    [data?.data, error, isLoading, isValidating, mutate]
  );

  return memoizedValue;
}
