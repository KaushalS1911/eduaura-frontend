import { useState, useEffect, useCallback } from 'react';
import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import Container from '@mui/material/Container';
import TableBody from '@mui/material/TableBody';
import IconButton from '@mui/material/IconButton';
import TableContainer from '@mui/material/TableContainer';
import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';
import { RouterLink } from 'src/routes/components';
import { useBoolean } from 'src/hooks/use-boolean';
import axios from 'axios';
import Iconify from 'src/components/iconify';
import Scrollbar from 'src/components/scrollbar';
import { useSnackbar } from 'src/components/snackbar';
import { ConfirmDialog } from 'src/components/custom-dialog';
import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
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
import { useGetInquiry } from 'src/api/inquiry';
import { useAuthContext } from 'src/auth/hooks';
import InquiryTableRow from '../inquiry-table-row';
import InquiryTableToolbar from '../inquiry-table-toolbar';
import { fDate, isAfter, isBetween } from '../../../utils/format-time';
import InquiryTableFiltersResult from '../inquiry-table-filters-result';
import { Box, Checkbox, FormControl, InputLabel, MenuItem, OutlinedInput, Select, Stack } from '@mui/material';
import { PDFDownloadLink } from '@react-pdf/renderer';
import GenerateOverviewPdf from '../../generate-pdf/generate-overview-pdf';
import CircularProgress from '@mui/material/CircularProgress';
import * as XLSX from 'xlsx';
import { useGetConfigs } from '../../../api/config';
// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'Sr no', label: '#', align: 'center' },
  { id: 'studentName', label: 'Name' },
  { id: 'contact', label: 'Contact' },
  { id: 'email', label: 'Email' },
  { id: 'appointment', label: 'Date' },
  { id: 'demo', label: 'Action' },
  { id: 'status', label: 'Status' },
  { id: '', align: 'center' },
];

const defaultFilters = {
  name: '',
  status: 'all',
  startDate: null,
  endDate: null,
};

// ----------------------------------------------------------------------

