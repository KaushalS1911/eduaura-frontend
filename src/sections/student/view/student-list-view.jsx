import isEqual from 'lodash/isEqual';
import React, { useCallback, useRef, useState } from 'react';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import { alpha } from '@mui/material/styles';
import Container from '@mui/material/Container';
import TableBody from '@mui/material/TableBody';
import IconButton from '@mui/material/IconButton';
import TableContainer from '@mui/material/TableContainer';
import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';
import { RouterLink } from 'src/routes/components';
import { useBoolean } from 'src/hooks/use-boolean';
import { _roles, USER_STATUS_OPTIONS } from 'src/_mock';
import Label from 'src/components/label';
import Iconify from 'src/components/iconify';
import Scrollbar from 'src/components/scrollbar';
import { useSnackbar } from 'src/components/snackbar';
import { PDFDownloadLink } from '@react-pdf/renderer';
import { ConfirmDialog } from 'src/components/custom-dialog';
import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
import {
  emptyRows,
  getComparator,
  TableEmptyRows,
  TableHeadCustom,
  TableNoData,
  TablePaginationCustom,
  TableSelectedAction,
  useTable,
} from 'src/components/table';
import StudentTableRow from '../student-table-row';
import StudentTableToolbar from '../student-table-toolbar';
import StudentTableFiltersResult from '../student-table-filters-result';
import { useGetStudents } from '../../../api/student';
import axios from 'axios';
import { LoadingScreen } from '../../../components/loading-screen';
import { fDate, isAfter, isBetween } from '../../../utils/format-time';
import { useAuthContext } from '../../../auth/hooks';
import { useGetBatches } from '../../../api/batch';
import Swal from 'sweetalert2';
import { Box, Stack } from '@mui/material';
import GenerateOverviewPDF from '../../generate-pdf/generate-overview-pdf';
import CircularProgress from '@mui/material/CircularProgress';
import { useGetConfigs } from '../../../api/config';
import * as XLSX from 'xlsx';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import OutlinedInput from '@mui/material/OutlinedInput';
import MenuItem from '@mui/material/MenuItem';
import Checkbox from '@mui/material/Checkbox';
import FormControl from '@mui/material/FormControl';

// ----------------------------------------------------------------------

const STATUS_OPTIONS = [{ value: 'all', label: 'All' }, {
  value: 'training',
  label: 'Training',
}, ...USER_STATUS_OPTIONS];

const TABLE_HEAD = [
  { id: 'enrollment_no', label: '#' },
  { id: 'name', label: 'Name' },
  { id: 'contact', label: 'Contact' },
  { id: 'course', label: 'Course' },
  { id: 'joining_date', label: 'Joining date' },
  { id: 'status', label: 'Status' },
  { id: '' },
];

const defaultFilters = {
  name: '',
  role: [],
  status: 'all',
  gender: [],
  startDate: null,
  endDate: null,
  batch: [],
  course: [],
};

// ----------------------------------------------------------------------

