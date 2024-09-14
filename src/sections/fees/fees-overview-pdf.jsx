import { useMemo } from 'react';
import PropTypes from 'prop-types';
import { Page, View, Font, Document, Text, StyleSheet, Image } from '@react-pdf/renderer';
import logo from '../../assets/logo/jbs.png';
import { fDate } from '../../utils/format-time';

Font.register({
  family: 'Roboto',
  fonts: [
    { src: '/fonts/Roboto-Regular.ttf' },
    { src: '/fonts/Roboto-Bold.ttf' },
  ],
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
        h3: { fontSize: 16, fontWeight: '700' },
        h4: { fontSize: 13, fontWeight: '700' },
        h5: { fontSize: 10, fontWeight: '700' },
        body1: { fontSize: 10 },
        body2: { fontSize: 9 },
        subtitle1: { fontSize: 10, fontWeight: '700' },
        subtitle2: { fontSize: 9, fontWeight: '700' },
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
    [],
  );

const formatAddress = (address) => {
  if (!address) return '-';
  const { address_1, address_2, city, state, country, address_line1, address_line2 } = address;
  return `${address_1 || address_line1 || ''}, ${address_2 || address_line2 || ''}, ${city || ''}, ${state || ''}, ${country || ''}`;
};

const PdfFeesPdf = ({ orientation, feeData, configs }) => {
  const styles = useStyles();
  const ListingDetails = (
    <View>
      <Text style={{ fontSize: '15px', fontWeight: '700', margin: '10px 0px 0px 0px' }}>
        Fee Details
      </Text>
      <View style={{ margin: '8px 0px' }}>
        <View style={{
          flexDirection: 'row',
          borderTop: '2px solid #E6E6E6',
          borderBottom: '2px solid #E6E6E6',
          padding: '8px 0px',
        }}>
          <View style={{ width: '14.28%', textAlign: 'center' }}>
            <Text style={{ fontSize: '8px', fontWeight: '600' }}>Name</Text>
          </View>
          <View style={{ width: '14.28%', textAlign: 'center' }}>
            <Text style={{ fontSize: '8px', fontWeight: '600' }}>Installment Date</Text>
          </View>
          <View style={{ width: '14.28%', textAlign: 'center' }}>
            <Text style={{ fontSize: '8px', fontWeight: '600' }}>Installment Amount</Text>
          </View>
          <View style={{ width: '14.28%', textAlign: 'center' }}>
            <Text style={{ fontSize: '8px', fontWeight: '600' }}>Status</Text>
          </View>
          <View style={{ width: '14.28%', textAlign: 'center' }}>
            <Text style={{ fontSize: '8px', fontWeight: '600' }}>Amount Paid</Text>
          </View>
          <View style={{ width: '14.28%', textAlign: 'center' }}>
            <Text style={{ fontSize: '8px', fontWeight: '600' }}>Discount</Text>
          </View>
          <View style={{ width: '14.28%', textAlign: 'center' }}>
            <Text style={{ fontSize: '8px', fontWeight: '600' }}>Total Amount</Text>
          </View>
        </View>
        <View>
          {feeData?.map((installment, index) =>
            installment.fee_detail.installments.map((item) => (
              <View key={index} style={{ flexDirection: 'row', padding: '6px 0px' }}>
                <View style={{ width: '14.28%', textAlign: 'center' }}>
                  <Text style={{ fontSize: '8px' }}>
                    {installment.firstName + ' ' + installment.lastName}
                  </Text>
                </View>
                <View style={{ width: '14.28%', textAlign: 'center' }}>
                  <Text style={{ fontSize: '8px' }}>
                    {new Date(item.installment_date).toLocaleDateString()}
                  </Text>
                </View>
                <View style={{ width: '14.28%', textAlign: 'center' }}>
                  <Text style={{ fontSize: '8px' }}>
                    {item.amount}
                  </Text>
                </View>
                <View style={{ width: '14.28%', textAlign: 'center' }}>
                  <Text style={{ fontSize: '8px' }}>
                    {item.status}
                  </Text>
                </View>
                <View style={{ width: '14.28%', textAlign: 'center' }}>
                  <Text style={{ fontSize: '8px' }}>
                    {installment.fee_detail.amount_paid || 'N/A'}
                  </Text>
                </View>
                <View style={{ width: '14.28%', textAlign: 'center' }}>
                  <Text style={{ fontSize: '8px' }}>
                    {installment.fee_detail.discount}
                  </Text>
                </View>
                <View style={{ width: '14.28%', textAlign: 'center' }}>
                  <Text style={{ fontSize: '8px' }}>
                    {installment.fee_detail.total_amount || 'N/A'}
                  </Text>
                </View>
              </View>
            ))
          )}
        </View>

      </View>
    </View>
  );

  return (
    <Document>
      <Page size='A4' orientation={orientation} style={styles.page}>
        <View style={{ padding: '10px', backgroundColor: '#F6F6F6' }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
            <Image source={configs?.company_details?.logo || logo}
                   style={{ width: 60, height: 60, borderRadius: '5px' }} />
            <View style={{ flex: 1, textAlign: 'center' }}>
              <Text style={{ fontWeight: '700', fontSize: '18px' }}>{configs?.company_details?.name}</Text>
              <Text style={{ fontWeight: '400', fontSize: '8px' }}>{configs?.company_details?.address_1}</Text>
            </View>
          </View>
        </View>
        <View style={{ margin: '5px 0px' }}>{ListingDetails}</View>
      </Page>
    </Document>
  );
};

PdfFeesPdf.propTypes = {
  orientation: PropTypes.string.isRequired,
  feeData: PropTypes.arrayOf(
    PropTypes.shape({
      installment_date: PropTypes.string.isRequired,
      amount: PropTypes.number.isRequired,
      status: PropTypes.string.isRequired,
    }),
  ).isRequired,
  configs: PropTypes.object.isRequired,
};

export default PdfFeesPdf;
