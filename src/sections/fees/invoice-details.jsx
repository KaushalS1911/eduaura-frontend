import PropTypes from 'prop-types';
import { useState, useCallback } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import Stack from '@mui/material/Stack';
import Divider from '@mui/material/Divider';
import { styled } from '@mui/material/styles';
import TableRow from '@mui/material/TableRow';
import TableHead from '@mui/material/TableHead';
import TableCell from '@mui/material/TableCell';
import TableBody from '@mui/material/TableBody';
import Grid from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';
import TableContainer from '@mui/material/TableContainer';

import { fDate } from 'src/utils/format-time';
import { fCurrency } from 'src/utils/format-number';

import { INVOICE_STATUS_OPTIONS } from 'src/_mock';

import Label from 'src/components/label';
import Scrollbar from 'src/components/scrollbar';
import InvoiceToolbar from './invoice-toolbar';
import { useParams } from 'react-router';
import Logo from 'src/components/logo';
import { useGetConfigs } from 'src/api/config';

// ----------------------------------------------------------------------

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '& td': {
    textAlign: 'right',
    borderBottom: 'none',
    paddingTop: theme.spacing(1),
    paddingBottom: theme.spacing(1),
  },
}));

// ----------------------------------------------------------------------

export default function InvoiceDetails({ invoice }) {
  const params = useParams();
  const [currentStatus, setCurrentStatus] = useState(invoice?.status || '');
  const config = useGetConfigs();

  const invoiceDetails = invoice?.fee_detail?.installments.find(
    (e) => e._id === params.installmentID
  );

  const invoiceNumber = invoice?.fee_detail?.installments
    ?.map((e, index) => {
      if (e._id === params.installmentID) {
        return index + 1;
      }
      return '';
    })
    .filter((num) => num !== '');

  const handleChangeStatus = useCallback((event) => {
    setCurrentStatus(event.target.value);
  }, []);

  const formatEnrollmentNo = (number) => {
    const paddedNumber = number?.toString().padStart(4, '0');
    const installmentNumber = invoiceNumber?.toString().padStart(2, '0');
    return `${paddedNumber}${installmentNumber}  `;
  };

  const renderTotal = (
    <>
      <Typography
        sx={{
          marginTop: '130px',
        }}
      ></Typography>
      <StyledTableRow>
        <TableCell colSpan={3} />
        <TableCell sx={{ color: 'text.secondary' }}>
          <Box sx={{ mt: 2 }} />
          Subtotal
        </TableCell>
        <TableCell width={120} sx={{ typography: 'subtitle2' }}>
          <Box sx={{ mt: 2 }} />
          {fCurrency(invoiceDetails?.amount)}
        </TableCell>
      </StyledTableRow>

      <StyledTableRow>
        <TableCell colSpan={3} />
        <TableCell sx={{ color: 'text.secondary' }}>Discount</TableCell>
        <TableCell width={120} sx={{ color: 'error.main', typography: 'body2' }}>
          0
        </TableCell>
      </StyledTableRow>

      <StyledTableRow>
        <TableCell colSpan={3} />
        <TableCell sx={{ color: 'text.secondary' }}>Taxes</TableCell>
        <TableCell width={120}>0</TableCell>
      </StyledTableRow>

      <StyledTableRow>
        <TableCell colSpan={3} />
        <TableCell sx={{ typography: 'subtitle1' }}>Total</TableCell>
        <TableCell width={140} sx={{ typography: 'subtitle1' }}>
          {fCurrency(invoiceDetails?.amount)}
        </TableCell>
      </StyledTableRow>
    </>
  );

  const renderFooter = (
    <Grid container>
      <Grid xs={12} md={9} sx={{ py: 3 }}>
        <Typography variant="subtitle2">NOTES</Typography>

        <Typography variant="body2">Fees Are Not Refundable</Typography>
      </Grid>

      <Grid xs={12} md={3} sx={{ py: 3, textAlign: 'right' }}>
        <Typography variant="subtitle2">Have a Question?</Typography>

        <Typography variant="body2">{config?.configs?.company_details?.email}</Typography>
      </Grid>
    </Grid>
  );

  const renderList = (
    <TableContainer sx={{ overflow: 'unset', mt: 5 }}>
      <Scrollbar>
        <Table sx={{ minWidth: 960 }}>
          <TableHead>
            <TableRow>
              <TableCell width={40}>#</TableCell>

              <TableCell sx={{ typography: 'subtitle2' }}>Course</TableCell>

              <TableCell align="right" width={1050}>
                Payment Mode
              </TableCell>
              <TableCell align="right">Amount</TableCell>

              <TableCell align="right">Total</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {[''].map((row, index) => (
              <TableRow key={index}>
                <TableCell>{index + 1}</TableCell>

                <TableCell>
                  <Box sx={{ maxWidth: 560 }}>
                    <Typography variant="subtitle2">{invoice?.course}</Typography>
                  </Box>
                </TableCell>

                <TableCell align="right">{invoiceDetails?.payment_mode}</TableCell>

                <TableCell align="right">{fCurrency(invoiceDetails?.amount)}</TableCell>

                <TableCell align="right">{fCurrency(invoiceDetails?.amount)}</TableCell>
              </TableRow>
            ))}
            {renderTotal}
          </TableBody>
        </Table>
      </Scrollbar>
    </TableContainer>
  );

  return (
    <>
      <InvoiceToolbar
        invoice={invoice}
        currentStatus={currentStatus || ''}
        onChangeStatus={handleChangeStatus}
        statusOptions={INVOICE_STATUS_OPTIONS}
        invoiceDetails={invoiceDetails}
        config={config}
      />

      <Card sx={{ pt: 0, px: 5 }}>
        <Box
          rowGap={5}
          display="grid"
          alignItems="center"
          gridTemplateColumns={{
            xs: 'repeat(1, 1fr)',
            sm: 'repeat(2, 1fr)',
          }}
        >
          <Box>
            <Logo />
          </Box>
          <Stack spacing={1} alignItems={{ xs: 'flex-start', md: 'flex-end' }}>
            <Label
              variant="soft"
              color={
                (invoiceDetails?.status === 'paid' && 'success') ||
                (invoiceDetails?.status === 'pending' && 'warning') ||
                (invoiceDetails?.status === 'unpaid' && 'error') ||
                'default'
              }
            >
              {invoiceDetails?.status}
            </Label>

            <Typography variant="h6">JBS-{formatEnrollmentNo(invoice?.enrollment_no)}</Typography>
          </Stack>

          <Stack sx={{ typography: 'body2' }}>
            <Typography variant="subtitle2" sx={{ mb: 1 }}>
              Invoice From
            </Typography>
            {config?.configs?.company_details?.name}
            <br />
            {config?.configs?.company_details?.address_1 +
              ' ' +
              config?.configs?.company_details?.city +
              ' ' +
              config?.configs?.company_details?.state +
              ' ' +
              config?.configs?.company_details?.country}
            <br />
            Phone : {config?.configs?.company_details?.contact}
            <br />
          </Stack>

          <Stack sx={{ typography: 'body2' }}>
            <Typography variant="subtitle2" sx={{ mb: 1 }}>
              Invoice To
            </Typography>
            {invoice?.firstName} {invoice?.lastName}
            <br />
            {invoice?.address_detail?.address_1} {invoice?.address_detail?.address_2}{' '}
            {invoice?.address_detail?.city} {invoice?.address_detail?.state}{' '}
            {invoice?.address_detail?.country}
            <br />
            Phone: {invoice?.contact}
            <br />
          </Stack>

          <Stack sx={{ typography: 'body2' }}>
            <Typography variant="subtitle2" sx={{ mb: 1 }}>
              Payment Create
            </Typography>
            {fDate(invoiceDetails?.payment_date)}
          </Stack>

          <Stack sx={{ typography: 'body2' }}>
            <Typography variant="subtitle2" sx={{ mb: 1 }}>
              Due Date
            </Typography>
            {fDate(invoiceDetails?.installment_date)}
          </Stack>
        </Box>

        {renderList}

        <Divider sx={{ mt: 5, borderStyle: 'dashed' }} />

        {renderFooter}
      </Card>
    </>
  );
}

InvoiceDetails.propTypes = {
  invoice: PropTypes.object,
};
