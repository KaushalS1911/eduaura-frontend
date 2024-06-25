import React, { useState, useEffect } from 'react';
import moment from 'moment';
import { useTheme } from '@mui/material/styles';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';

import { useSettingsContext } from 'src/components/settings';
import AccountSalesOverview from '../account-sales-overview';
import AccountWidgetSummary from '../account-widget-summary';
import AccountCurrentDownload from '../account-current-download';
import AccountNewInvoice from '../account-new-invoice';

import { useGetAccount, useGetAccountOverDue } from 'src/api/account';
import { BookingIllustration } from 'src/assets/illustrations';
import { _appInvoices } from 'src/_mock';

const SPACING = 3;

export default function AccountView() {
  const theme = useTheme();
  const settings = useSettingsContext();

  const today = moment().format('YYYY-MM-DD');
  const [startDate, setStartDate] = useState(today);
  const [endDate, setEndDate] = useState(today);

  const { Account } = useGetAccount(startDate, endDate);
  const { overdue } = useGetAccountOverDue();

  useEffect(() => {
    setStartDate(today);
    setEndDate(today);
  }, [today]);

  const totalExpenses = Account?.expenses?.totalExpense ?? 0;
  const _ecommerceSalesOverview = ['Total Income', 'Total Expenses'].map((label, index) => {
    const totalAmount = Account?.expenses?.totalExpense ?? 0;
    const totalAmount1 = Account?.feesInfo?.feesReceived?.totalAmount ?? 0;
    const value = totalAmount && totalExpenses ? (totalAmount / totalExpenses) * 100 : 0;
    const value1 = totalAmount1 && totalExpenses ? (totalAmount1 / totalExpenses) * 100 : 0;

    return {
      label,
      totalAmount,
      value,
      totalAmount1,
      value1,
    };
  });

  const chartData =
    Account?.expenses?.expensesByType.map((expense) => ({
      label: expense.type,
      value: expense.totalAmount,
    })) ?? [];

  const data = [
    {
      title: 'Expenses Overview',
      chart: {
        series: chartData,
      },
    },
  ];

  return (
    <Container maxWidth={settings.themeStretch ? false : 'xl'}>
      <Grid container spacing={SPACING} disableGutters>
        <Grid item xs={12} md={8} lg={8}>
          <AccountSalesOverview title="Account Overview" data={_ecommerceSalesOverview} />
        </Grid>
        <Grid item xs={12} md={4}>
          <AccountWidgetSummary title="Today's Income" total={10000} icon={<BookingIllustration />} />
        </Grid>
        {data.map((item, index) => (
          <Grid key={index} item xs={12} md={6} lg={4}>
            <AccountCurrentDownload title={item.title} chart={item.chart} />
          </Grid>
        ))}
        <Grid item xs={12} lg={8}>
          <AccountNewInvoice
            title="Overdue payments"
            tableData={overdue}
            tableLabels={[
              { id: 'id', label: '#', align:"center" },
              { id: 'category', label: 'Name' },
              { id: 'price', label: 'Fee' },
              { id: 'status', label: 'Contact' },
              { id: '' },
            ]}
          />
        </Grid>
      </Grid>
    </Container>
  );
}