export default function StudentListView() {
  const { configs } = useGetConfigs();
  const { enqueueSnackbar } = useSnackbar();
  const table = useTable();
  const fileInputRef = useRef(null);
  const settings = useSettingsContext();
  const router = useRouter();
  const confirm = useBoolean();
  const { user } = useAuthContext();
  const { batch } = useGetBatches(`${user?.company_id}`);
  const { students, studentsLoading, mutate } = useGetStudents();
  const [field, setField] = useState([]);
  const [tableData, setTableData] = useState(students);
  const [filters, setFilters] = useState(defaultFilters);
  const dataFiltered = applyFilter({
    inputData: students,
    comparator: getComparator(table.order, table.orderBy),
    filters,
  });

  const dataInPage = dataFiltered.slice(
    table.page * table.rowsPerPage,
    table.page * table.rowsPerPage + table.rowsPerPage,
  );

  const denseHeight = table.dense ? 56 : 56 + 20;
  const canReset = !isEqual(defaultFilters, filters);
  const notFound = (!dataFiltered.length && canReset) || !dataFiltered.length;

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
    async (id) => {
      try {
        const response = await axios.delete(
          `https://admin-panel-dmawv.ondigitalocean.app/api/v2/student`,
          {
            data: { ids: ['66754ae906739d63f6b692ff'] },
          },
        );
        if (response.status === 200) {
          enqueueSnackbar(response.data.message, { variant: 'success' });
          confirm.onFalse();
          mutate();
        } else {
          enqueueSnackbar(response.data.message, { variant: 'error' });
        }
      } catch (error) {
        console.error('Failed to delete Employee', error);
        enqueueSnackbar('Failed to delete Employee', { variant: 'error' });
      }

      table.onUpdatePageDeleteRow(dataInPage.length);
    },
    [dataInPage.length, enqueueSnackbar, table, tableData],
  );

  const handleDeleteRows = useCallback(
    async (id) => {
      try {
        const selectedIdsArray = [...table.selected];
        const response = await axios.delete(
          `https://admin-panel-dmawv.ondigitalocean.app/api/v2/student`,
          {
            data: { ids: selectedIdsArray },
          },
        );
        enqueueSnackbar(response?.data?.message || 'Delete Success', { variant: 'success' });
        setTableData((prevData) => prevData.filter((row) => !selectedIdsArray.includes(row.id)));
        table.onUpdatePageDeleteRow(selectedIdsArray.length);
        confirm.onFalse();
        mutate();
      } catch (error) {
        console.error('Failed to delete Employee', error);
        enqueueSnackbar('Failed to delete Employee', { variant: 'error' });
      }
    },
    [dataFiltered.length, enqueueSnackbar, table, tableData],
  );

  const handleEditRow = useCallback(
    (id) => {
      router.push(paths.dashboard.student.edit(id));
    },
    [router],
  );

  const handleGuardianEditRow = useCallback(
    (id) => {
      router.push(paths.dashboard.student.guaridiandetails(id));
    },
    [router],
  );

  const handleFilterStatus = useCallback(
    (event, newValue) => {
      handleFilters('status', newValue);
    },
    [handleFilters],
  );
  const handleButtonClick = () => {
    fileInputRef.current.click();
  };
  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (file) {
      const formData = new FormData();
      formData.append('student-file', file);
      axios.post(`https://admin-panel-dmawv.ondigitalocean.app/api/v2/${user?.company_id}/student/bulk-import`, formData)
        .then((res) => {
          const { successCount, failureCount } = res.data.data;
          let alertText = '';
          let alertTitle = '';
          let alertIcon = '';

          if (failureCount == 0) {
            alertText = `${successCount} students added successfully.`;
            alertTitle = 'Success!';
            alertIcon = 'success';
          }
          if (successCount !== 0 && failureCount !== 0) {
            alertText = `${successCount} students added successfully. ${failureCount} failed.`;
            alertTitle = 'Warning!';
            alertIcon = 'warning';
          }
          if (successCount == 0) {
            alertText = `Errors occurred. ${failureCount} failed.`;
            alertTitle = 'Failed!';
            alertIcon = 'error';
          }

          Swal.fire({
            title: alertTitle,
            text: alertText,
            icon: alertIcon,
            didOpen: () => document.querySelector('.swal2-container').style.zIndex = '9999',
          });
        })
        .catch(() => {
          Swal.fire({
            title: 'Failed!',
            text: 'Bulk import failed.',
            icon: 'error',
            didOpen: () => document.querySelector('.swal2-container').style.zIndex = '9999',
          });
        });

      fileInputRef.current.value = '';
    }
  };
  const dateError = isAfter(filters.startDate, filters.endDate);

  const fieldMapping = {
    'Name': 'firstName',
    'ER No': 'enrollment_no',
    'Email': 'email',
    'Gender': 'gender',
    'DOB': 'dob',
    'Student No.': 'contact',
    'Education': 'education',
    'Collage-School': 'school_college',
    'Father No.': 'guardian_detail',
    'Course': 'course',
    'Joining Date': 'joining_date',
    'Address': 'address_detail',
    'Total Amount': 'fee_detail',
    'Amount paid': 'fee_detail',
    'Discount': 'fee_detail',
    'Status': 'status',
  };

  const guardianinfo = (guardianData, row) => {
    const fatherContact = row.guardian_detail
      .find(data => data.relation_type === 'Father')?.contact;
    const firstGuardianContact = row.guardian_detail[0]?.contact;
    return fatherContact || firstGuardianContact || '-';
  };

  const handleFilterField1 = (event) => {
    const { value } = event.target;
    if (value.length > 7) {
      enqueueSnackbar('You can only select up to 7 options!', { variant: 'error' });
      return;
    }
    setField(value);
  };

  const extractedData = field.reduce((result, key) => ({
    ...result,
    [key]: fieldMapping[key].split('.').reduce((o, i) => o[i]),
  }), {});

  const studentField = ['Name', 'Status', 'ER No', 'Email', 'Gender', 'DOB', 'Student No.', 'Education', 'Collage-School', 'Father No.', 'Course', 'Joining Date', 'Address', 'Total Amount', 'Amount paid', 'Discount'];
  const handleExportExcel = () => {
    let data = dataFiltered.map((student) => ({
      'ER No': student.enrollment_no,
      Status: student.status,
      Name: student.firstName + ' ' + student.lastName,
      Email: student.email,
      'Student No.': student.contact,
      'Father No.': guardianinfo(student.guardian_detail, student),
      Gender: student.gender,
      DOB: fDate(student.dob),
      Education: student.education,
      'Collage-School': student.school_college,
      Course: student.course,
      'Joining Date': fDate(student.joining_date),
      Address: `${student.address_detail.address_1} ${student.address_detail.address_2} ${student.address_detail.city} ${student.address_detail.state} ${student.address_detail.country}`,
      'Total Amount': student.fee_detail.total_amount,
      'Amount paid': student.fee_detail.amount_paid,
      Discount: student.fee_detail.discount,
    }));
    if (field.length) {
      data = data.map((item) => {
        const filteredItem = {};
        field.forEach((key) => {
          if (item.hasOwnProperty(key)) {
            filteredItem[key] = item[key];
          }
        });
        return filteredItem;
      });
    }
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Students');
    XLSX.writeFile(workbook, 'StudentList.xlsx');
    setField([]);
  };

  return (
    <>
      {studentsLoading ? (
        <LoadingScreen />
      ) : (
        <Container maxWidth={settings.themeStretch ? false : 'lg'}>
          <CustomBreadcrumbs
            heading='List'
            links={[
              { name: 'Dashboard', href: paths.dashboard.root },
              { name: 'Student', href: paths.dashboard.student.list },
            ]}
            action={
              <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, alignItems: 'center', gap: 1 }}>
                <FormControl
                  sx={{
                    flexShrink: 0,
                    width: { xs: '100%', md: 200 },
                    margin: '0px 10px',
                  }}
                >
                  <InputLabel>Field</InputLabel>
                  <Select
                    multiple
                    value={field}
                    onChange={handleFilterField1}
                    input={<OutlinedInput label='Field' />}
                    renderValue={(selected) => selected.join(', ')}
                    MenuProps={{
                      PaperProps: {
                        sx: { maxHeight: 240 },
                      },
                    }}
                  >
                    {studentField.map((option) => (
                      <MenuItem key={option} value={option}>
                        <Checkbox
                          disableRipple
                          size='small'
                          checked={field?.includes(option)}
                        />
                        {option}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <Button
                  sx={{ marginRight: '20px' }}
                  variant='contained'
                  startIcon={<Iconify icon='mingcute:add-line' />}
                  onClick={handleButtonClick}
                >
                  Add Bulk Student
                  <input
                    type='file'
                    ref={fileInputRef}
                    style={{ display: 'none' }}
                    onChange={handleFileChange}
                  />
                </Button>
                <Button
                  sx={{ margin: '0px 5px' }}
                  component={RouterLink}
                  href={paths.dashboard.student.new}
                  variant='contained'
                  startIcon={<Iconify icon='mingcute:add-line' />}
                >
                  New Student
                </Button>
              </Box>
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
                boxShadow: (theme) => `inset 0 -2px 0 0 ${alpha(theme.palette.grey[500], 0.08)}`,
              }}
            >
              {STATUS_OPTIONS.map((tab) => (
                <Tab
                  key={tab.value}
                  iconPosition='end'
                  value={tab.value}
                  label={tab.label}
                  icon={
                    <>
                      <Label
                        style={{ margin: '5px' }}
                        variant={
                          ((tab.value === 'all' || tab.value === filters.status) && 'filled') || 'soft'
                        }
                        color={
                          (tab.value === 'completed' && 'success') ||
                          (tab.value === 'running' && 'warning') ||
                          (tab.value === 'leaved' && 'error') ||
                          (tab.value === 'training' && 'info') ||
                          'default'
                        }
                      >
                        {['running', 'leaved', 'completed', 'training'].includes(tab.value)
                          ? students.filter((user) => user.status === tab.value).length
                          : students.length}
                      </Label>
                    </>
                  }
                />
              ))}
              <Box display={'flex'} justifyContent={'flex-end'} alignItems={'center'} width={'100%'}>
                <Box display={'flex'} justifyContent={'flex-end'} alignItems={'center'}> <Stack direction='row'
                                                                                                spacing={1} flexGrow={1}
                                                                                                mx={1}>
                  <PDFDownloadLink
                    document={
                      <GenerateOverviewPDF
                        allData={dataFiltered}
                        heading={[{ hed: 'ER No', Size: '80px' },
                          { hed: 'Name', Size: '240px' },
                          {
                            hed: 'Email',
                            Size: '340px',
                          },
                          {
                            hed: 'Gender',
                            Size: '120px',
                          },
                          {
                            hed: 'DOB',
                            Size: '160px',
                          },
                          {
                            hed: 'Student No.'
                            , Size: '180px',
                          },
                          {
                            hed: 'Father No.',
                            Size: '180px',
                          },
                          {
                            hed: 'Education',
                            Size: '120px',
                          },
                          {
                            hed: 'Collage-School',
                            Size: '180px',
                          },
                          {
                            hed: 'Course',
                            Size: '200px',
                          },
                          {
                            hed: 'Joining Date',
                            Size: '170px',
                          },
                          ...(field.length ? [{ hed: 'Address', Size: '100%' }, {
                            hed: 'Discount',
                            Size: '160px',
                          }, { hed: 'Status', Size: '180px' }] : []),
                          {
                            hed: 'Total Amount',
                            Size: '150px',
                          },
                          {
                            hed: 'Amount paid',
                            Size: '150px',
                          }].filter((item) => (field.includes(item.hed) || !field.length))}
                        orientation={'landscape'}
                        configs={configs}
                        SubHeading={'Students'}
                        fieldMapping={field.length ? extractedData : fieldMapping}
                      />
                    }
                    fileName={'student'}
                    style={{ textDecoration: 'none' }}
                  >
                    {({ loading }) => (
                      <Tooltip title='Export to PDF'>
                        {loading ? (
                          <CircularProgress size={24} />
                        ) : (
                          <Iconify
                            icon='eva:cloud-download-fill'
                            onClick={() => setField([])}
                            sx={{ width: 30, height: 30, color: '#637381', mt: 1 }}
                          />
                        )}

                      </Tooltip>
                    )}
                  </PDFDownloadLink>
                </Stack>
                  <Tooltip title='Export to Excel'>
                    <Iconify icon='icon-park-outline:excel' width={24} height={24} color={'#637381'} onClick={handleExportExcel} sx={{cursor: "pointer"}}/>
                  </Tooltip>
                </Box>
              </Box>
                </Tabs>
                <StudentTableToolbar
                  filters={filters}
                  onFilters={handleFilters}
                  dateError={dateError}
                  roleOptions={_roles}
                  students={students}
                  batch={batch}
                />
                {canReset && (
                  <StudentTableFiltersResult
                    filters={filters}
                    onFilters={handleFilters}
                    onResetFilters={handleResetFilters}
                    results={dataFiltered.length}
                    sx={{ p: 2.5, pt: 0 }}
                  />
                )}
                <TableContainer sx={{ position: 'relative', overflow: 'unset' }}>
                  <TableSelectedAction
                    dense={table.dense}
                    numSelected={table.selected.length}
                    rowCount={dataFiltered.length}
                    onSelectAllRows={(checked) =>
                      table.onSelectAllRows(
                        checked,
                        dataFiltered.map((row) => row._id),
                      )
                    }
                    action={
                      <Tooltip title='Delete'>
                        <IconButton color='primary' onClick={confirm.onTrue}>
                          <Iconify icon='solar:trash-bin-trash-bold' />
                        </IconButton>
                      </Tooltip>
                    }
                  />
                  <Scrollbar>
                    <Table size={table.dense ? 'small' : 'medium'} sx={{ minWidth: '100%' }}>
                      <TableHeadCustom
                        order={table.order}
                        orderBy={table.orderBy}
                        headLabel={TABLE_HEAD}
                        rowCount={dataFiltered.length}
                        numSelected={table.selected.length}
                        onSort={table.onSort}
                        onSelectAllRows={(checked) =>
                          table.onSelectAllRows(
                            checked,
                            dataFiltered.map((row) => row._id),
                          )
                        }
                      />
                      <TableBody>
                        {dataFiltered
                          .slice(
                            table.page * table.rowsPerPage,
                            table.page * table.rowsPerPage + table.rowsPerPage,
                          )
                          .map((row) => (
                            <StudentTableRow
                              key={row._id}
                              row={row}
                              selected={table.selected.includes(row._id)}
                              onSelectRow={() => table.onSelectRow(row._id)}
                              onDeleteRow={() => handleDeleteRows(row._id)}
                              onEditRow={() => handleEditRow(row._id)}
                              onGuardianRow={() => handleGuardianEditRow(row._id)}
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
        </Container>
        )}
        <ConfirmDialog
        open={confirm.value}
        onClose={confirm.onFalse}
        title='Delete Student'
        content={
        <>
        Are you sure you want to
        delete <strong> {table.selected.length} </strong> student{table.selected.length > 1 ? 's' : ''}?
        </>
      }
        action={
        <Button
        variant='contained'
        color='error'
        onClick={() => {
        handleDeleteRows(table.selected);
        confirm.onFalse();
      }}
        >
        Delete
        </Button>
      }
        />
        </>
        );
        };

        // ----------------------------------------------------------------------

        function applyFilter(
      {
        inputData, comparator, filters, dateError,
      }
        ,
        ) {
        const {name, status, gender, endDate, startDate, course} = filters;
        const stabilizedThis = inputData.map((el, index) => [el, index]);

        stabilizedThis.sort((a, b) => {
        const order = comparator(a[0], b[0]);
        if (order !== 0) return order;
        return a[1] - b[1];
      });
        inputData = stabilizedThis.map((el) => el[0]);

        if (name) {
        inputData = inputData.filter(
        (user) =>
        (user.firstName && (user.firstName + user.lastName).toLowerCase().includes(name.toLowerCase())) ||
        (user.enrollment_no.toString() && name.includes(user.enrollment_no.toString())) ||
        (user.contact && user.contact.toLowerCase().includes(name.toLowerCase())) ||
        (user.email && user.email.toLowerCase().includes(name.toLowerCase())),
        );
      }

        if (gender.length) {
        inputData = inputData.filter((user) => gender.includes(user?.gender));
      }

        if (course.length) {
        inputData = inputData.filter((user) => course.includes(user?.course));
      }

        if (status && status !== 'all') {
        inputData = inputData.filter((user) => user.status === status);
      }

        if (!dateError) {
        if (startDate && endDate) {
        inputData = inputData.filter((order) => isBetween(order.joining_date, startDate, endDate));
      }
      }
        return inputData;
      }
