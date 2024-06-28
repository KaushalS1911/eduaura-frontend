import useSWR, { mutate } from 'swr';
import { useMemo } from 'react';

import axios from 'axios';
import { fetcher } from '../utils/axios';
import { useAuthContext } from '../auth/hooks';

export function useGetAllAttendance() {
  const { user } = useAuthContext();
  const URL = `${import.meta.env.VITE_AUTH_API}/api/company/${user?.company_id}/attendance`;
  const { data, isLoading, error, isValidating, mutate } = useSWR(URL, fetcher);

  const memoizedValue = useMemo(() => {
    const attendance = data?.attendance || [];

    return {
      attendance,
      attendanceLoading: isLoading,
      attendanceError: error,
      attendanceValidating: isValidating,
      attendanceEmpty: !isLoading && attendance.length === 0,
      mutate,
    };
  }, [data, isLoading, error, isValidating, mutate]);

  return memoizedValue;
}

// Hook to get single student attendance
export function useGetSingleStudentAttendance(studentId) {
  const URL = `https://admin-panel-dmawv.ondigitalocean.app/api/company/attendance/student/${studentId}`;
  const { data, isLoading, error, isValidating } = useSWR(URL, fetcher);
  console.log('data ', data);
  return data;
}

export async function GetAttendanceAdd(postData) {
  try {
    const URL = `${import.meta.env.VITE_AUTH_API}/api/company/attendance`;
    const response = await axios.post(URL, postData);
    return response;
  } catch (error) {
    console.error('Error adding attendance:', error);
    throw error;
  }
}

export async function useAttendanceEdit(payload, AttendanceID) {
  const attendanceEditURL = `https://admin-panel-dmawv.ondigitalocean.app/api/company/attendance/${AttendanceID}`;
  try {
    const response = await axios.put(attendanceEditURL, payload);
    mutate(attendanceEditURL);
    return response.data;
  } catch (error) {
    console.error('Error deleting event:', error);
    throw error;
  }
}

export async function useDeleteSingleAttendance(deleteID) {
  const deleteURL = `https://admin-panel-dmawv.ondigitalocean.app/api/company/attendance/${deleteID}`;
  try {
    await axios.delete(deleteURL);
    mutate(deleteURL);
  } catch (error) {
    console.error('Error deleting event:', error);
  }
}
