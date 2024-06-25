import PropTypes from 'prop-types';
import { useCallback, useMemo } from 'react';
import Box from '@mui/material/Box';
import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';
import ExaminationItem from './examination-item';
import { useGetExam } from 'src/api/examination';

export default function ExaminationList({ currentStudentExams }) {
  const router = useRouter();



  const handleView = useCallback(
    (id) => {
      router.push(paths.dashboard.student.details(id));
    },
    [router]
  );

  const handleEdit = useCallback(
    (id) => {
      router.push(paths.dashboard.student.edit(id));
    },
    [router]
  );

  const handleDelete = useCallback((id) => {
    console.info('DELETE', id);
  }, []);


  return (
    <>
      <Box
        gap={3}
        display="grid"
        gridTemplateColumns={{
          xs: 'repeat(1, 1fr)',
          sm: 'repeat(2, 1fr)',
          md: 'repeat(3, 1fr)',
        }}
      >
        {currentStudentExams.map((studentExam) => (
          <ExaminationItem
            key={studentExam._id}
            exam={studentExam}
            onView={() => handleView(studentExam.examId)}
            onEdit={() => handleEdit(studentExam.examId)}
            onDelete={() => handleDelete(studentExam.examId)}
          />
        ))}
      </Box>

      {/* Uncomment and modify this block if pagination is needed */}
      {/* {currentStudentExams.length > 8 && (
        <Pagination
          count={Math.ceil(currentStudentExams.length / 8)}
          sx={{
            mt: 8,
            [`& .${paginationClasses.ul}`]: {
              justifyContent: 'center',
            },
          }}
        />
      )} */}
    </>
  );
}

ExaminationList.propTypes = {
  currentStudent: PropTypes.shape({
    company_id: PropTypes.string.isRequired,
    _id: PropTypes.string.isRequired,
  }).isRequired,
};
