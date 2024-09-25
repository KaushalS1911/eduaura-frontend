import React, { useState, useCallback } from 'react';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import Container from '@mui/material/Container';
import TableBody from '@mui/material/TableBody';
import { alpha, useTheme } from '@mui/material/styles';
import { Box, Button, CircularProgress, Stack, TableContainer, Tooltip } from '@mui/material';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';
import { isAfter, isBetween } from 'src/utils/format-time';
import { INVOICE_SERVICE_OPTIONS } from 'src/_mock';

import Label from 'src/components/label';
import Iconify from 'src/components/iconify';
import Scrollbar from 'src/components/scrollbar';
import { useSnackbar } from 'src/components/snackbar';
import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
import { useGetAllAttendance } from 'src/api/attendance';
import { RouterLink } from 'src/routes/components';
import {
  useTable,
  emptyRows,
  TableNoData,
  getComparator,
  TableEmptyRows,
  TableHeadCustom,
  TablePaginationCustom,
} from 'src/components/table';

import AttendanceTableRow from '../attendance-table-row';
import AttendanceTableToolbar from '../attendance-table-toolbar';
import AttendanceTableFiltersResult from '../attendance-table-filters-result';
import { LoadingScreen } from '../../../components/loading-screen';
import { useAuthContext } from '../../../auth/hooks';
import { useGetConfigs } from '../../../api/config';
import { getResponsibilityValue } from '../../../permission/permission';
import { PDFDownloadLink } from '@react-pdf/renderer';
import AttendanceRegisterPDF from '../attendance-register-pdf';
import { useGetStudents } from '../../../api/student';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import OutlinedInput from '@mui/material/OutlinedInput';
import MenuItem from '@mui/material/MenuItem';
import Checkbox from '@mui/material/Checkbox';
import FormControl from '@mui/material/FormControl';
import { useGetBatches } from '../../../api/batch';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

const TABLE_HEAD = [
  { id: 'srNo', label: '#', align: 'center' },
  { id: 'name', label: 'Name' },
  { id: 'enroll_no', label: 'Enroll No' },
  { id: 'email', label: 'Email' },
  { id: 'course', label: 'Course' },
  { id: 'status', label: 'Status' },
  { id: '', label: '' },
];

const defaultFilters = {
  name: '',
  service: [],
  status: 'all',
  startDate: null,
  endDate: null,
  date: new Date(),
  startDay: null,
  endDay: null,
};

