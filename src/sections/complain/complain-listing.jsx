import * as Yup from 'yup';
import PropTypes from 'prop-types';
import { useMemo, useEffect, useState } from 'react';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm, Controller } from 'react-hook-form';

import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Grid from '@mui/material/Unstable_Grid2';
import CardHeader from '@mui/material/CardHeader';
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

import { useRouter } from 'src/routes/hooks';

import { useResponsive } from 'src/hooks/use-responsive';

import { useSnackbar } from 'src/components/snackbar';
import FormProvider, { RHFTextField } from 'src/components/hook-form';
import { Table, TableBody, TableCell, TableRow } from '@mui/material';
import { TableHeadCustom } from 'src/components/table';
import Label from 'src/components/label';
import { useGetStudents } from 'src/api/student';
import axios from 'axios';
import moment from 'moment';

// ----------------------------------------------------------------------

export default function ComplainListing() {
  const student = useGetStudents();
  const [tableData, setTableData] = useState();

  const TABLE_HEAD = [
    { id: 'date', label: 'Date' },
    { id: 'title', label: 'Title', align: 'right' },
    { id: 'status', label: 'Status', align: 'right' },
  ];

  const TABLE_DATA = [
    { date: '22/2/2222', title: 'Ac is Not working properly', status: 'pending' },
    { date: '22/2/2222', title: 'Ac is Not working properly', status: 'completed' },
    { date: '22/2/2222', title: 'Ac is Not working properly', status: 'pending' },
    { date: '22/2/2222', title: 'Ac is Not working properly', status: 'completed' },
    { date: '22/2/2222', title: 'Ac is Not working properly', status: 'pending' },
    { date: '22/2/2222', title: 'Ac is Not working properly', status: 'completed' },
    { date: '22/2/2222', title: 'Ac is Not working properly', status: 'pending' },
    { date: '22/2/2222', title: 'Ac is Not working properly', status: 'completed' },
    { date: '22/2/2222', title: 'Ac is Not working properly', status: 'pending' },
  ];
  // complain get api

  useEffect(() => {
    axios
      .get('https://admin-panel-dmawv.ondigitalocean.app/api/v2/66710d4da24c98a090efd336/complain')
      .then((res) => setTableData(res?.data?.data))
      .catch((err) => console.log(err));
  }, []);

  return (
    <Grid container spacing={3}>
      <Table>
        <TableHeadCustom headLabel={TABLE_HEAD} />
        <TableBody>
          {tableData?.map((row, _) => (
            <TableRow key={_}>
              <TableCell> {moment(row.date).format('DD/MM/YYYY')}</TableCell>
              <TableCell align="right">{row.title}</TableCell>
              <TableCell align="right">
                <Label
                  variant="soft"
                  color={
                    (row.status === 'completed' && 'success') ||
                    (row.status === 'pending' && 'warning') ||
                    'default'
                  }
                >
                  {row.status}
                </Label>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Grid>
  );
}

ComplainListing.propTypes = {
  currentJob: PropTypes.object,
};
