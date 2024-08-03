import PropTypes from 'prop-types';
import { useMemo } from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import TableRow from '@mui/material/TableRow';
import TableHead from '@mui/material/TableHead';
import TableCell from '@mui/material/TableCell';
import TableBody from '@mui/material/TableBody';
import Typography from '@mui/material/Typography';
import TableContainer from '@mui/material/TableContainer';
import { Paper } from '@mui/material';

import { useGetConfigs } from 'src/api/config';
import logo from '../../../assets/logo/jbs.png';
import ExamToolbar from './exam-toolbar';
import { fData } from 'src/utils/format-number';
import moment from 'moment';

export default function ExamDetails({ examData }) {
  const { configs } = useGetConfigs();

  const calculatePercentage = (obtainedMarks, totalMarks) => {
    return ((obtainedMarks / totalMarks) * 100).toFixed(2);
  };

  const calculateGrade = (percentage) => {
    if (percentage >= 90) return 'A';
    if (percentage >= 80) return 'B';
    if (percentage >= 70) return 'C';
    if (percentage >= 60) return 'D';
    if (percentage >= 50) return 'E';
    return 'F';
  };

  const calculateResult = (obtainedMarks, totalMarks) => {
    return (obtainedMarks / totalMarks) * 100 >= 33 ? 'Pass' : 'Fail';
  };

  const calculateRank = (students) => {
    const studentsWithPercentage = students?.map((student) => ({
      ...student,
      percentage: parseFloat(calculatePercentage(student.obtained_marks, examData.total_marks)),
    }));
    const sortedStudents = studentsWithPercentage?.sort((a, b) => b.percentage - a.percentage);
    return sortedStudents?.map((student, index) => ({
      ...student,
      rank: index + 1,
    }));
  };

  const calculatePassFailCount = (students) => {
    const passFailCount = { pass: 0, fail: 0 };
    students?.forEach((student) => {
      if (calculateResult(student.obtained_marks, examData.total_marks) === 'Pass') {
        passFailCount.pass += 1;
      } else {
        passFailCount.fail += 1;
      }
    });
    return passFailCount;
  };

  const calculateAveragePercentage = (students) => {
    const totalObtainedMarks = students?.reduce((acc, student) => acc + student.obtained_marks, 0);
    const totalMarks = students?.length * examData?.total_marks;
    return calculatePercentage(totalObtainedMarks, totalMarks);
  };

  const rankedStudents = useMemo(() => calculateRank(examData.students), [examData.students]);
  const passFailCount = useMemo(
    () => calculatePassFailCount(examData.students),
    [examData.students]
  );

  const gradeSummary = useMemo(() => {
    const gradeCounts = {
      A: 0,
      B: 0,
      C: 0,
      D: 0,
      E: 0,
      F: 0,
    };
    examData?.students?.forEach((student) => {
      const percentage = parseFloat(
        calculatePercentage(student?.obtained_marks, examData.total_marks)
      );
      const grade = calculateGrade(percentage);
      if (gradeCounts[grade] !== undefined) {
        gradeCounts[grade]++;
      }
    });
    return gradeCounts;
  }, [examData?.students]);

  return (
    <>
      <ExamToolbar
        examData={examData}
        calculatePercentage={calculatePercentage}
        calculateResult={calculateResult}
        calculateGrade={calculateGrade}
        passFailCount={passFailCount}
        gradeSummary={gradeSummary}
        configs={configs}
        rankedStudents={rankedStudents}
        calculateAveragePercentage={calculateAveragePercentage}
      />
      <Card sx={{ py: 5, px: 5 }}>
        <Box rowGap={5}>
          <Box
            display={'flex'}
            alignItems={'center'}
            justifyContent={'space-between'}
            sx={{ backgroundColor: '#F6F6F6', p: 2 }}
          >
            <Box>
              {configs?.company_details?.logo ? (
                <img
                  style={{ height: '100px', width: '100px', objectFit: 'cover' }}
                  src={configs?.company_details?.logo}
                  alt={configs?.company_details?.logo}
                />
              ) : (
                <img
                  style={{ height: '100px', width: '100px', objectFit: 'cover' }}
                  src={logo}
                  alt={logo}
                />
              )}
            </Box>
            <Box textAlign={'center'}>
              <Typography variant="h4" sx={{ fontSize: '16px', fontWeight: '700' }}>
                {configs?.company_details?.name}
              </Typography>
              <Typography>{configs?.company_details?.address_1}</Typography>
            </Box>
            <Box></Box>
          </Box>
          <Box my={3.5} display={'flex'} justifyContent={'space-between'} alignItems={'start'}>
            <Box display={'flex'} alignItems={'center'}>
              <Typography sx={{ fontSize: '16px', fontWeight: '700' }}>Course :</Typography>
              <Typography px={2}>Full stack</Typography>
            </Box>
            <Box>
              <Box display={'flex'} alignItems={'center'}>
                <Typography sx={{ fontSize: '16px', fontWeight: '700' }}>Exam :</Typography>
                <Typography px={2}>{examData?.title}</Typography>
              </Box>
              <Box display={'flex'} alignItems={'center'}>
                <Typography sx={{ fontSize: '16px', fontWeight: '700' }}>Exam Date :</Typography>
                <Typography px={2}>
                  {examData && moment(examData.date).format('MMMM Do YYYY')}
                </Typography>
              </Box>
            </Box>
          </Box>
          <Box>
            <Typography variant="h4">Result</Typography>
          </Box>
          <Box mt={2}>
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow
                    sx={{ borderTop: '3px solid #E6E6E6', borderBottom: '3px solid #E6E6E6' }}
                  >
                    <TableCell
                      sx={{
                        color: 'black',
                        backgroundColor: 'transparent',
                        fontSize: '16px',
                      }}
                    >
                      #
                    </TableCell>
                    <TableCell
                      sx={{
                        color: 'black',
                        backgroundColor: 'transparent',
                        fontSize: '16px',
                      }}
                    >
                      Name
                    </TableCell>
                    <TableCell
                      sx={{
                        color: 'black',
                        backgroundColor: 'transparent',
                        fontSize: '16px',
                        textAlign: 'center',
                      }}
                    >
                      Total
                    </TableCell>
                    <TableCell
                      sx={{
                        color: 'black',
                        backgroundColor: 'transparent',
                        fontSize: '16px',
                        textAlign: 'center',
                      }}
                    >
                      {examData?.title}
                    </TableCell>
                    <TableCell
                      sx={{
                        color: 'black',
                        backgroundColor: 'transparent',
                        fontSize: '16px',
                        textAlign: 'center',
                      }}
                    >
                      Percentage
                    </TableCell>
                    <TableCell
                      sx={{
                        color: 'black',
                        backgroundColor: 'transparent',
                        fontSize: '16px',
                        textAlign: 'center',
                      }}
                    >
                      Result
                    </TableCell>
                    <TableCell
                      sx={{
                        color: 'black',
                        backgroundColor: 'transparent',
                        fontSize: '16px',
                        textAlign: 'center',
                      }}
                    >
                      Rank
                    </TableCell>
                    <TableCell
                      sx={{
                        color: 'black',
                        backgroundColor: 'transparent',
                        fontSize: '16px',
                        textAlign: 'center',
                      }}
                    >
                      Grade
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {rankedStudents?.map((row, index) => (
                    <TableRow key={row.id}>
                      <TableCell>{index + 1}</TableCell>
                      <TableCell>
                        {row?.student_id?.firstName + ' ' + row?.student_id?.lastName}
                      </TableCell>
                      <TableCell sx={{ textAlign: 'center' }}>{examData?.total_marks}</TableCell>
                      <TableCell sx={{ textAlign: 'center' }}>{row?.obtained_marks}</TableCell>
                      <TableCell sx={{ textAlign: 'center' }}>
                        {calculatePercentage(row?.obtained_marks, examData?.total_marks)}%
                      </TableCell>
                      <TableCell sx={{ textAlign: 'center' }}>
                        {calculateResult(row?.obtained_marks, examData?.total_marks)}
                      </TableCell>
                      <TableCell sx={{ textAlign: 'center' }}>{row?.rank}</TableCell>
                      <TableCell sx={{ textAlign: 'center' }}>
                        {calculateGrade(
                          calculatePercentage(row?.obtained_marks, examData?.total_marks)
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
          <Box mt={5}>
            <Box>
              <Typography variant="h4">Result Summary</Typography>
            </Box>
            <Box mt={2.5}>
              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow
                      sx={{ borderTop: '3px solid #E6E6E6', borderBottom: '3px solid #E6E6E6' }}
                    >
                      <TableCell sx={{ backgroundColor: 'transparent' }}>Metric</TableCell>
                      <TableCell sx={{ textAlign: 'center', backgroundColor: 'transparent' }}>
                        {examData.title}
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    <TableRow>
                      <TableCell>Pass</TableCell>
                      <TableCell sx={{ textAlign: 'center' }}>{passFailCount.pass}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Fail</TableCell>
                      <TableCell sx={{ textAlign: 'center' }}>{passFailCount.fail}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Percentage(%)</TableCell>
                      <TableCell sx={{ textAlign: 'center' }}>
                        {calculateAveragePercentage(examData?.students)}%
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>
          </Box>
          <Box mt={5}>
            <Box>
              <Typography variant="h4">Grade Summary</Typography>
            </Box>
            <Box mt={2.5}>
              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow
                      sx={{ borderTop: '3px solid #E6E6E6', borderBottom: '3px solid #E6E6E6' }}
                    >
                      <TableCell sx={{ backgroundColor: 'transparent' }}>Grade</TableCell>
                      {Object.entries(gradeSummary)?.map(([grade, count]) => (
                        <>
                          <TableCell sx={{ textAlign: 'center', backgroundColor: 'transparent' }}>
                            {grade}
                          </TableCell>
                        </>
                      ))}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    <TableRow>
                      <TableCell sx={{ backgroundColor: 'transparent' }}>Count</TableCell>
                      {Object.entries(gradeSummary).map(([grade, count]) => (
                        <>
                          <TableCell sx={{ textAlign: 'center' }}>{count}</TableCell>
                        </>
                      ))}
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>
          </Box>
        </Box>
      </Card>
    </>
  );
}

ExamDetails.propTypes = {
  examData: PropTypes.shape({
    title: PropTypes.string,
    total_marks: PropTypes.number,
    students: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.string,
        student_id: PropTypes.shape({
          firstName: PropTypes.string,
          lastName: PropTypes.string,
        }),
        obtained_marks: PropTypes.number,
        practical_marks: PropTypes.number,
        status: PropTypes.string,
        payment_mode: PropTypes.string,
      })
    ),
    subjects: PropTypes.arrayOf(
      PropTypes.shape({
        name: PropTypes.string,
        pass: PropTypes.number,
        fail: PropTypes.number,
        percentage: PropTypes.number,
        present: PropTypes.number,
        absent: PropTypes.number,
      })
    ),
  }).isRequired,
};
