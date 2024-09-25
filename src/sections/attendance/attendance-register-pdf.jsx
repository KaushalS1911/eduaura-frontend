import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { Page, View, Text, Font, Document, StyleSheet } from '@react-pdf/renderer';

Font.register({
  family: 'Roboto',
  fonts: [{ src: '/fonts/Roboto-Regular.ttf' }, { src: '/fonts/Roboto-Bold.ttf' }],
});

const useStyles = () =>
  useMemo(
    () =>
      StyleSheet.create({
        page: {
          fontSize: 9,
          lineHeight: 1.6,
          fontFamily: 'Roboto',
          backgroundColor: '#FFFFFF',
          padding: '40px 24px 120px 24px',
        },
        table: {
          display: 'table',
          width: 'auto',
          borderCollapse: 'collapse',
        },
        flex: {
          flexDirection: 'row',
        },
        t1Width: {
          width: '300px',
        },
        t2Width: {
          width: '650px',
        },
        t3Width: {
          width: '160px',
        },
        th1Head: {
          marginRight: '30px',
        },
        tr: {
          borderStyle: 'solid',
          borderWidth: 1,
          borderColor: '#000',
          flexDirection: 'row',
          borderTop: '1px solid white',
          marginTop: '-2px',
        },
        tr1: {
          borderStyle: 'solid',
          borderWidth: 1,
          borderColor: '#000',
        },
        td: {
          borderRight: '1px solid black',
          textAlign: 'center',
          fontSize: 9,
        },
        rotate: {
          transform: 'rotate(260deg)',
        },
        tdb: {
          borderBottom: '1px solid black',
          textAlign: 'center',
        },
        th: {
          backgroundColor: '#f0f0f0',
          fontWeight: 'bold',
          textAlign: 'center',
        },
        cellCenter: {
          textAlign: 'center',
        },
      }),
    [],
  );

