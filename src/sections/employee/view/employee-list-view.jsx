import isEqual from 'lodash/isEqual';
import { useState, useCallback, useEffect } from 'react';
import {
  Card,
  Table,
  Button,
  Tooltip,
  Container,
  TableBody,
  IconButton,
  TableContainer, FormControl, InputLabel, Select, OutlinedInput, MenuItem, Checkbox, Stack,
} from '@mui/material';
import PropTypes from 'prop-types';
import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';
import { RouterLink } from 'src/routes/components';
import { useBoolean } from 'src/hooks/use-boolean';
import { _roles } from 'src/_mock';
import Iconify from 'src/components/iconify';
import Scrollbar from 'src/components/scrollbar';
import { useSnackbar } from 'src/components/snackbar';
import { ConfirmDialog } from 'src/components/custom-dialog';
import { useSettingsContext } from 'src/components/settings';
import axios from 'axios';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
import { useAuthContext } from 'src/auth/hooks';
import {
  useTable,
  emptyRows,
  TableNoData,
  getComparator,
  TableEmptyRows,
  TableHeadCustom,
  TableSelectedAction,
  TablePaginationCustom,
} from 'src/components/table';
import EmployeeTableRow from '../employee-table-row';
import EmployeeTableToolbar from '../employee-table-toolbar';
import EmployeeTableFiltersResult from '../employee-table-filters-result';
import { useGetEmployees } from '../../../api/employee';
import { LoadingScreen } from '../../../components/loading-screen';
import { fDate, isAfter, isBetween } from '../../../utils/format-time';
import { PDFDownloadLink } from '@react-pdf/renderer';
import GenerateOverviewPdf from '../../generate-pdf/generate-overview-pdf';
import CircularProgress from '@mui/material/CircularProgress';
import { Box } from '@mui/system';
import { useGetConfigs } from '../../../api/config';
import * as XLSX from 'xlsx';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: '', label: '#' },
  { id: 'name', label: 'Name' },
  { id: 'contact', label: 'Contact' },
  { id: 'technology', label: 'Technology' },
  { id: 'role', label: 'Role' },
  { id: 'joiningDate', label: 'Joining Date' },
  { id: '' },
];

const defaultFilters = {
  name: '',
  role: [],
  technology: [],
  status: 'all',
  startDate: null,
  endDate: null,
};
const employeeField = [
  'Name',
  'Email',
  'Contact No.',
  'Gender',
  'Role',
  'Experience',
  'Qualification',
  'Technology',
  'Joining Date',
  'DOB',
  'Address',
];
const fieldMapping = {
  'Name': 'firstName',
  'Email': 'email',
  'Contact No.': 'contact',
  'Gender': 'gender',
  'Role': 'role',
  'Experience': 'experience',
  'Qualification': 'qualification',
  'Technology': 'technology',
  'Joining Date': 'joining_date',
  'DOB': 'dob',
  'Address': 'address_detail',
};
// ----------------------------------------------------------------------