export default function InquiryListView() {
  const { configs } = useGetConfigs();
  const [field, setField] = useState([]);
  const { enqueueSnackbar } = useSnackbar();
  const table = useTable();
  const settings = useSettingsContext();
  const router = useRouter();
  const confirm = useBoolean();
  const [filters, setFilters] = useState(defaultFilters);
  const { inquiry, inquiryError, mutate } = useGetInquiry();

  useEffect(() => {
    if (inquiryError) {
      enqueueSnackbar('Failed to fetch inquiries', { variant: 'error' });
    }
  }, [inquiryError, enqueueSnackbar]);

  const dataFiltered = applyFilter({
    inputData: inquiry,
    comparator: getComparator(table.order, table.orderBy),
    filters,
  });

  const denseHeight = table.dense ? 56 : 56 + 20;
  const canReset =
    !!filters.name || filters.status !== 'all' || (!!filters.startDate && !!filters.endDate);

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

  const handleDeleteRow = useCallback(
    async (_id) => {
      try {
        const URL = `${import.meta.env.VITE_AUTH_API}/api/company/inquiry`;
        const response = await axios.delete(URL, {
          data: { ids: _id },
        });
        if (response.status === 200) {
          enqueueSnackbar(response.data.message, { variant: 'success' });
          confirm.onFalse();
          mutate();
        } else {
          enqueueSnackbar(response.data.message, { variant: 'error' });
        }
      } catch (error) {
        console.error('Failed to delete Inquiry', error);
        enqueueSnackbar('Failed to delete Inquiry', { variant: 'error' });
      }
    },
    [enqueueSnackbar, mutate, confirm],
  );

  const handleDeleteRows = useCallback(
    async (_id) => {
      try {
        const sortedSelectedIds = [...table.selected].sort();
        const selectedIds = sortedSelectedIds.map((selectedId) => selectedId);
        const URL = `${import.meta.env.VITE_AUTH_API}/api/company/inquiry`;
        const response = await axios.delete(URL, {
          data: { ids: selectedIds },
        });
        if (response.status === 200) {
          enqueueSnackbar(response.data.message, { variant: 'success' });
          mutate();
          confirm.onFalse();
        } else {
          enqueueSnackbar(response.data.message, { variant: 'error' });
        }
      } catch (error) {
        console.error('Failed to delete inquiries', error);
        enqueueSnackbar('Failed to delete inquiries', { variant: 'error' });
      }
    },
    [table.selected, enqueueSnackbar, mutate, confirm],
  );

  const handleEditRow = useCallback(
    (id) => {
      router.push(paths.dashboard.inquiry.edit(id));
    },
    [router],
  );

  const handleResetFilters = useCallback(() => {
    setFilters(defaultFilters);
  }, []);

  const dateError = isAfter(filters.startDate, filters.endDate);

  const fieldMapping = {
    'Name': 'firstName',
    'Email': 'email',
    'Contact No.': 'contact',
    'Occupation': 'occupation',
    'Education': 'education',
    'dob': 'dob',
    'Reference By': 'reference_by',
    'Father Name': 'fatherName',
    'Father Contact': 'father_contact',
    'Father Occupation': 'father_occupation',
    'Suggested By': 'suggested_by',
    'Status': 'status',
    'Interested In': 'interested_in',
    'Remark': 'remark',
    'Address': 'address',
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

  const inquiryField = [
    'Name',
    'Email',
    'Contact No.',
    'Occupation',
    'Education',
    'dob',
    'Reference By',
    'Father Name',
    'Father Contact',
    'Father Occupation',
    'Suggested By',
    'Status',
    'Remark',
    'Interested In',
    'Address',
  ];

  const handleExportExcel = () => {
    let data = dataFiltered.map((inquiry) => ({
      Name: inquiry.firstName + ' ' + inquiry.lastName,
      Email: inquiry.email,
      'Contact No.': inquiry.contact,
      Occupation: inquiry.occupation,
      Education: inquiry.education,
      dob: fDate(inquiry.dob),
      'Reference By': inquiry.reference_by,
      'Father Name': inquiry.fatherName,
      'Father Contact': inquiry.father_contact,
      'Father Occupation': inquiry.father_occupation,
      'Suggested By': inquiry.suggested_by,
      Status: inquiry.status,
      Remark: inquiry.remark,
      'Interested In': inquiry.interested_in.join(', '),
      Address: inquiry.address.address_line1 + ' ' + inquiry.address.address_line2 + ' ' + inquiry.address.city + ' ' + inquiry.address.state + ' ' + inquiry.address.country,
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

  return (
    <>
      <Container maxWidth={settings.themeStretch ? false : 'lg'}>
        <CustomBreadcrumbs
          heading='Inquiries'
          links={[
            { name: 'Dashboard', href: paths.dashboard.root },
            { name: 'Inquiries', href: paths.dashboard.inquiry.list },
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
                  {inquiryField.map((option) => (
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
                          hed: 'Occupation',
                          Size: '180px',
                        },
                        {
                          hed: 'Education',
                          Size: '180px',
                        },
                        {
                          hed: 'Reference By',
                          Size: '180px',
                        },
                        {
                          hed: 'Father Name',
                          Size: '180px',
                        },
                        {
                          hed: 'Father Contact',
                          Size: '180px',
                        },
                        {
                          hed: 'Suggested By',
                          Size: '180px',
                        },
                        {
                          hed: 'Status',
                          Size: '180px',
                        },
                        {
                          hed: 'Remark',
                          Size: '180px',
                        },
                        ...(field.length ? [{ hed: 'Address', Size: '100%' }, {
                          hed: 'Father Occupation',
                          Size: '180px',
                        },
                          {
                            hed: 'Occupation',
                            Size: '180px',
                          }, {
                            hed: 'Interested In',
                            Size: '180px',
                          },
                          {
                            hed: 'dob',
                            Size: '140px',
                          },
                          {
                            hed: 'dob',
                            Size: '140px',
                          }] : []),
                      ].filter((item) => (field.includes(item.hed) || !field.length))}
                      orientation={'landscape'}
                      configs={configs}
                      SubHeading={'Inquiries'}
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
                href={paths.dashboard.inquiry.new}
                variant='contained'
                startIcon={<Iconify icon='mingcute:add-line' />}
              >
                New Inquiry
              </Button>
            </Box>
          }
          sx={{
            mb: { xs: 3, md: 5 },
          }}
        />
        <Card>
          <InquiryTableToolbar filters={filters} onFilters={handleFilters} dateError={dateError} />
          {canReset && (
            <InquiryTableFiltersResult
              filters={filters}
              onFilters={handleFilters}
              //
              onResetFilters={handleResetFilters}
              //
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
                  dataFiltered.map((row) => row.id),
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
                  // onSelectAllRows={(checked) =>
                  //   table.onSelectAllRows(
                  //     checked,
                  //     dataFiltered.map((row) => row.id)
                  //   )
                  // }
                />
                <TableBody>
                  {dataFiltered
                    .slice(
                      table.page * table.rowsPerPage,
                      table.page * table.rowsPerPage + table.rowsPerPage,
                    )
                    .map((row, index) => (
                      <InquiryTableRow
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
      <ConfirmDialog
        open={confirm.value}
        onClose={confirm.onFalse}
        title='Delete'
        content={
          <>
            Are you sure you want to delete <strong>{table.selected.length}</strong> items?
          </>
        }
        action={
          <Button variant='contained' color='error' onClick={handleDeleteRows}>
            Delete
          </Button>
        }
      />
    </>
  );
}

// ----------------------------------------------------------------------

function applyFilter({ inputData, comparator, filters, dateError }) {
  const { startDate, endDate, status, name } = filters;
  const stabilizedThis = inputData.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  inputData = stabilizedThis.map((el) => el[0]);

  if (name) {
    inputData = inputData.filter(
      (user) => user.firstName.toLowerCase().indexOf(name.toLowerCase()) !== -1 ||
        user.contact.toLowerCase().indexOf(name.toLowerCase()) !== -1,
    );
  }
  if (status !== 'all') {
    inputData = inputData.filter((order) => order.status === status);
  }
  if (!dateError) {
    if (startDate && endDate) {
      inputData = inputData.filter((order) => isBetween(order.createdAt, startDate, endDate));
    }
  }
  return inputData;
}