export default function AttendanceListView() {
  const { enqueueSnackbar } = useSnackbar();
  const { students } = useGetStudents();
  const { configs } = useGetConfigs();
  const { batch } = useGetBatches();
  const { user } = useAuthContext();
  const theme = useTheme();
  const [field, setField] = useState([]);
  const { attendance, attendanceLoading, mutate } = useGetAllAttendance();
  const settings = useSettingsContext();
  const router = useRouter();
  const table = useTable({ defaultOrderBy: 'createDate' });
  const [tableData, setTableData] = useState(attendance);
  const [filters, setFilters] = useState(defaultFilters);
  const dateError = isAfter(filters.startDate, filters.endDate);
  const dayError = isAfter(filters.startDay, filters.endDay);

  const [monthYear, setMonthYear] = useState({
    month: new Date().getMonth() + 1, // current month (1-12)
    year: new Date().getFullYear(),    // current year
  });

  const dataFiltered = applyFilter({
    inputData: attendance,
    comparator: getComparator(table.order, table.orderBy),
    filters,
    dateError,
    dayError,
  });

  const dataInPage = dataFiltered.slice(
    table.page * table.rowsPerPage,
    table.page * table.rowsPerPage + table.rowsPerPage,
  );

  const denseHeight = table.dense ? 56 : 56 + 20;

  const canReset =
    !!filters.name ||
    !!filters.service.length ||
    filters.status !== 'all' ||
    (!!filters.startDate && !!filters.endDate) || (!!filters.startDay && !!filters.endDay);

  const notFound = (!dataFiltered.length && canReset) || !dataFiltered.length;

  const getInvoiceLength = (status) => attendance.filter((item) => item.status === status).length;

  const TABS = [
    { value: 'all', label: 'All', color: 'default', count: attendance.length },
    {
      value: 'present',
      label: 'Present',
      color: 'success',
      count: getInvoiceLength('present'),
    },
    {
      value: 'late',
      label: 'Late',
      color: 'warning',
      count: getInvoiceLength('late'),
    },
    {
      value: 'absent',
      label: 'Absent',
      color: 'error',
      count: getInvoiceLength('absent'),
    },
  ];

  const handleFilters = useCallback(
    (name, value) => {
      table.onResetPage();
      setFilters((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    },
    [table],
  );

  const handleResetFilters = useCallback(() => {
    setFilters(defaultFilters);
  }, []);

  const handleDeleteRow = useCallback(
    (id) => {
      const deleteRow = tableData.filter((row) => row.id !== id);
      enqueueSnackbar('Delete success!');
      setTableData(deleteRow);
      table.onUpdatePageDeleteRow(dataInPage.length);
    },
    [dataInPage.length, enqueueSnackbar, table, tableData],
  );

  const handleEditRow = useCallback(
    (id) => {
      router.push(paths.dashboard.invoice.edit(id));
    },
    [router],
  );

  const handleViewRow = useCallback(
    (id) => {
      router.push(paths.dashboard.invoice.details(id));
    },
    [router],
  );

  const handleFilterStatus = useCallback(
    (event, newValue) => {
      handleFilters('status', newValue);
    },
    [handleFilters],
  );

  const handleFilterField1 = (event) => {
    const { value } = event.target;
    if (value.length > 2) {
      enqueueSnackbar('You can only select up to 3 options!', { variant: 'error' });
      return;
    }
    setField(value);
  };

  const getStudentsByBatch = () => {
    if (!Array.isArray(batch)) {
      console.error('batch is not an array or is undefined');
      return [];
    }
    let allbatch;
    if (Array.isArray(field) && field.length > 0) {
      allbatch = batch.filter((data) => field.includes(data?.batch_name));
    }
    const allBatchMembers = field && allbatch
      ? allbatch.reduce((acc, curr) => acc.concat(curr.batch_members || []), [])
      : batch.reduce((acc, curr) => acc.concat(curr.batch_members || []), []);
    return allBatchMembers;
  };

  const handleReset = () => {
    setField([]);
    setMonthYear({
      month: new Date().getMonth() + 1, // Reset to current month
      year: new Date().getFullYear(),    // Reset to current year
    });
  };

  const handleMonthYearChange = (newValue) => {
    if (newValue) {
      setMonthYear({
        month: newValue.getMonth() + 1,
        year: newValue.getFullYear(),
      });
    }
  };

  const getAttendanceForMonth = (students, attendanceRecords, selectedMonth, selectedYear) => {
    const currentMonthAttendance = students.map((student) => {
      const studentAttendance = attendanceRecords.filter((record) => {
        const attendanceDate = new Date(record.date);
        return (
          record.student_id._id === student._id &&
          attendanceDate.getMonth() === selectedMonth - 1 &&
          attendanceDate.getFullYear() === selectedYear
        );
      });

      return {
        student,
        attendance: studentAttendance,
      };
    });

    return currentMonthAttendance;
  };

  const currentMonthAttendanceData = getAttendanceForMonth(
    getStudentsByBatch(),
    attendance,
    monthYear.month,
    monthYear.year,
  );

  return (
    <>
      {attendanceLoading ? <LoadingScreen /> : <Container maxWidth={settings.themeStretch ? false : 'lg'}>
        <CustomBreadcrumbs
          heading='Attendance logs'
          links={[
            {
              name: 'Dashboard',
              href: paths.dashboard.root,
            },
            {
              name: 'Attendance',
            },
          ]}
          action={
            <div>
              <DatePicker
                label='Select Month'
                views={['year', 'month']}
                value={monthYear.month ? new Date(monthYear.year, monthYear.month - 1) : null}
                onChange={handleMonthYearChange}
                renderInput={(params) => (
                  <OutlinedInput {...params} sx={{ width: { xs: '100%', md: 200 }, ml: 2 }} />
                )}
              />

              <FormControl
                sx={{
                  flexShrink: 0,
                  width: { xs: '100%', md: 200 },
                  margin: '0px 10px',
                }}
              >
                <InputLabel>Select Batch</InputLabel>
                <Select
                  multiple
                  value={field}
                  onChange={handleFilterField1}
                  input={<OutlinedInput label='Select Batch' />}
                  renderValue={(selected) => selected.join(', ')}
                  MenuProps={{
                    PaperProps: {
                      sx: { maxHeight: 240 },
                    },
                  }}
                >
                  {batch.map((option) => (
                    <MenuItem key={option.batch_name} value={option.batch_name}>
                      <Checkbox
                        disableRipple
                        size='small'
                        checked={field?.includes(option.batch_name)}
                      />
                      {option.batch_name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              {getResponsibilityValue('create_attendance', configs, user) && <Button
                component={RouterLink}
                href={paths.dashboard.attendance.new}
                variant='contained'
                startIcon={<Iconify icon='mingcute:add-line' />}
              >
                Add Attendance
              </Button>
              }</div>
          }
          sx={{
            mb: { xs: 3, md: 5 },
          }}
        />
        <Card>
          <Tabs
            value={filters.status}
            onChange={handleFilterStatus}
            sx={{
              px: 2.5,
              boxShadow: `inset 0 -2px 0 0 ${alpha(theme.palette.grey[500], 0.08)}`,
            }}
          >
            {TABS.map((tab) => (
              <Tab
                key={tab.value}
                value={tab.value}
                label={tab.label}
                iconPosition='end'
                icon={
                  <Label
                    variant={((tab.value === 'all' || tab.value === filters.status) && 'filled') || 'soft'}
                    color={tab.color}
                  >
                    {tab.count}
                  </Label>
                }
              />
            ))}
            <Box display='flex' justifyContent='flex-end' alignItems='center' width='100%'>
              {getResponsibilityValue('print_attendance_detail', configs, user) && (
                <Stack direction='row' spacing={1} mx={1}>
                  <PDFDownloadLink
                    document={
                      <AttendanceRegisterPDF
                        configs={configs}
                        students={getStudentsByBatch()}
                        attendance={currentMonthAttendanceData}
                        field={field}
                        monthYear={monthYear}
                      />
                    }
                  >
                    {({ loading }) => (
                      <Tooltip title='Export to PDF'>
                        {loading ? (
                          <CircularProgress size={24} />
                        ) : (
                          <Iconify
                            icon='eva:cloud-download-fill'
                            sx={{ width: 30, height: 30, color: '#637381', mt: 1 }}
                            onClick={handleReset}
                          />
                        )}
                      </Tooltip>
                    )}
                  </PDFDownloadLink>
                </Stack>
              )}
            </Box>
          </Tabs>

          <AttendanceTableToolbar
            filters={filters}
            onFilters={handleFilters}
            dateError={dateError}
            serviceOptions={INVOICE_SERVICE_OPTIONS.map((option) => option.name)}
          />

          {canReset && (
            <AttendanceTableFiltersResult
              filters={filters}
              onFilters={handleFilters}
              onResetFilters={handleResetFilters}
              results={dataFiltered.length}
              sx={{ p: 2.5, pt: 0 }}
            />
          )}

          <TableContainer sx={{ position: 'relative', overflow: 'unset' }}>
            <Scrollbar>
              <Table size={table.dense ? 'small' : 'medium'} sx={{ minWidth: 800 }}>
                <TableHeadCustom
                  order={table.order}
                  orderBy={table.orderBy}
                  headLabel={TABLE_HEAD}
                  rowCount={dataFiltered.length}
                  numSelected={table.selected.length}
                  onSort={table.onSort}
                />
                <TableBody>
                  {dataFiltered
                    ?.slice(
                      table.page * table.rowsPerPage,
                      table.page * table.rowsPerPage + table.rowsPerPage,
                    )
                    .map((row, index) => (
                      <AttendanceTableRow
                        key={row.id}
                        row={{ ...row, index }}
                        selected={table.selected.includes(row.id)}
                        onSelectRow={() => table.onSelectRow(row.id)}
                        onViewRow={() => handleViewRow(row.id)}
                        onEditRow={() => handleEditRow(row.id)}
                        onDeleteRow={() => handleDeleteRow(row.id)}
                        mutate={mutate}
                      />
                    ))}
                  <TableEmptyRows
                    height={denseHeight}
                    emptyRows={emptyRows(table.page, table.rowsPerPage, dataFiltered.length)}
                  />
                  <TableNoData notFound={notFound} />
                </TableBody>
              </Table>
            </Scrollbar>
          </TableContainer>

          <TablePaginationCustom
            count={dataFiltered.length}
            page={table.page}
            rowsPerPage={table.rowsPerPage}
            onPageChange={table.onChangePage}
            onRowsPerPageChange={table.onChangeRowsPerPage}
            dense={table.dense}
            onChangeDense={table.onChangeDense}
          />
        </Card>
      </Container>}

    </>
  );
}

// ----------------------------------------------------------------------

function applyFilter(
  {
    inputData, comparator, filters, dateError, dayError,
  },
) {
  const { name, status, service, startDate, endDate, startDay, endDay } = filters;

  const stabilizedThis = inputData.map((el, index) => [el, index]);

  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });

  inputData = stabilizedThis.map((el) => el[0]);
  if (!dayError) {
    if (startDay && endDay) {
      inputData = inputData.filter((product) => isBetween(product.date, startDay, endDay));
    }
  }
  if (name) {
    inputData = inputData.filter(
      (invoice) =>
        invoice.student_id.firstName.toLowerCase().indexOf(name.toLowerCase()) !== -1 ||
        invoice.student_id.lastName.toLowerCase().indexOf(name.toLowerCase()) !== -1 ||
        invoice.student_id.email.toLowerCase().indexOf(name.toLowerCase()) !== -1,
    );
  }

  if (status !== 'all') {
    inputData = inputData.filter((invoice) => invoice.status === status);
  }

  if (service.length) {
    inputData = inputData.filter((invoice) =>
      invoice.items.some((filterItem) => service.includes(filterItem.service)),
    );
  }

  if (!dateError) {
    if (startDate && endDate) {
      inputData = inputData.filter((invoice) => isBetween(invoice.date, startDate, endDate));
    }
  }

  return inputData;
}
