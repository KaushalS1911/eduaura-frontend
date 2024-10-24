import React, { useMemo } from 'react';
import StudentAssignmentListView from './student-assignment-list-view';
import { useGetAssignment } from '../../../api/assignments';
import { useAuthContext } from '../../../auth/hooks';

const StudentAssignmentView = ({ currentStudent }) => {
  const { user } = useAuthContext();
  const { assignment } = useGetAssignment(user.company_id);
  const assignmentData = useMemo(() => {
    if (!assignment) return [];
    return assignment.flatMap((assignmentItem) =>
      assignmentItem.students
        .filter((student) => student.student_id._id === currentStudent._id)
        .map((student) => ({
          ...student,
          remarks: student.remarks,
          status: student.status,
          student_id: student.student_id,
          assignmentdata: assignmentItem,
        })),
    );
  }, [assignment, currentStudent._id]);

  return (
    <>
      {assignmentData && <StudentAssignmentListView assignmentData={assignmentData} />}
    </>
  );
};

export default StudentAssignmentView;
