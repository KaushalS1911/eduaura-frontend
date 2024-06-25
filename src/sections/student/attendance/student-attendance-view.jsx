import React from 'react';
import StudentAttendanceListView from './student-attendance-list-view';
import { useGetSingleStudentAttendance } from 'src/api/attendance';

const StudentAttendanceView = ({currentStudent}) => {
    const  data  = useGetSingleStudentAttendance(currentStudent._id);
  return (
    <>
          {data?.attendance && <StudentAttendanceListView attendance={data.attendance}  />}
    </>
  );
};

export default StudentAttendanceView;
