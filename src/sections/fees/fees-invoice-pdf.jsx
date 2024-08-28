import { useEffect, useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import { Page, View, Text, Font, Image, Document, StyleSheet } from '@react-pdf/renderer';

import { fDate } from 'src/utils/format-time';
import { fCurrency } from 'src/utils/format-number';
import { useParams } from 'src/routes/hooks';
import defaultLogo from 'src/assets/logo/jbs.png';
import { useGetConfigs } from 'src/api/config';

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

const FeesInvoicePDF = ({ currentStatus, invoice, invoiceDetails, config }) => {
  const styles = useStyles();

  useEffect(() => {
    const fetchConfigs = async () => {
      const response = await useGetConfigs();
      setConfigs(response.configs);
    };

    fetchConfigs();
  }, []);

  const [company, setCompany] = useState({});

  const logo1 = company?.company_details?.logo ? `${company?.company_details?.logo}` : defaultLogo;

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={[styles.gridContainer, styles.mb40]}>
          <Image
            source={logo1}
            style={{
              width: 80,
              height: 80,
            }}
          />

          <View style={{ alignItems: 'flex-end', flexDirection: 'column', marginTop: '20px' }}>
            <Text style={styles.h3}>{invoiceDetails?.status}</Text>
            <Text>{'JBS-' + invoice?.enrollment_no}</Text>
          </View>
        </View>

        <View style={[styles.gridContainer, styles.mb40]}>
          <View style={[styles.gridContainer, styles.mb40]}>
            <View style={styles.col6}>
              <Text style={[styles.subtitle2, styles.mb4]}>Invoice from</Text>
              <Text style={styles.body2}>{config?.configs?.company_details?.name}</Text>
              <Text style={styles.body2}>
                {config?.configs?.company_details?.address_1 +
                  ' ' +
                  config?.configs?.company_details?.city +
                  ' ' +
                  config?.configs?.company_details?.state +
                  ' ' +
                  config?.configs?.company_details?.country}
              </Text>
              <Text style={styles.body2}>{config?.configs?.company_details?.contact}</Text>
            </View>

            <View style={styles.col6}>
              <Text style={[styles.subtitle2, styles.mb4]}>Invoice to</Text>
              <Text style={styles.body2}>{invoice?.firstName + ' ' + invoice?.lastName}</Text>
              <Text style={styles.body2}>
                {invoice?.address_detail?.address_1 + ' ' + invoice?.address_detail?.address_2}
              </Text>
              <Text style={styles.body2}>{invoice?.contact}</Text>
            </View>
          </View>
        </View>

        <View style={[styles.gridContainer, styles.mb40]}>
          <View style={styles.col6}>
            <Text style={[styles.subtitle2, styles.mb4]}>Date created</Text>
            <Text style={styles.body2}>{fDate(invoiceDetails?.payment_date)}</Text>
          </View>
          <View style={styles.col6}>
            <Text style={[styles.subtitle2, styles.mb4]}>Due date</Text>
            <Text style={styles.body1}>{fDate(invoiceDetails?.installment_date)}</Text>
          </View>
        </View>

        <Text style={[styles.subtitle1, styles.mb8]}>Invoice Details</Text>

        <View style={styles.table}>
          <View>
            <View style={styles.tableRow}>
              <View style={styles.tableCell_1}>
                <Text style={styles.subtitle2}>#</Text>
              </View>

              <View style={styles.tableCell_2}>
                <Text style={styles.subtitle2}>Course</Text>
              </View>

              <View style={[styles.tableCell_3, styles.alignRight]}>
                <Text style={[styles.subtitle2, styles.alignRight]}>Payment Mode</Text>
              </View>

              <View style={[styles.tableCell_3, styles.alignRight]}>
                <Text style={[styles.subtitle2, styles.alignRight]}>Amount</Text>
              </View>

              <View style={[styles.tableCell_3, styles.alignRight]}>
                <Text style={[styles.subtitle2, styles.alignRight]}>Total</Text>
              </View>
            </View>
          </View>

          <View>
            {[''].map((item, index) => (
              <View style={styles.tableRow} key={item.id}>
                <View style={styles.tableCell_1}>
                  <Text>{index + 1}</Text>
                </View>

                <View style={styles.tableCell_2}>
                  <Text style={styles.body2}>{invoice?.course}</Text>
                </View>

                <View style={[styles.tableCell_3, styles.alignRight]}>
                  <Text>{invoiceDetails?.payment_mode}</Text>
                </View>

                <View style={[styles.tableCell_3, styles.alignRight]}>
                  <Text>{fCurrency(invoiceDetails?.amount)}</Text>
                </View>

                <View style={[styles.tableCell_3, styles.alignRight]}>
                  <Text>{fCurrency(invoiceDetails?.amount)}</Text>
                </View>
              </View>
            ))}
            <View style={{ marginTop: '165px' }}>
              <View style={[styles.tableRow, styles.noBorder]}>
                <View style={styles.tableCell_1} />
                <View style={styles.tableCell_2} />
                <View style={styles.tableCell_3} />
                <View style={styles.tableCell_3}>
                  <Text style={styles.h5}>Discount</Text>
                </View>
                <View style={[styles.tableCell_3, styles.alignRight]}>
                  <Text style={styles.h5}>0</Text>
                </View>
              </View>

              <View style={[styles.tableRow, styles.noBorder]}>
                <View style={styles.tableCell_1} />
                <View style={styles.tableCell_2} />
                <View style={styles.tableCell_3} />
                <View style={styles.tableCell_3}>
                  <Text style={styles.h5}>Taxes</Text>
                </View>
                <View style={[styles.tableCell_3, styles.alignRight]}>
                  <Text style={styles.h5}>0</Text>
                </View>
              </View>

              <View style={[styles.tableRow, styles.noBorder]}>
                <View style={styles.tableCell_1} />
                <View style={styles.tableCell_2} />
                <View style={styles.tableCell_3} />
                <View style={styles.tableCell_3}>
                  <Text style={styles.h5}>Total</Text>
                </View>
                <View style={[styles.tableCell_3, styles.alignRight]}>
                  <Text style={styles.h5}>{fCurrency(invoiceDetails?.amount)}</Text>
                </View>
              </View>
            </View>
          </View>
        </View>

        <View style={[styles.gridContainer, styles.footer]} fixed>
          <View style={styles.col8}>
            <Text style={styles.subtitle2}>NOTES</Text>
            <Text style={styles.body2}>Fees Are Not Refundable</Text>
          </View>
          <View style={[styles.col4, styles.alignRight]}>
            <Text style={styles.subtitle2}>Have a Question?</Text>
            <Text style={styles.body2}>{config?.configs?.company_details?.email}</Text>
          </View>
        </View>
      </Page>
    </Document>
  );
};

FeesInvoicePDF.propTypes = {
  currentStatus: PropTypes.string,
  invoice: PropTypes.shape({
    items: PropTypes.array.isRequired,
    taxes: PropTypes.number.isRequired,
    dueDate: PropTypes.instanceOf(Date).isRequired,
    discount: PropTypes.number.isRequired,
    shipping: PropTypes.number.isRequired,
    invoiceTo: PropTypes.object.isRequired,
    createDate: PropTypes.instanceOf(Date).isRequired,
    totalAmount: PropTypes.number.isRequired,
    invoiceFrom: PropTypes.object.isRequired,
    invoiceNumber: PropTypes.string.isRequired,
    subTotal: PropTypes.number.isRequired,
  }).isRequired,
};

export default FeesInvoicePDF;
