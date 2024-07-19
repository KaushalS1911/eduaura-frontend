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
          // height: '20px',
        },
        tr1: {
          borderStyle: 'solid',
          borderWidth: 1,
          borderColor: '#000',
        },
        tr2: {
          flexDirection: 'row',
          // height: '20px',
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
    []
  );

const BatchRegisterPDF = ({ student, data, configs }) => {
  const styles = useStyles();

  return (
    <Document>
      <Page orientation="landscape" style={styles.page}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <View>
            {' '}
            <View style={{ fontSize: 25, fontWeight: 800 }}>
              <Text>{configs?.company_details?.name}</Text>
            </View>
            <View style={styles.section}>
              <Text style={{ fontSize: 11 }}>
                {`${configs?.company_details?.address_1}, ${configs?.company_details?.city}, ${configs?.company_details?.state}, ${configs?.company_details?.country} - ${configs?.company_details?.zipcode}.`}
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

        <View style={[styles.flex]}>
          <View style={[styles.table, styles.t1Width]}>
            <View style={[styles.tr1, { height: '70px', padding: 5 }]}>
              <Text
                style={{ display: 'block', fontSize: '12px', fontWeight: 'bold', marginBottom: 3 }}
              >
                Medium :
              </Text>
              <View style={{ flexDirection: 'row' }}>
                <Text style={{ fontSize: 12, fontWeight: 'bold', width: 100 }}>Standard :</Text>
                <Text style={{ fontSize: 12, fontWeight: 'bold', marginRight: 20 }}>
                  Division :
                </Text>
              </View>
              <View style={{ flexDirection: 'row', marginVertical: 3 }}>
                <Text style={{ fontSize: 12, fontWeight: 'bold', width: 100 }}>Month :</Text>
                <Text style={{ fontSize: 12, fontWeight: 'bold', marginRight: 20 }}>Year :</Text>
              </View>
            </View>
            <View style={[styles.tr]}>
              <Text
                style={[styles.td, { width: 60, fontSize: 9, fontWeight: 'bold', paddingTop: 2 }]}
              >
                {' '}
                No
              </Text>
              <Text
                style={[styles.td, { width: 100, fontSize: 9, fontWeight: 'bold', paddingTop: 2 }]}
              >
                G.R No
              </Text>
              <Text
                style={[
                  styles.td,
                  {
                    width: '100%',
                    fontSize: 9,
                    fontWeight: 'bold',
                    borderRight: '1px solid white',
                    paddingTop: 2,
                  },
                ]}
              >
                Student Name
              </Text>
            </View>
            {student?.map((data, index) => (
              <View style={[styles.tr]}>
                <Text style={[styles.td, { width: 60, paddingTop: 2 }]}>{index + 1}</Text>
                <Text style={[styles.td, { width: 100, paddingTop: 2 }]}>
                  {data?.enrollment_no}
                </Text>
                <Text
                  style={[
                    styles.td,
                    { width: '100%', borderRight: '1px solid white', paddingTop: 2 },
                  ]}
                >{`${data?.firstName} ${data?.lastName}`}</Text>
              </View>
            ))}
            {/*<View style={[styles.tr]}>*/}
            {/*  <Text style={[styles.td, { width: 60 }]}><Text style={{ opacity: '0' }}>1</Text></Text>*/}
            {/*  <Text style={[styles.td, { width: 100 }]}><Text style={{ opacity: '0' }}>1123</Text></Text>*/}
            {/*  <Text style={[styles.td, { width: '100%', borderRight: '1px solid white' }]}><Text*/}
            {/*    style={{ opacity: '0' }}>Heet Timbadiya</Text></Text>*/}
            {/*</View>*/}
            {/*<View style={[styles.tr]}>*/}
            {/*  <Text style={[styles.td, { width: 60 }]}><Text style={{ opacity: '0' }}>1</Text></Text>*/}
            {/*  <Text style={[styles.td, { width: 100 }]}><Text style={{ opacity: '0' }}>1123</Text></Text>*/}
            {/*  <Text style={[styles.td, { width: '100%', borderRight: '1px solid white' }]}><Text*/}
            {/*    style={{ opacity: '0' }}>Heet Timbadiya</Text></Text>*/}
            {/*</View>*/}
            {/*<View style={[styles.tr2]}>*/}
            {/*  <Text style={[{ width: 60 }]}></Text>*/}
            {/*  <Text style={[{ width: 100 }]}></Text>*/}
            {/*  <Text style={[styles.td, {*/}
            {/*    width: '100%',*/}
            {/*    border: '1px solid black',*/}
            {/*    borderTop: '1px solid white',*/}
            {/*    fontSize: 11,*/}
            {/*    fontWeight: 'bold',*/}
            {/*    paddingTop: 4.5,*/}
            {/*  }]}>Presents on Last Day</Text>*/}
            {/*</View>*/}
            {/*<View style={[styles.tr2]}>*/}
            {/*  <Text style={[{ width: 60 }]}></Text>*/}
            {/*  <Text style={[{ width: 100 }]}></Text>*/}
            {/*  <Text style={[styles.td, {*/}
            {/*    width: '100%',*/}
            {/*    border: '1px solid black',*/}
            {/*    borderTop: '1px solid white',*/}
            {/*    fontSize: 11,*/}
            {/*    fontWeight: 'bold',*/}
            {/*    paddingTop: 4.5,*/}
            {/*  }]}>No. of new students</Text>*/}
            {/*</View>*/}
            {/*<View style={[styles.tr2]}>*/}
            {/*  <Text style={[{ width: 60 }]}></Text>*/}
            {/*  <Text style={[{ width: 100 }]}></Text>*/}
            {/*  <Text style={[styles.td, {*/}
            {/*    width: '100%',*/}
            {/*    border: '1px solid black',*/}
            {/*    borderTop: '1px solid white',*/}
            {/*    fontSize: 11,*/}
            {/*    fontWeight: 'bold',*/}
            {/*    paddingTop: 4.5,*/}
            {/*  }]}>No. of students left</Text>*/}
            {/*</View>*/}
            {/*<View style={[styles.tr2]}>*/}
            {/*  <Text style={[{ width: 60 }]}></Text>*/}
            {/*  <Text style={[{ width: 100 }]}></Text>*/}
            {/*  <Text style={[styles.td, {*/}
            {/*    width: '100%',*/}
            {/*    border: '1px solid black',*/}
            {/*    borderTop: '1px solid white',*/}
            {/*    fontSize: 11,*/}
            {/*    fontWeight: 'bold',*/}
            {/*    paddingTop: 4.5,*/}
            {/*  }]}>Presents in class</Text>*/}
            {/*</View>*/}
            {/*<View style={[styles.tr2]}>*/}
            {/*  <Text style={[{ width: 60 }]}></Text>*/}
            {/*  <Text style={[{ width: 100 }]}></Text>*/}
            {/*  <Text style={[styles.td, {*/}
            {/*    width: '100%',*/}
            {/*    border: '1px solid black',*/}
            {/*    borderTop: '1px solid white',*/}
            {/*    fontSize: 11,*/}
            {/*    fontWeight: 'bold',*/}
            {/*    paddingTop: 4.5,*/}
            {/*  }]}>No. of absence(A+L+I)</Text>*/}
            {/*</View>*/}
            {/*<View style={[styles.tr2]}>*/}
            {/*  <Text style={[{ width: 60 }]}></Text>*/}
            {/*  <Text style={[{ width: 100 }]}></Text>*/}
            {/*  <Text style={[styles.td, {*/}
            {/*    width: '100%',*/}
            {/*    border: '1px solid black',*/}
            {/*    borderTop: '1px solid white',*/}
            {/*    fontSize: 11,*/}
            {/*    fontWeight: 'bold',*/}
            {/*    paddingTop: 4.5,*/}
            {/*  }]}>Presents</Text>*/}
            {/*</View>*/}
          </View>
          <View style={[styles.table, styles.t2Width]}>
            <View
              style={[
                styles.tr,
                {
                  height: '70px',
                  borderTop: '1px solid black',
                  marginTop: '0px',
                  borderLeft: '1px solid white',
                  borderRight: '1px solid white',
                },
              ]}
            >
              {Array(31)
                .fill(null)
                .map((_, index) => (
                  <Text style={[styles.td, { width: 43, fontWeight: '700', paddingTop: 30 }]}>
                    {index + 1}
                  </Text>
                ))}
            </View>
            {Array(student.length + 1)
              .fill(null)
              .map((_, index) => (
                <View
                  style={[
                    styles.tr,
                    { borderLeft: '1px solid white', borderRight: '1px solid white' },
                  ]}
                >
                  {Array(31)
                    .fill(null)
                    .map((_, index) => (
                      <Text style={[styles.td, { width: 43, paddingTop: 2 }]}>
                        <Text style={{ opacity: '0' }}>{index + 1}</Text>
                      </Text>
                    ))}
                </View>
              ))}
          </View>
          <View style={[styles.table, styles.t3Width]}>
            <View
              style={[
                styles.tr,
                {
                  height: '70px',
                  borderTop: '1px solid black',
                  marginTop: '0px',
                  borderLeft: '1px solid white',
                  borderRight: '1px solid white',
                },
              ]}
            >
              <Text
                style={[
                  styles.td,
                  { width: '45px', paddingTop: '30px', fontSize: 9, fontWeight: '700' },
                ]}
              >
                <Text>PD</Text>
              </Text>
              <Text
                style={[
                  styles.td,
                  { width: '45px', paddingTop: '30px', fontSize: 9, fontWeight: '700' },
                ]}
              >
                <Text>AD</Text>
              </Text>
              <Text
                style={[
                  styles.td,
                  { width: '45px', paddingTop: '30px', fontSize: 9, fontWeight: '700' },
                ]}
              >
                <Text>TD</Text>
              </Text>
              <Text
                style={[
                  styles.td,
                  {
                    width: '45px',
                    paddingTop: '30px',
                    position: 'relative',
                    fontSize: 9,
                    fontWeight: '700',
                  },
                ]}
              >
                HL
              </Text>
            </View>
            {Array(student.length + 1)
              .fill(null)
              .map((_, index) => (
                <View
                  style={[
                    styles.tr,
                    { borderLeft: '1px solid white', borderRight: '1px solid white' },
                  ]}
                >
                  {/*<Text style={[styles.td, { width: '49px' }]}><Text style={{ opacity: '0' }}>{index + 1}</Text></Text>*/}
                  <Text style={[styles.td, { width: '45px', paddingTop: 2 }]}>
                    <Text style={{ opacity: '0' }}>{index + 1}</Text>
                  </Text>
                  <Text style={[styles.td, { width: '45px', paddingTop: 2 }]}>
                    <Text style={{ opacity: '0' }}>{index + 1}</Text>
                  </Text>
                  <Text style={[styles.td, { width: '45px', paddingTop: 2 }]}>
                    <Text style={{ opacity: '0' }}>{index + 1}</Text>
                  </Text>
                  <Text style={[styles.td, { width: '45px', paddingTop: 2 }]}>
                    <Text style={{ opacity: '0' }}>{index + 1}</Text>
                  </Text>
                </View>
              ))}
          </View>
        </View>
      </Page>
    </Document>
  );
};

BatchRegisterPDF.propTypes = {
  student: PropTypes.array,
  data: PropTypes.array,
};

export default BatchRegisterPDF;
