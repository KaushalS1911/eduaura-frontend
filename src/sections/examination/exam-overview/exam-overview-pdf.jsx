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

const ExamOverviewPDF = ({
  examData,
  calculatePercentage,
  calculateResult,
  calculateGrade,
  passFailCount,
  gradeSummary,
  configs,
  rankedStudents,
  calculateAveragePercentage,
}) => {
  const styles = useStyles();

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
              {configs?.company_details?.logo ? (
                <Image
                  source={configs?.company_details?.logo}
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
        <View>
          <View>
            <Text style={{ fontSize: '15px', fontWeight: '700', margin: '30px 0px 0px 0px' }}>
              Exam Details
            </Text>
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
              <View style={{ width: '280px' }}>
                <Text style={{ fontSize: '10px', fontWeight: '600' }}>Name</Text>
              </View>
              <View style={{ width: '150px', textAlign: 'center' }}>
                <Text style={{ fontSize: '10px', fontWeight: '600' }}>Total</Text>
              </View>
              <View style={{ width: '150px', textAlign: 'center' }}>
                <Text style={{ fontSize: '10px', fontWeight: '600' }}>{examData?.title}</Text>
              </View>
              <View style={{ width: '150px', textAlign: 'center' }}>
                <Text style={{ fontSize: '10px', fontWeight: '600' }}>Percentage </Text>
              </View>
              <View style={{ width: '150px', textAlign: 'center' }}>
                <Text style={{ fontSize: '10px', fontWeight: '600' }}>Result</Text>
              </View>
              <View style={{ width: '150px', textAlign: 'center' }}>
                <Text style={{ fontSize: '10px', fontWeight: '600' }}>Rank</Text>
              </View>
              <View style={{ width: '150px', textAlign: 'center' }}>
                <Text style={{ fontSize: '10px', fontWeight: '600' }}>Grade</Text>
              </View>
            </View>
            <View>
              {rankedStudents?.map((row, index) => (
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

                  <View style={{ width: '280px' }}>
                    <Text style={{}}>
                      {row?.student_id?.firstName + ' ' + row?.student_id?.lastName}
                    </Text>
                  </View>

                  <View style={{ width: '150px', textAlign: 'center' }}>
                    <Text>{examData?.total_marks}</Text>
                  </View>

                  <View style={{ width: '150px', textAlign: 'center' }}>
                    <Text>{row?.obtained_marks}</Text>
                  </View>

                  <View style={{ width: '150px', textAlign: 'center' }}>
                    <Text> {calculatePercentage(row?.obtained_marks, examData?.total_marks)}%</Text>
                  </View>

                  <View style={{ width: '150px', textAlign: 'center' }}>
                    <Text>{calculateResult(row?.obtained_marks, examData?.total_marks)}</Text>
                  </View>
                  <View style={{ width: '150px', textAlign: 'center' }}>
                    <Text>{row?.rank}</Text>
                  </View>
                  <View style={{ width: '150px', textAlign: 'center' }}>
                    <Text>
                      {calculateGrade(
                        calculatePercentage(row?.obtained_marks, examData?.total_marks)
                      )}
                    </Text>
                  </View>
                </View>
              ))}
            </View>
          </View>
        </View>
        <View>
          <View>
            <Text style={{ fontSize: '15px', fontWeight: '700', margin: '30px 0px 0px 0px' }}>
              Result Summary
            </Text>
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
              <View style={{ width: '80px', padding: '0px 5px' }}>
                <Text style={{ fontSize: '10px', fontWeight: '600' }}>Metric</Text>
              </View>
              <View style={{ width: '500px', textAlign: 'center' }}>
                <Text style={{ fontSize: '10px', fontWeight: '600' }}>{examData?.title}</Text>
              </View>
            </View>
            <View>
              <View
                style={{
                  padding: '6px 0px',
                }}
              >
                <View style={{ flexDirection: 'row', padding: '5px 5px' }}>
                  <Text style={{ fontSize: '10px', width: '80px' }}>Pass</Text>
                  <Text style={{ fontSize: '10px', width: '500px', textAlign: 'center' }}>
                    {passFailCount.pass}
                  </Text>
                </View>
                <View style={{ flexDirection: 'row', padding: '5px 5px' }}>
                  <Text style={{ fontSize: '10px', width: '80px' }}>Fail</Text>
                  <Text style={{ fontSize: '10px', width: '500px', textAlign: 'center' }}>
                    {passFailCount.fail}
                  </Text>
                </View>
                <View style={{ flexDirection: 'row', padding: '5px 5px' }}>
                  <Text style={{ fontSize: '10px', width: '80px' }}>Percentage(%)</Text>
                  <Text style={{ fontSize: '10px', width: '500px', textAlign: 'center' }}>
                    {calculateAveragePercentage(examData?.students)}%
                  </Text>
                </View>

                <View style={{ width: '280px' }}>
                  <Text style={{}}></Text>
                </View>
              </View>
            </View>
          </View>
        </View>
        <View style={{ marginTop: '30px' }}>
          <View>
            <Text style={{ fontSize: 15, fontWeight: '700' }}>Grade Summary</Text>
          </View>
          <View style={{ marginTop: '8px' }}>
            <View
              style={{
                flexDirection: 'row',
                borderTopWidth: 2,
                borderBottomWidth: 2,
                borderColor: '#E6E6E6',
                paddingVertical: 8,
              }}
            >
              <Text style={{ width: 80, textAlign: 'left', fontSize: '10px', fontWeight: '600' }}>
                Grade
              </Text>
              {Object.entries(gradeSummary).map(([grade, count]) => (
                <Text key={grade} style={{ width: 80, textAlign: 'center', fontSize: '10px' }}>
                  {grade}
                </Text>
              ))}
            </View>
            <View
              style={{ flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 8 }}
            >
              <Text style={{ width: 80, textAlign: 'left', fontSize: '10px', fontWeight: '600' }}>
                Count
              </Text>
              {Object.entries(gradeSummary).map(([grade, count]) => (
                <Text
                  key={grade}
                  style={{ width: 80, textAlign: 'center', fontSize: '10px', fontWeight: '500' }}
                >
                  {count}
                </Text>
              ))}
            </View>
          </View>
        </View>
      </Page>
    </Document>
  );
};

ExamOverviewPDF.propTypes = {};

export default ExamOverviewPDF;
