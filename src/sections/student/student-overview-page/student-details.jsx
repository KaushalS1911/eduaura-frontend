import PropTypes from 'prop-types';
import { useState, useCallback, useMemo } from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import TableRow from '@mui/material/TableRow';
import TableHead from '@mui/material/TableHead';
import TableCell from '@mui/material/TableCell';
import TableBody from '@mui/material/TableBody';
import Typography from '@mui/material/Typography';
import TableContainer from '@mui/material/TableContainer';
import Grid from '@mui/material/Grid';
import { styled } from '@mui/material/styles';

import { useGetConfigs } from 'src/api/config';
import Scrollbar from 'src/components/scrollbar';
import StudentToolbar from './student-toolbar';
import { fDate } from 'src/utils/format-time';
import { Paper } from '@mui/material';
import { useGetExam } from 'src/api/examination';
import { useGetSingleStudentAttendance } from 'src/api/attendance';
import logo from '../../../assets/logo/jbs.png';
import user from '../../../assets/logo/user.webp';

export default function StudentDetails({ studentData }) {
  const { configs } = useGetConfigs();

  const installmentsData = studentData?.fee_detail?.installments?.filter((e) => {
    if (e.status === 'paid') {
      return e;
    }
  });

  const { attendance = [] } = useGetSingleStudentAttendance(studentData?._id) || {};

  const attendanceCounts = useMemo(() => {
    return attendance.reduce(
      (counts, record) => {
        if (record.status === 'present' || record.status === 'late') {
          counts.present += 1;
        } else if (record.status === 'absent') {
          counts.absent += 1;
        }
        counts.total += 1;
        return counts;
      },
      { present: 0, absent: 0, total: 0 }
    );
  }, [attendance]);

  const { exam } = useGetExam(studentData?.company_id);

  const currentStudentExams = useMemo(() => {
    if (!exam) return [];
    return exam.flatMap((examItem) =>
      examItem.students
        .filter((student) => student.student_id._id === studentData?._id)
        .map((student) => ({
          ...student,
          examTitle: examItem.title,
          totalMarks: examItem.total_marks,
          examDate: examItem.date,
          examId: examItem._id,
        }))
    );
  }, [exam, studentData?._id]);

  const StudentDetails = (
    <>
      <Box>
        <Box>
          <Typography variant="h4">Personal Details</Typography>
        </Box>
        <Box display={'flex'} justifyContent={'space-between'} alignItems={'center'} mt={2}>
          <Box width={'100%'}>
            <Grid container>
              <Grid xs={6}>
                <Grid xs={12} display={'flex'} alignItems={'center'} mb={1}>
                  <Typography sx={{ fontWeight: '700' }}>Name :</Typography>
                  <Typography px={2} sx={{ fontWeight: '500' }}>
                    {studentData?.firstName + ' ' + studentData?.lastName}
                  </Typography>
                </Grid>
                <Grid xs={12} display={'flex'} alignItems={'center'} mb={1}>
                  <Typography sx={{ fontWeight: '700' }}>Course :</Typography>
                  <Typography px={2} sx={{ fontWeight: '500' }}>
                    {studentData?.course}
                  </Typography>
                </Grid>
                <Grid xs={12} display={'flex'} alignItems={'center'} mb={1}>
                  <Typography sx={{ fontWeight: '700' }}>EN No. :</Typography>
                  <Typography px={2} sx={{ fontWeight: '500' }}>
                    {studentData?.enrollment_no}
                  </Typography>
                </Grid>
                <Grid xs={12} display={'flex'} alignItems={'center'} mb={1}>
                  <Typography sx={{ fontWeight: '700' }}>Gender :</Typography>
                  <Typography px={2} sx={{ fontWeight: '500' }}>
                    {studentData?.gender}
                  </Typography>
                </Grid>
                <Grid xs={12} display={'flex'} alignItems={'center'} mb={1}>
                  <Typography sx={{ fontWeight: '700' }}>Contact :</Typography>
                  <Typography px={2} sx={{ fontWeight: '500' }}>
                    {studentData?.contact}
                  </Typography>
                </Grid>
                <Grid xs={12} display={'flex'} mb={1}>
                  <Typography sx={{ fontWeight: '700' }}>Address :</Typography>
                  <Typography
                    px={2}
                    sx={{
                      fontWeight: '500',
                      width: '360px',
                    }}
                  >
                    {studentData?.address_detail?.address_1 +
                      ' ' +
                      studentData?.address_detail?.address_2 +
                      ' ' +
                      studentData?.address_detail?.city +
                      ' ' +
                      studentData?.address_detail?.state +
                      ' ' +
                      studentData?.address_detail?.country}
                  </Typography>
                </Grid>
              </Grid>
              <Grid xs={6}>
                <Grid container>
                  <Grid xs={12}>
                    <Grid xs={12} display={'flex'} alignItems={'center'} mb={1}>
                      <Typography sx={{ fontWeight: '700' }}>Email :</Typography>
                      <Typography px={2} sx={{ fontWeight: '500' }}>
                        {studentData?.email}
                      </Typography>
                    </Grid>
                    <Grid xs={12} display={'flex'} alignItems={'center'} mb={1}>
                      <Typography sx={{ fontWeight: '700' }}>Joining Date :</Typography>
                      <Typography px={2} sx={{ fontWeight: '500' }}>
                        {fDate(studentData?.joining_date)}
                      </Typography>
                    </Grid>
                    <Grid xs={12} display={'flex'} alignItems={'center'} mb={1}>
                      <Typography sx={{ fontWeight: '700' }}>Blood Group :</Typography>
                      <Typography px={2} sx={{ fontWeight: '500' }}>
                        {studentData?.blood_group}
                      </Typography>
                    </Grid>
                    <Grid xs={12} display={'flex'} alignItems={'center'} mb={1}>
                      <Typography sx={{ fontWeight: '700' }}>Date of Birth :</Typography>
                      <Typography px={2} sx={{ fontWeight: '500' }}>
                        {fDate(studentData?.dob)}
                      </Typography>
                    </Grid>
                    <Grid xs={12} display={'flex'} alignItems={'center'} mb={1}>
                      <Typography sx={{ fontWeight: '700' }}>Zip/Code :</Typography>
                      <Typography px={2} sx={{ fontWeight: '500' }}>
                        {studentData?.address_detail?.zipcode}
                      </Typography>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Box>
          <Box>
            <Box mx={1.5}>
              {studentData?.profile_pic ? (
                <img
                  src={studentData?.profile_pic}
                  alt={studentData?.profile_pic}
                  style={{
                    width: '210px',
                    height: '210px',
                    borderRadius: '10px',
                    objectFit: 'cover',
                  }}
                />
              ) : (
                <img
                  src={user}
                  alt={user}
                  style={{
                    width: '210px',
                    height: '210px',
                    borderRadius: '10px',
                    objectFit: 'cover',
                  }}
                />
              )}
            </Box>
          </Box>
        </Box>
      </Box>
    </>
  );

  const GuardianDetails = (
    <>
      <Box>
        <Box>
          <Typography variant="h4">Guardian Details</Typography>
        </Box>
        <Box mt={2}>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow
                  sx={{ borderTop: '3px solid #E6E6E6', borderBottom: '3px solid #E6E6E6' }}
                >
                  <TableCell sx={{ color: 'black', backgroundColor: 'transparent' }}>#</TableCell>
                  <TableCell
                    sx={{
                      color: 'black',
                      backgroundColor: 'transparent',
                      fontSize: '16px',
                      width: '500px',
                    }}
                  >
                    Name
                  </TableCell>
                  <TableCell
                    sx={{
                      color: 'black',
                      backgroundColor: 'transparent',
                      fontSize: '16px',
                      width: '500px',
                    }}
                  >
                    Type
                  </TableCell>
                  <TableCell
                    sx={{
                      color: 'black',
                      backgroundColor: 'transparent',
                      fontSize: '16px',
                      width: '500px',
                    }}
                  >
                    Contact
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {studentData?.guardian_detail?.map((row, index) => (
                  <TableRow key={row.id}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>{row?.firstName + ' ' + row?.lastName}</TableCell>
                    <TableCell>{row?.relation_type}</TableCell>
                    <TableCell>{row?.contact}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      </Box>
    </>
  );

  const FeesDetails = (
    <>
      <Box>
        <Box>
          <Typography variant="h4">Fees Details</Typography>
        </Box>
        <Box mt={2}>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow
                  sx={{ borderTop: '3px solid #E6E6E6', borderBottom: '3px solid #E6E6E6' }}
                >
                  <TableCell sx={{ color: 'black', backgroundColor: 'transparent' }}>#</TableCell>
                  <TableCell
                    sx={{
                      color: 'black',
                      backgroundColor: 'transparent',
                      fontSize: '16px',
                    }}
                  >
                    Installment Date
                  </TableCell>
                  <TableCell
                    sx={{
                      color: 'black',
                      backgroundColor: 'transparent',
                      fontSize: '16px',
                    }}
                  >
                    Amount
                  </TableCell>
                  <TableCell
                    sx={{
                      color: 'black',
                      backgroundColor: 'transparent',
                      fontSize: '16px',
                    }}
                  >
                    Payment Date
                  </TableCell>
                  <TableCell
                    sx={{
                      color: 'black',
                      backgroundColor: 'transparent',
                      fontSize: '16px',
                    }}
                  >
                    Payment Mode
                  </TableCell>
                  <TableCell
                    sx={{
                      color: 'black',
                      backgroundColor: 'transparent',
                      fontSize: '16px',
                    }}
                  >
                    Status
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {installmentsData?.map((row, index) => (
                  <TableRow key={row.id}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>{fDate(row?.installment_date)}</TableCell>
                    <TableCell>{row?.amount}</TableCell>
                    <TableCell>{fDate(row?.payment_date)}</TableCell>
                    <TableCell>{row?.payment_mode}</TableCell>
                    <TableCell>{row?.status}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      </Box>
    </>
  );

  const AttendanceDetails = (
    <>
      <Box>
        <Box>
          <Typography variant="h4">Attendance Details</Typography>
        </Box>
        <Box mt={2}>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow
                  sx={{ borderTop: '3px solid #E6E6E6', borderBottom: '3px solid #E6E6E6' }}
                >
                  <TableCell
                    align="center"
                    sx={{
                      color: 'black',
                      backgroundColor: 'transparent',
                      fontSize: '16px',
                    }}
                  >
                    Total Days
                  </TableCell>
                  <TableCell
                    align="center"
                    sx={{
                      color: 'black',
                      backgroundColor: 'transparent',
                      fontSize: '16px',
                    }}
                  >
                    Present
                  </TableCell>
                  <TableCell
                    align="center"
                    sx={{
                      color: 'black',
                      backgroundColor: 'transparent',
                      fontSize: '16px',
                    }}
                  >
                    Absent
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow sx={{ borderBottom: '3px solid #E6E6E6' }}>
                  <TableCell align="center" sx={{ fontWeight: '600', fontSize: '40px' }}>
                    {attendanceCounts?.total}
                  </TableCell>
                  <TableCell align="center" sx={{ fontWeight: '600', fontSize: '40px' }}>
                    {attendanceCounts?.present}
                  </TableCell>
                  <TableCell align="center" sx={{ fontWeight: '600', fontSize: '40px' }}>
                    {attendanceCounts?.absent}
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      </Box>
    </>
  );

  const ExamDetails = (
    <>
      <Box>
        <Box>
          <Typography variant="h4">Exam Details</Typography>
        </Box>
        <Box mt={2}>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow
                  sx={{ borderTop: '3px solid #E6E6E6', borderBottom: '3px solid #E6E6E6' }}
                >
                  <TableCell sx={{ color: 'black', backgroundColor: 'transparent' }}>#</TableCell>
                  <TableCell
                    sx={{
                      color: 'black',
                      backgroundColor: 'transparent',
                      fontSize: '16px',
                    }}
                  >
                    Exam Type
                  </TableCell>
                  <TableCell
                    sx={{
                      color: 'black',
                      backgroundColor: 'transparent',
                      fontSize: '16px',
                    }}
                  >
                    Posted Date
                  </TableCell>
                  <TableCell
                    sx={{
                      color: 'black',
                      backgroundColor: 'transparent',
                      fontSize: '16px',
                    }}
                  >
                    Total Marks
                  </TableCell>
                  <TableCell
                    sx={{
                      color: 'black',
                      backgroundColor: 'transparent',
                      fontSize: '16px',
                    }}
                  >
                    Obtained Mark
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {currentStudentExams?.map((row, index) => (
                  <TableRow key={row.id}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>{row?.examTitle}</TableCell>
                    <TableCell>{fDate(row?.examDate)}</TableCell>
                    <TableCell>{row?.totalMarks}</TableCell>
                    <TableCell>{row?.obtained_marks}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      </Box>
    </>
  );

  const RemarkDetails = (
    <>
      <Box>
        <Box>
          <Typography variant="h4">Remark</Typography>
        </Box>
        <Box mt={2}>
          {studentData?.remarks?.map((e) => (
            <Box display={'flex'} alignItems={'center'}>
              <Typography sx={{ fontWeight: '500', color: '#969696' }}>{fDate(e.date)}</Typography>
              <Typography mx={1}>-</Typography>
              <Typography px={1}>{e.title}</Typography>
            </Box>
          ))}
        </Box>
      </Box>
    </>
  );

  const CourseDetails = (
    <>
      <Box>
        <Box>
          <Typography variant="h4">Course Details</Typography>
        </Box>
        <Box mt={2}>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow
                  sx={{ borderTop: '3px solid #E6E6E6', borderBottom: '3px solid #E6E6E6' }}
                >
                  <TableCell sx={{ color: 'black', backgroundColor: 'transparent' }}>#</TableCell>
                  <TableCell
                    sx={{
                      color: 'black',
                      backgroundColor: 'transparent',
                      fontSize: '16px',
                    }}
                  >
                    Language Name
                  </TableCell>
                  <TableCell
                    sx={{
                      color: 'black',
                      backgroundColor: 'transparent',
                      fontSize: '16px',
                    }}
                  >
                    Date of Complete
                  </TableCell>
                  <TableCell
                    sx={{
                      color: 'black',
                      backgroundColor: 'transparent',
                      fontSize: '16px',
                    }}
                  >
                    Status
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {studentData?.course_completed?.map((row, index) => (
                  <TableRow key={row?.id}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>{row?.language?.label}</TableCell>
                    <TableCell>{fDate(row?.date)}</TableCell>
                    <TableCell>Completed</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      </Box>
    </>
  );

  return (
    <>
      <StudentToolbar
        studentData={studentData}
        attendanceCounts={attendanceCounts}
        currentStudentExams={currentStudentExams}
        installmentsData={installmentsData}
        configs={configs}
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
              {configs?.company_details?.logo_url ? (
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
          <Box></Box>
        </Box>
        <Box sx={{ my: 5, py: 1 }}>{StudentDetails}</Box>
        {studentData?.guardian_detail[0] && <Box sx={{ my: 5, py: 1 }}>{GuardianDetails}</Box>}
        {installmentsData != [] && <Box sx={{ my: 5, py: 1 }}>{FeesDetails}</Box>}
        {attendanceCounts != {} && <Box sx={{ my: 5, py: 1 }}>{AttendanceDetails}</Box>}
        {currentStudentExams[0] && <Box sx={{ my: 5, py: 1 }}>{ExamDetails}</Box>}
        {studentData?.remarks[0] && <Box sx={{ my: 5, py: 1 }}>{RemarkDetails}</Box>}
        {studentData?.course_completed[0] && <Box sx={{ my: 5, py: 1 }}>{CourseDetails}</Box>}
      </Card>
    </>
  );
}

StudentDetails.propTypes = {
  studentData: PropTypes.object,
};
