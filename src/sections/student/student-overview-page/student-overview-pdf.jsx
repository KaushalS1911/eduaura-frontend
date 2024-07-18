import { useEffect, useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import { Page, View, Text, Font, Image, Document, StyleSheet } from '@react-pdf/renderer';
import { fDate } from 'src/utils/format-time';
import logo from '../../../assets/logo/jbs.png';
import user from '../../../assets/logo/user.png';

Font.register({
  family: 'Roboto',
  fonts: [{ src: '/fonts/Roboto-Regular.ttf' }, { src: '/fonts/Roboto-Bold.ttf' }],
});

const useStyles = () =>
  useMemo(
    () =>
      StyleSheet.create({
        col4: { width: '25%' },
        col8: { width: '75%' },
        col6: { width: '50%' },
        mb4: { marginBottom: 4 },
        mb8: { marginBottom: 8 },
        mb40: { marginBottom: 40 },
        h3: { fontSize: 16, fontWeight: 700 },
        h4: { fontSize: 13, fontWeight: 700 },
        h5: { fontSize: 10, fontWeight: 700 },
        body1: { fontSize: 10 },
        body2: { fontSize: 9 },
        subtitle1: { fontSize: 10, fontWeight: 700 },
        subtitle2: { fontSize: 9, fontWeight: 700 },
        alignRight: { textAlign: 'right' },
        page: {
          fontSize: 9,
          lineHeight: 1.6,
          fontFamily: 'Roboto',
          backgroundColor: '#FFFFFF',
          textTransform: 'capitalize',
          padding: '40px 24px 120px 24px',
        },
        footer: {
          left: 0,
          right: 0,
          bottom: 0,
          padding: 24,
          margin: 'auto',
          borderTopWidth: 1,
          borderStyle: 'solid',
          position: 'absolute',
          borderColor: '#DFE3E8',
        },
        gridContainer: {
          flexDirection: 'row',
          justifyContent: 'space-between',
        },
        table: {
          display: 'flex',
          width: 'auto',
        },
        tableRow: {
          padding: '8px 0',
          flexDirection: 'row',
          borderBottomWidth: 1,
          borderStyle: 'solid',
          borderColor: '#DFE3E8',
        },
        noBorder: {
          paddingTop: 8,
          paddingBottom: 0,
          borderBottomWidth: 0,
        },
        tableCell_1: {
          width: '5%',
        },
        tableCell_2: {
          width: '50%',
          paddingRight: 16,
        },
        tableCell_3: {
          width: '15%',
        },
      }),
    []
  );

const StudentOverviewPDF = ({
  studentData,
  installmentsData,
  currentStudentExams,
  attendanceCounts,
  configs,
}) => {
  const styles = useStyles();

  const StudentDetails = (
    <>
      <View>
        <View>
          <Text style={{ fontSize: '15px', fontWeight: '700' }}>Personal Details</Text>
        </View>
        <View
          style={{
            margin: '8px 0px',
            flexDirection: 'row',
            justifyContent: 'space-between',
          }}
        >
          <View>
            <View>
              {studentData?.profile_pic
                ? (console.log('bapu done che '),
                  (
                    <Image
                      source={studentData?.profile_pic}
                      style={{
                        width: 120,
                        height: 140,
                        objectFit: 'cover',
                        borderRadius: '5px',
                      }}
                    />
                  ))
                : (console.log('bapu done nathi che '),
                  (
                    <Image
                      source={user}
                      style={{
                        width: 120,
                        height: 140,
                        objectFit: 'cover',
                        borderRadius: '5px',
                      }}
                    />
                  ))}
            </View>
          </View>
          <View>
            <View
              style={{
                marginBottom: '4px',
                flexDirection: 'row',
                alignItems: 'center',
              }}
            >
              <Text style={{ fontSize: '11px', fontWeight: '600' }}>Name :</Text>
              <Text style={{ fontSize: '10px', fontWeight: '400', margin: '0px 4px' }}>
                {studentData?.firstName + ' ' + studentData?.lastName}
              </Text>
            </View>
            <View
              style={{
                marginBottom: '4px',
                flexDirection: 'row',
                alignItems: 'center',
              }}
            >
              <Text style={{ fontSize: '11px', fontWeight: '600' }}>Course :</Text>
              <Text style={{ fontSize: '10px', fontWeight: '400', margin: '0px 4px' }}>
                {studentData?.course}
              </Text>
            </View>
            <View
              style={{
                marginBottom: '4px',
                flexDirection: 'row',
                alignItems: 'center',
              }}
            >
              <Text style={{ fontSize: '11px', fontWeight: '600' }}>En no :</Text>
              <Text style={{ fontSize: '10px', fontWeight: '400', margin: '0px 4px' }}>
                {studentData?.enrollment_no}
              </Text>
            </View>
            <View
              style={{
                marginBottom: '4px',
                flexDirection: 'row',
                alignItems: 'center',
              }}
            >
              <Text style={{ fontSize: '11px', fontWeight: '600' }}>Gender :</Text>
              <Text style={{ fontSize: '10px', fontWeight: '400', margin: '0px 4px' }}>
                {studentData?.gender}
              </Text>
            </View>
            <View
              style={{
                marginBottom: '4px',
                flexDirection: 'row',
                alignItems: 'center',
              }}
            >
              <Text style={{ fontSize: '11px', fontWeight: '600' }}>Contact :</Text>
              <Text style={{ fontSize: '10px', fontWeight: '400', margin: '0px 4px' }}>
                {studentData?.contact}
              </Text>
            </View>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'start',
              }}
            >
              <Text style={{ fontSize: '11px', fontWeight: '600' }}>Address :</Text>
              <Text
                style={{ fontSize: '10px', fontWeight: '400', margin: '0px 4px', width: '125px' }}
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
              </Text>
            </View>
          </View>
          <View style={{ marginRight: '20px' }}>
            <View
              style={{
                marginBottom: '4px',
                flexDirection: 'row',
                alignItems: 'center',
              }}
            >
              <Text style={{ fontSize: '11px', fontWeight: '600' }}>Email :</Text>
              <Text style={{ fontSize: '10px', fontWeight: '400', margin: '0px 4px' }}>
                {studentData?.email}
              </Text>
            </View>
            <View
              style={{
                marginBottom: '4px',
                flexDirection: 'row',
                alignItems: 'center',
              }}
            >
              <Text style={{ fontSize: '11px', fontWeight: '600' }}>Joining date :</Text>
              <Text style={{ fontSize: '10px', fontWeight: '400', margin: '0px 4px' }}>
                {fDate(studentData?.joining_date)}
              </Text>
            </View>
            <View
              style={{
                marginBottom: '4px',
                flexDirection: 'row',
                alignItems: 'center',
              }}
            >
              <Text style={{ fontSize: '11px', fontWeight: '600' }}>Blood group :</Text>
              <Text style={{ fontSize: '10px', fontWeight: '400', margin: '0px 4px' }}>
                {studentData?.blood_group}
              </Text>
            </View>
            <View
              style={{
                marginBottom: '4px',
                flexDirection: 'row',
                alignItems: 'center',
              }}
            >
              <Text style={{ fontSize: '11px', fontWeight: '600' }}>Date of birth :</Text>
              <Text style={{ fontSize: '10px', fontWeight: '400', margin: '0px 4px' }}>
                {fDate(studentData?.dob)}
              </Text>
            </View>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
              }}
            >
              <Text style={{ fontSize: '11px', fontWeight: '600' }}>Zipcode :</Text>
              <Text style={{ fontSize: '10px', fontWeight: '400', margin: '0px 4px' }}>
                {studentData?.address_detail?.zipcode}
              </Text>
            </View>
          </View>
        </View>
      </View>
    </>
  );

  const GuardianDetails = (
    <>
      <View>
        <View>
          <Text style={{ fontSize: '15px', fontWeight: '700' }}>Guardian Details</Text>
        </View>
        <View style={{ margin: '8px 0px' }}>
          <View
            style={{
              flexDirection: 'row',
              borderTop: '2px solid #E6E6E6',
              borderBottom: '2px solid #E6E6E6',
              padding: '8px 0px',
            }}
          >
            <View style={{ width: '80px', textAlign: 'center' }}>
              <Text style={{ fontSize: '10px', fontWeight: '600' }}>#</Text>
            </View>
            <View style={{ width: '280px', textAlign: 'center' }}>
              <Text style={{ fontSize: '10px', fontWeight: '600' }}>Name</Text>
            </View>
            <View style={{ width: '280px', textAlign: 'center' }}>
              <Text style={{ fontSize: '10px', fontWeight: '600' }}>Type</Text>
            </View>
            <View style={{ width: '280px', textAlign: 'center' }}>
              <Text style={{ fontSize: '10px', fontWeight: '600' }}>Contact</Text>
            </View>
          </View>
          <View>
            {studentData?.guardian_detail?.map((guardian, index) => (
              <View
                style={{
                  flexDirection: 'row',
                  padding: '6px 0px',
                }}
                key={guardian.id}
              >
                <View style={{ width: '80px', textAlign: 'center' }}>
                  <Text style={{ fontSize: '10px' }}>{index + 1}</Text>
                </View>

                <View style={{ width: '280px', textAlign: 'center' }}>
                  <Text style={{}}>{guardian.firstName + ' ' + guardian.lastName}</Text>
                </View>

                <View style={{ width: '280px', textAlign: 'center' }}>
                  <Text>{guardian.relation_type}</Text>
                </View>

                <View style={{ width: '280px', textAlign: 'center' }}>
                  <Text>{guardian.contact}</Text>
                </View>
              </View>
            ))}
          </View>
        </View>
      </View>
    </>
  );

  const FeesDetails = (
    <>
      <View>
        <View>
          <Text style={{ fontSize: '15px', fontWeight: '700' }}>Fee Details</Text>
        </View>
        <View style={{ margin: '8px 0px' }}>
          <View
            style={{
              flexDirection: 'row',
              borderTop: '2px solid #E6E6E6',
              borderBottom: '2px solid #E6E6E6',
              padding: '8px 0px',
            }}
          >
            <View style={{ width: '80px', textAlign: 'center' }}>
              <Text style={{ fontSize: '10px', fontWeight: '600' }}>#</Text>
            </View>
            <View style={{ width: '180px', textAlign: 'center' }}>
              <Text style={{ fontSize: '10px', fontWeight: '600' }}>Installment Date</Text>
            </View>
            <View style={{ width: '180px', textAlign: 'center' }}>
              <Text style={{ fontSize: '10px', fontWeight: '600' }}>Amount</Text>
            </View>
            <View style={{ width: '180px', textAlign: 'center' }}>
              <Text style={{ fontSize: '10px', fontWeight: '600' }}>Payment Date</Text>
            </View>
            <View style={{ width: '180px', textAlign: 'center' }}>
              <Text style={{ fontSize: '10px', fontWeight: '600' }}>Payment Mode</Text>
            </View>
            <View style={{ width: '180px', textAlign: 'center' }}>
              <Text style={{ fontSize: '10px', fontWeight: '600' }}>Status</Text>
            </View>
          </View>
          <View>
            {installmentsData?.map((row, index) => (
              <View
                style={{
                  flexDirection: 'row',
                  padding: '6px 0px',
                }}
                key={row.id}
              >
                <View style={{ width: '80px', textAlign: 'center' }}>
                  <Text style={{ fontSize: '10px' }}>{index + 1}</Text>
                </View>

                <View style={{ width: '180px', textAlign: 'center' }}>
                  <Text style={{}}>{fDate(row?.installment_date)}</Text>
                </View>

                <View style={{ width: '180px', textAlign: 'center' }}>
                  <Text>{row?.amount}</Text>
                </View>

                <View style={{ width: '180px', textAlign: 'center' }}>
                  <Text>{fDate(row?.payment_date)}</Text>
                </View>

                <View style={{ width: '180px', textAlign: 'center' }}>
                  <Text>{row?.payment_mode}</Text>
                </View>

                <View style={{ width: '180px', textAlign: 'center' }}>
                  <Text>{row?.status}</Text>
                </View>
              </View>
            ))}
          </View>
        </View>
      </View>
    </>
  );

  const AttendanceDetails = (
    <>
      <View>
        <View>
          <Text style={{ fontSize: '15px', fontWeight: '700' }}>Attendance Details</Text>
        </View>
        <View style={{ margin: '8px 0px' }}>
          <View
            style={{
              flexDirection: 'row',
              borderTop: '2px solid #E6E6E6',
              borderBottom: '2px solid #E6E6E6',
              padding: '8px 0px',
            }}
          >
            <View style={{ width: '380px', textAlign: 'center' }}>
              <Text style={{ fontSize: '10px', fontWeight: '600' }}>Total Days</Text>
            </View>
            <View style={{ width: '380px', textAlign: 'center' }}>
              <Text style={{ fontSize: '10px', fontWeight: '600' }}>Present</Text>
            </View>
            <View style={{ width: '380px', textAlign: 'center' }}>
              <Text style={{ fontSize: '10px', fontWeight: '600' }}>Absent</Text>
            </View>
          </View>
          <View>
            {['']?.map((row) => (
              <View
                style={{
                  flexDirection: 'row',
                  padding: '6px 0px',
                  borderBottom: '2px solid #E6E6E6',
                }}
                key={row.id}
              >
                <View style={{ width: '180px', textAlign: 'center' }}>
                  <Text style={{ fontSize: '15px', fontWeight: '600' }}>
                    {attendanceCounts?.total}
                  </Text>
                </View>
                <View style={{ width: '180px', textAlign: 'center' }}>
                  <Text style={{ fontSize: '15px', fontWeight: '600' }}>
                    {attendanceCounts?.present}
                  </Text>
                </View>
                <View style={{ width: '180px', textAlign: 'center' }}>
                  <Text style={{ fontSize: '15px', fontWeight: '600' }}>
                    {attendanceCounts?.absent}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        </View>
      </View>
    </>
  );

  const ExamDetails = (
    <>
      <View>
        <View>
          <Text style={{ fontSize: '15px', fontWeight: '700' }}>Exam Details</Text>
        </View>
        <View style={{ margin: '8px 0px' }}>
          <View
            style={{
              flexDirection: 'row',
              borderTop: '2px solid #E6E6E6',
              borderBottom: '2px solid #E6E6E6',
              padding: '8px 0px',
            }}
          >
            <View style={{ width: '80px', textAlign: 'center' }}>
              <Text style={{ fontSize: '10px', fontWeight: '600' }}>#</Text>
            </View>
            <View style={{ width: '220px', textAlign: 'center' }}>
              <Text style={{ fontSize: '10px', fontWeight: '600' }}> Name</Text>
            </View>
            <View style={{ width: '220px', textAlign: 'center' }}>
              <Text style={{ fontSize: '10px', fontWeight: '600' }}>Date</Text>
            </View>
            <View style={{ width: '220px', textAlign: 'center' }}>
              <Text style={{ fontSize: '10px', fontWeight: '600' }}>Total Marks</Text>
            </View>
            <View style={{ width: '220px', textAlign: 'center' }}>
              <Text style={{ fontSize: '10px', fontWeight: '600' }}>Mark</Text>
            </View>
          </View>
          <View>
            {currentStudentExams?.map((row, index) => (
              <View
                style={{
                  flexDirection: 'row',
                  padding: '6px 0px',
                }}
                key={row.id}
              >
                <View style={{ width: '80px', textAlign: 'center' }}>
                  <Text style={{ fontSize: '10px' }}>{index + 1}</Text>
                </View>
                <View style={{ width: '220px', textAlign: 'center' }}>
                  <Text>{row?.examTitle}</Text>
                </View>
                <View style={{ width: '220px', textAlign: 'center' }}>
                  <Text>{fDate(row?.examDate)}</Text>
                </View>
                <View style={{ width: '220px', textAlign: 'center' }}>
                  <Text>{row?.totalMarks}</Text>
                </View>
                <View style={{ width: '220px', textAlign: 'center' }}>
                  <Text>{row?.obtained_marks}</Text>
                </View>
              </View>
            ))}
          </View>
        </View>
      </View>
    </>
  );

  const RemarkDetails = (
    <>
      <View>
        <View>
          <Text style={{ fontSize: '15px', fontWeight: '700' }}>Remarks</Text>
        </View>
        <View style={{ margin: '8px 0px' }}>
          {studentData?.remarks?.map((e) => (
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Text style={{ fontWeight: '500', color: '#969696', fontSize: '10px' }}>
                {' '}
                {fDate(e.date)}
              </Text>
              <Text style={{ margin: '0px 6px' }}> -</Text>
              <Text style={{ fontSize: '10px' }}>{e.title}</Text>
            </View>
          ))}
        </View>
      </View>
    </>
  );

  const CourseDetails = (
    <>
      <View>
        <View>
          <Text style={{ fontSize: '15px', fontWeight: '700' }}>Course Details</Text>
        </View>
        <View style={{ margin: '8px 0px' }}>
          <View
            style={{
              flexDirection: 'row',
              borderTop: '2px solid #E6E6E6',
              borderBottom: '2px solid #E6E6E6',
              padding: '8px 0px',
            }}
          >
            <View style={{ width: '80px', textAlign: 'center' }}>
              <Text style={{ fontSize: '10px', fontWeight: '600' }}>#</Text>
            </View>
            <View style={{ width: '350px', textAlign: 'center' }}>
              <Text style={{ fontSize: '10px', fontWeight: '600' }}>Course Name</Text>
            </View>
            <View style={{ width: '350px', textAlign: 'center' }}>
              <Text style={{ fontSize: '10px', fontWeight: '600' }}>Date of Complete</Text>
            </View>
            <View style={{ width: '350px', textAlign: 'center' }}>
              <Text style={{ fontSize: '10px', fontWeight: '600' }}>Status</Text>
            </View>
          </View>
        </View>
        <View>
          {studentData?.course_completed?.map((row, index) => (
            <View
              style={{
                flexDirection: 'row',
                padding: '6px 0px',
              }}
              key={row?.id}
            >
              <View style={{ width: '80px', textAlign: 'center' }}>
                <Text style={{ fontSize: '10px' }}>{index + 1}</Text>
              </View>
              <View style={{ width: '350px', textAlign: 'center' }}>
                <Text>{row?.language?.label}</Text>
              </View>
              <View style={{ width: '350px', textAlign: 'center' }}>
                <Text>{fDate(row?.date)}</Text>
              </View>
              <View style={{ width: '350px', textAlign: 'center' }}>
                <Text>Completed</Text>
              </View>
            </View>
          ))}
        </View>
      </View>
    </>
  );

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={{ padding: '10px', backgroundColor: '#F6F6F6' }}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <View>
              {configs?.company_details?.logo_url ? (
                <Image
                  source={configs?.company_details?.logo_url}
                  style={{
                    width: 60,
                    height: 60,
                    borderRadius: '5px',
                  }}
                />
              ) : (
                <Image
                  source={logo}
                  style={{
                    width: 60,
                    height: 60,
                    borderRadius: '5px',
                  }}
                />
              )}
            </View>
            <View style={{ flex: 1, textAlign: 'center' }}>
              <Text style={{ textAlign: 'center', fontWeight: '700', fontSize: '18px' }}>
                {configs?.company_details?.name}
              </Text>
              <Text style={{ textAlign: 'center', fontWeight: '400', fontSize: '8px' }}>
                {configs?.company_details?.address_1}
              </Text>
            </View>
            <View></View>
          </View>
        </View>
        <View style={{ margin: '30px 0px 15px 0px' }}>{StudentDetails}</View>
        {studentData?.guardian_detail[0] && (
          <View style={{ margin: '5px 0px' }}>{GuardianDetails}</View>
        )}
        {installmentsData != [] && <View style={{ margin: '5px 0px' }}>{FeesDetails}</View>}
        {attendanceCounts != {} && <View style={{ margin: '5px 0px' }}>{AttendanceDetails}</View>}
        {currentStudentExams[0] && <View style={{ margin: '5px 0px' }}>{ExamDetails}</View>}
        {studentData?.remarks[0] && <View style={{ margin: '5px 0px' }}>{RemarkDetails}</View>}
        {studentData?.course_completed[0] && (
          <View style={{ margin: '5px 0px' }}>{CourseDetails}</View>
        )}
      </Page>
    </Document>
  );
};

StudentOverviewPDF.propTypes = {
  studentData: PropTypes.shape({
    profile_pic: PropTypes.string,
    firstName: PropTypes.string,
    lastName: PropTypes.string,
    course: PropTypes.string,
    enrollment_no: PropTypes.string,
    gender: PropTypes.string,
    contact: PropTypes.string,
    address_detail: PropTypes.shape({
      address_1: PropTypes.string,
      address_2: PropTypes.string,
      city: PropTypes.string,
      state: PropTypes.string,
      country: PropTypes.string,
      zipcode: PropTypes.string,
    }),
    email: PropTypes.string,
    joining_date: PropTypes.instanceOf(Date),
    blood_group: PropTypes.string,
    dob: PropTypes.instanceOf(Date),
    guardian_detail: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.number,
        name: PropTypes.string,
        relation: PropTypes.string,
        contact: PropTypes.string,
        address: PropTypes.string,
      })
    ),
  }).isRequired,
  installmentsData: PropTypes.array,
  currentStudentExams: PropTypes.array,
  attendanceCounts: PropTypes.object,
  configs: PropTypes.shape({
    company_details: PropTypes.shape({
      logo_url: PropTypes.string,
      name: PropTypes.string,
      address_1: PropTypes.string,
    }),
  }),
};

export default StudentOverviewPDF;