export default function EmployeeListView() {
  const { user } = useAuthContext();
  const { enqueueSnackbar } = useSnackbar();
  const { configs } = useGetConfigs();
  const table = useTable();
  const settings = useSettingsContext();
  const router = useRouter();
  const confirm = useBoolean();
  const [field, setField] = useState([]);
  const [tableData, setTableData] = useState([]);
  const { employees, employeesLoading, mutate } = useGetEmployees();
  const [filters, setFilters] = useState(defaultFilters);
  useEffect(() => {
    if (employees) {
      setTableData(employees);
    }
  }, [employees]);
  const dataFiltered = applyFilter({
    inputData: employees,
    comparator: getComparator(table.order, table.orderBy),
    filters,
  });

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
    async (_id) => {
      try {
        const URL = `${import.meta.env.VITE_AUTH_API}/api/company/${user?.company_id}/${_id}/deleteEmployee`;
        const response = await axios.delete(URL);
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
    },
    [enqueueSnackbar, mutate, confirm, user?.company_id],
  );

  const handleDeleteRows = useCallback(async () => {
    try {
      const URL = `${import.meta.env.VITE_AUTH_API}/api/company/${user?.company_id}/delete/all-employee`;
      const selectedIdsArray = [...table.selected];
      const response = await axios.delete(URL, { data: { ids: selectedIdsArray } });
      enqueueSnackbar(response.data.data.message, { variant: 'success' });
      setTableData((prevData) => prevData.filter((row) => !selectedIdsArray.includes(row.id)));
      table.onUpdatePageDeleteRow(selectedIdsArray.length);
      confirm.onFalse();
      mutate();
      // await Promise.all(
      //   sortedSelectedIds.map(async (selectedId) => {
      //     const response = ;
      //     if (response.status === 200) {
      //       enqueueSnackbar(response.data.data.message, { variant: 'success' });
      //       setTableData((prevData) => prevData.filter((row) => !selectedIdsArray.includes(row.id)));
      //       table.onUpdatePageDeleteRow(selectedIdsArray.length);
      //       mutate();
      //       confirm.onFalse();
      //     } else {
      //       enqueueSnackbar(response.data.message, { variant: 'error' });
      //     }
      //   })
      // );
    } catch (error) {
      console.error('Failed to delete Employee', error);
      enqueueSnackbar('Failed to delete Employee', { variant: 'error' });
    }
  }, [enqueueSnackbar, mutate, confirm, table.selected, user?.company_id]);

  const handleEditRow = useCallback(
    (id) => {
      router.push(paths.dashboard.employee.edit(id));
    },
    [router],
  );
  const handleFilterField1 = (event) => {
    const { value } = event.target;
    if (value.length > 7) {
      enqueueSnackbar('You can only select up to 7 options!', { variant: 'error' });
      return;
    }
    setField(value);
  };
  const handleExportExcel = () => {
    let data = dataFiltered.map((employee) => ({
      Name: employee.firstName + ' ' + employee.lastName,
      Email: employee.email,
      'Contact No.': employee.contact,
      Gender: employee.gender,
      Role: employee.role,
      'Experience': employee.experience,
      'Qualification': employee.qualification,
      'Technology': employee.technology,
      'Joining Date': fDate(employee.joining_date),
      DOB: fDate(employee.dob),
      Address: employee.address_detail.address_1 + ' ' + employee.address_detail.address_2 + ' ' + employee.address_detail.city + ' ' + employee.address_detail.state + ' ' + employee.address_detail.country,
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
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Inquiry');
    XLSX.writeFile(workbook, 'InquiryList.xlsx');
    setField([]);
  };

  const extractedData = field.reduce((result, key) => ({
    ...result,
    [key]: fieldMapping[key].split('.').reduce((o, i) => o[i]),
  }), {});
  const dateError = isAfter(filters.startDate, filters.endDate);

  return (
    <>
      {employeesLoading ? <LoadingScreen /> : <Container maxWidth={settings.themeStretch ? false : 'lg'}>
        <CustomBreadcrumbs
          heading='Employee'
          links={[
            { name: 'Dashboard', href: paths.dashboard.root },
            { name: 'Employee', href: paths.dashboard.employee.list },
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
                  {employeeField.map((option) => (
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
              <Stack direction='row' spacing={1} flexGrow={1} mx={1}>
                <PDFDownloadLink
                  document={
                    <GenerateOverviewPdf
                      allData={dataFiltered}
                      heading={[
                        { hed: 'Name', Size: '240px' },
                        {
                          hed: 'Email',
                          Size: '260px',
                        },
                        {
                          hed: 'Contact No.',
                          Size: '180px',
                        },
                        {
                          hed: 'Gender',
                          Size: '180px',
                        },
                        {
                          hed: 'Role',
                          Size: '180px',
                        },
                        {
                          hed: 'Experience',
                          Size: '180px',
                        },
                        {
                          hed: 'Qualification',
                          Size: '180px',
                        },
                        {
                          hed: 'Technology',
                          Size: '180px',
                        },
                        {
                          hed: 'Joining Date',
                          Size: '180px',
                        },
                        ...(field.length ? [
                          {
                            hed: 'DOB',
                            Size: '140px',
                          },
                          { hed: 'Address', Size: '100%' },
                          ] : []),
                      ].filter((item) => (field.includes(item.hed) || !field.length))}
                      orientation={'landscape'}
                      configs={configs}
                      SubHeading={'Employee'}
                      fieldMapping={field.length ? extractedData : fieldMapping}
                    />
                  }
                  fileName={'Inquiries'}
                  style={{ textDecoration: 'none' }}
                >
                  {({ loading }) => (
                    <Tooltip>
                      <Button
                        variant='contained'
                        onClick={() => setField([])}
                        startIcon={loading ? <CircularProgress size={24} color='inherit' /> :
                          <Iconify icon='eva:cloud-download-fill' />}
                      >
                        {loading ? 'Generating...' : 'Download PDF'}
                      </Button>
                    </Tooltip>
                  )}
                </PDFDownloadLink>
              </Stack>
              <Button
                variant='contained'
                startIcon={<Iconify icon='icon-park-outline:excel' />}
                onClick={handleExportExcel}
                sx={{ margin: '0px 10px' }}
              >
                Export to Excel
              </Button>
              <Button
                component={RouterLink}
                href={paths.dashboard.employee.new}
                variant='contained'
                startIcon={<Iconify icon='mingcute:add-line' />}
              >
                New Employee
              </Button>
            </Box>
          }
          sx={{ mb: { xs: 3, md: 5 } }}
        />
        <Card>
          <EmployeeTableToolbar filters={filters} onFilters={handleFilters} roleOptions={_roles}
                                dateError={dateError} />
          {canReset && (
            <EmployeeTableFiltersResult
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
              <Table size={table.dense ? 'small' : 'medium'} sx={{ minWidth: 960 }}>
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
                    .map((row, index) => (
                      <EmployeeTableRow
                        key={row._id}
                        index={index}
                        row={row}
                        selected={table.selected.includes(row._id)}
                        onSelectRow={() => table.onSelectRow(row._id)}
                        onDeleteRow={() => handleDeleteRow(row._id)}
                        onEditRow={() => handleEditRow(row._id)}
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
      }
      <ConfirmDialog
        open={confirm.value}
        onClose={confirm.onFalse}
        title='Delete Employee'
        content={
          <>
            Are you sure want to delete <strong> {table.selected.length} </strong> employee?
          </>
        }
        action={
          <Button
            variant='contained'
            color='error'
            onClick={() => {
              handleDeleteRows();
              confirm.onFalse();
            }}
          >
            Delete
          </Button>
        }
      />
    </>
  );
}

// ----------------------------------------------------------------------

function applyFilter({ inputData, comparator, filters, dateError }) {
  const { name, status, role, startDate, endDate, technology } = filters;

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
        user.firstName.toLowerCase().indexOf(name.toLowerCase()) !== -1 ||
        user.contact.toLowerCase().indexOf(name.toLowerCase()) !== -1 ||
        user.email.toLowerCase().indexOf(name.toLowerCase()) !== -1,
    );
  }

  if (status !== 'all') {
    inputData = inputData.filter((user) => user.status === status);
  }

  if (role.length) {
    inputData = inputData.filter((user) => role.includes(user.role));
  }

  if (technology.length) {
    inputData = inputData.filter((user) => technology.includes(user.technology));
  }

  if (!dateError) {
    if (startDate && endDate) {
      inputData = inputData.filter((order) => isBetween(order.joining_date, startDate, endDate));
    }
  }

  return inputData;
}