const AttendanceRegisterPDF = ({ students, attendance, configs, monthYear, field }) => {
  const styles = useStyles();

  const calculateAttendanceDays = (attendance, studentId, month, year) => {
    const presentDates = new Set();
    const absentDates = new Set();

    attendance?.forEach(att => {
      if (Array.isArray(att?.attendance)) {
        att.attendance.forEach(e => {
          const attendanceDate = new Date(e?.date);
          const isSameMonth = attendanceDate.getMonth() === month - 1;
          const isSameYear = attendanceDate.getFullYear() === year;

          if (e?.student_id?._id === studentId && isSameMonth && isSameYear) {
            if (e?.status === 'present') {
              presentDates.add(attendanceDate.toISOString().split('T')[0]);
            } else if (e?.status === 'absent') {
              absentDates.add(attendanceDate.toISOString().split('T')[0]);
            }
          }
        });
      }
    });

    return {
      presentDays: presentDates.size,
      absentDays: absentDates.size,
    };
  };

  return (
    <Document>
      <Page size='A4' orientation='landscape' style={styles.page}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <View>
            <View style={{ fontSize: 25, fontWeight: 800 }}>
              <Text>{configs?.company_details?.name}</Text>
            </View>
            <View style={styles.section}>
              <Text style={{ fontSize: 11 }}>
                {`${configs?.company_details?.address_1 || 'No Address'}, ${configs?.company_details?.city || 'No City'}, ${configs?.company_details?.state || 'No State'}, ${configs?.company_details?.country || 'No Country'} - ${configs?.company_details?.zipcode || 'No Zipcode'}`}
              </Text>
            </View>
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'end', paddingTop: '20px' }}>
            <View style={{ marginRight: 20 }}>
              <Text style={{ fontSize: 10 }}>PD : Present Day</Text>
              <Text style={{ fontSize: 10 }}>AD : Absent Day</Text>
            </View>
            <View>
              <Text style={{ fontSize: 10 }}>TD : Total Day</Text>
              <Text style={{ fontSize: 10 }}>HL : Holiday</Text>
            </View>
          </View>
        </View>

        <View style={[styles.flex, { margin: '10px 0px' }]}>
          <View style={[styles.table, styles.t1Width]}>
            <View style={[styles.tr1, { height: '70px', padding: 5 }]}>
              <Text style={{
                fontSize: '12px',
                fontWeight: 'bold',
              }}>
                Batch: {field && field.length > 0 ? field.join(', ') : 'All Batch'}
              </Text>
              <View style={{ flexDirection: 'row', marginVertical: 3 }}>
                <Text style={{ fontSize: 12, fontWeight: 'bold', width: 100 }}>Month: {monthYear?.month}</Text>
                <Text style={{ fontSize: 12, fontWeight: 'bold', marginRight: 20 }}>Year: {monthYear?.year}</Text>
              </View>
            </View>

            <View style={[styles.tr]}>
              <Text style={[styles.td, { width: 60, fontWeight: 'bold', paddingTop: 2 }]}>No</Text>
              <Text style={[styles.td, { width: 100, fontWeight: 'bold', paddingTop: 2 }]}>G.R No</Text>
              <Text style={[styles.td, {
                width: '100%',
                fontWeight: 'bold',
                borderRight: '1px solid white',
                paddingTop: 2,
              }]}>
                Student Name
              </Text>
            </View>

            {students.map((student, index) => (
              <View key={student.enrollment_no} style={[styles.tr]}>
                <Text style={[styles.td, { width: 60, paddingTop: 2 }]}>{index + 1}</Text>
                <Text style={[styles.td, { width: 100, paddingTop: 2 }]}>{student.enrollment_no}</Text>
                <Text style={[styles.td, { width: '100%', borderRight: '1px solid white', paddingTop: 2 }]}>
                  {`${student.firstName} ${student.lastName}`}
                </Text>
              </View>
            ))}
          </View>

          <View style={[styles.table, styles.t2Width]}>
            <View style={[styles.tr, { height: '70px', borderTop: '1px solid black', marginTop: '0px' }]}>
              {Array(31)
                .fill(null)
                .map((_, index) => (
                  <Text key={index} style={[styles.td, { width: 43, fontWeight: '700', paddingTop: 30 }]}>
                    {index + 1}
                  </Text>
                ))}
            </View>

            <View style={[styles.tr, { height: 18.5 }]}>
              <Text style={[styles.td, { width: '100%', paddingTop: 2 }]}> </Text>
            </View>

            {students?.map((student) => (
              <View key={student?.enrollment_no} style={[styles.tr]}>
                {Array(31)
                  .fill(null)
                  .map((_, dayIndex) => {
                    const dayAttendance = attendance?.find(
                      (att) => att?.attendance?.find(
                        (item) =>
                          item?.student_id?._id === student?._id &&
                          new Date(item?.date)?.getDate() === dayIndex + 1,
                      ),
                    );
                    const specificDayAttendance = dayAttendance?.attendance?.find(
                      (item) =>
                        item?.student_id?._id === student?._id &&
                        new Date(item?.date)?.getDate() === dayIndex + 1,
                    );
                    return (
                      <Text
                        key={dayIndex}
                        style={[styles.td, {
                          width: 43,
                          paddingTop: 2,
                          backgroundColor: specificDayAttendance
                            ? (specificDayAttendance.status === 'absent' ? 'lightcoral' : // Light red for absent
                              specificDayAttendance.status === 'late' ? '#FFA500' : // Light orange for late
                                specificDayAttendance.status === 'present' ? 'lightgreen' :
                                  'transparent')
                            : 'transparent',
                        }]}
                      >
                        {specificDayAttendance ? (
                          specificDayAttendance.status === 'absent' ? 'A' :
                            specificDayAttendance.status === 'present' ? 'P' :
                              specificDayAttendance.status === 'late' ? 'L' :
                                '-'
                        ) : '-'}
                      </Text>
                    );
                  })}
              </View>
            ))}
          </View>

          <View style={[styles.table, styles.t3Width]}>
            <View style={[styles.tr, { height: '70px', borderTop: '1px solid black', marginTop: '0px' }]}>
              <Text style={[styles.td, { width: '45px', paddingTop: 30, fontWeight: '700' }]}>PD</Text>
              <Text style={[styles.td, { width: '45px', paddingTop: 30, fontWeight: '700' }]}>AD</Text>
              <Text style={[styles.td, { width: '45px', paddingTop: 30, fontWeight: '700' }]}>TD</Text>
              <Text style={[styles.td, { width: '45px', paddingTop: 30, fontWeight: '700' }]}>HL</Text>
            </View>

            <View style={[styles.tr, { height: 18.5 }]}>
              <Text style={[styles.td, { width: '100%' }]}> </Text>
            </View>

            {students?.map((student) => {
              const {
                presentDays,
                absentDays,
              } = calculateAttendanceDays(attendance, student._id, monthYear.month, monthYear.year);
              const totalDays = presentDays + absentDays;
              const daysInMonth = new Date(monthYear?.year, monthYear?.month, 0).getDate();
              const holidays = daysInMonth - totalDays;

              return (
                <View key={student.enrollment_no} style={[styles.tr]}>
                  <Text style={[styles.td, { width: '45px', paddingTop: 2 }]}>{presentDays}</Text>
                  <Text style={[styles.td, { width: '45px', paddingTop: 2 }]}>{absentDays}</Text>
                  <Text style={[styles.td, { width: '45px', paddingTop: 2 }]}>{totalDays}</Text>
                  <Text style={[styles.td, { width: '45px', paddingTop: 2 }]}>{holidays}</Text>
                </View>
              );
            })}
          </View>
        </View>
      </Page>
    </Document>
  );
};

AttendanceRegisterPDF.propTypes = {
  students: PropTypes.array.isRequired,
  attendance: PropTypes.array.isRequired,
  configs: PropTypes.object.isRequired,
  monthYear: PropTypes.shape({
    month: PropTypes.number.isRequired,
    year: PropTypes.number.isRequired,
  }).isRequired,
};

export default AttendanceRegisterPDF;
