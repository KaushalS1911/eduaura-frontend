import useSWR from 'swr';
import { useMemo } from 'react';

import { fetcher } from '../utils/axios';
import { useAuthContext } from '../auth/hooks/index.js';
// get all student

export function useGetStudents() {
  const { user } = useAuthContext();

  const URL = `https://admin-panel-dmawv.ondigitalocean.app/api/v2/${user.company_id}/student`;

  const { data, isLoading, error, isValidating , mutate } = useSWR(URL, fetcher);

  const memoizedValue = useMemo(
    () => ({
      students: data?.students || [],
      studentsLoading: isLoading,
      studentsError: error,
      studentsValidating: isValidating,
      studentsEmpty: !isLoading && !data?.students.length,
      mutate
    }),
    [data?.students, error, isLoading, isValidating, mutate]
  );

  return memoizedValue;
}

export function useGetStudentsList(id) {
  const URL = `https://admin-panel-dmawv.ondigitalocean.app/api/v2/${id}/student-list`;
  const { data, isLoading, error, isValidating, mutate } = useSWR(URL, fetcher);
  const memoizedValue = useMemo(
    () => ({
      students: data?.students || [],
      studentsLoading: isLoading,
      studentsError: error,
      studentsValidating: isValidating,
      studentsEmpty: !isLoading && !data?.students.length,
      mutate
    }),
    [data?.students, error, isLoading, isValidating, mutate]
  );
  return memoizedValue;
}

// get single student

export function useGetSingleStudent(studentId) {
  // const URL = `https://admin-panel-dmawv.ondigitalocean.app/api/v2/student/${studentId}`;
  const { user } = useAuthContext();

  const URL = `https://admin-panel-dmawv.ondigitalocean.app/api/v2/${user.company_id}/student`;

  const { data, isLoading, error, isValidating, mutate } = useSWR(URL, fetcher);
  const singleStudent = data?.students.find((data) => data?._id === studentId);
  // const { data, isLoading, error, isValidating, mutate } = useSWR(URL, fetcher);

//  const memoizedValue = useMemo(
//    () => ({
//      student: data?.student || [],
//      studentsLoading: isLoading,
//      studentsError: error,
//      studentsValidating: isValidating,
//      mutate,
//    }),
//    [data?.students, error, isLoading, isValidating, mutate]
//  );
  const studentData = {
    data: singleStudent,
    mutate,
  };

 return studentData;
}

// create student


