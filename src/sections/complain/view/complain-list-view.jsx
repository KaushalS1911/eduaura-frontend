import sumBy from 'lodash/sumBy';
import React, { useState, useCallback } from 'react';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import Container from '@mui/material/Container';
import TableBody from '@mui/material/TableBody';
import { alpha, useTheme } from '@mui/material/styles';
import TableContainer from '@mui/material/TableContainer';
import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';
import { useBoolean } from 'src/hooks/use-boolean';
import Label from 'src/components/label';
import Scrollbar from 'src/components/scrollbar';
import { useSnackbar } from 'src/components/snackbar';
import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
import {
  useTable,
  emptyRows,
  TableNoData,
  getComparator,
  TableEmptyRows,
  TableHeadCustom,
  TablePaginationCustom,
} from 'src/components/table';
import { useGetComplaints } from 'src/api/complain';
import ComplainTableRow from '../complain-table-row';
import ComplainTableToolbar from '../complain-table-toolbar';
import ComplainTableFiltersResult from '../complain-table-filters-result';
import { fDate, isAfter, isBetween } from '../../../utils/format-time';
import { Box, Stack } from '@mui/material';
import { PDFDownloadLink } from '@react-pdf/renderer';
import GenerateOverviewPDF from '../../generate-pdf/generate-overview-pdf';
import Tooltip from '@mui/material/Tooltip';
import CircularProgress from '@mui/material/CircularProgress';
import Iconify from '../../../components/iconify';
import { useGetConfigs } from '../../../api/config';
import * as XLSX from 'xlsx';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import OutlinedInput from '@mui/material/OutlinedInput';
import MenuItem from '@mui/material/MenuItem';
import Checkbox from '@mui/material/Checkbox';
import Button from '@mui/material/Button';
import { RouterLink } from '../../../routes/components';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: '', label: '#' },
  { id: 'name', label: 'Name' },
  { id: 'date', label: 'Date' },
  { id: 'title', label: 'Title' },
  { id: 'status', label: 'Status' },
  { id: '', label: '' },
];
const complainField = [
  'Complain By',
  'Date',
  'Title',
  'Status'
];
const fieldMapping = {
  'Complain By': 'student',
  'Date': 'date',
  'Title': 'title',
  'Status': 'status',
};
const defaultFilters = {
  name: '',
  service: [],
  status: 'all',
  startDate: null,
  endDate: null,
};

// ----------------------------------------------------------------------

export default function ComplainListView() {
  const { enqueueSnackbar } = useSnackbar();
  const { configs } = useGetConfigs();
  const theme = useTheme();
  const { complaints, mutate } = useGetComplaints();
  const settings = useSettingsContext();
  const router = useRouter();
  const table = useTable({ defaultOrderBy: 'createDate' });
  const confirm = useBoolean();
  const [field, setField] = useState([]);
  const [tableData, setTableData] = useState(complaints);
  const [filters, setFilters] = useState(defaultFilters);

  const dataFiltered = applyFilter({
    inputData: complaints,
    comparator: getComparator(table.order, table.orderBy),
    filters,
  });

  const dataInPage = dataFiltered.slice(
    table.page * table.rowsPerPage,
    table.page * table.rowsPerPage + table.rowsPerPage,
  );

  const denseHeight = table.dense ? 56 : 56 + 20;
  const canReset = !!filters.name || !!filters.service.length || filters.status !== 'all' || filters.startDate && filters.endDate;
  const notFound = (!dataFiltered.length && canReset) || !dataFiltered.length;
  const getInvoiceLength = (status) => tableData.filter((item) => item.status === status).length;

  const getTotalAmount = (status) =>
    sumBy(
      tableData.filter((item) => item.status === status),
      'totalAmount',
    );

  const getPercentByStatus = (status) => (getInvoiceLength(status) / tableData.length) * 100;
  const STATUS_OPTIONS = [
    { value: 'all', label: 'All' },
    { value: 'completed', label: 'Completed' },
    { value: 'pending', label: 'Pending' },
    { value: 'cancel', label: 'Cancel' },
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

  const handleDeleteRows = useCallback(() => {
    const deleteRows = tableData.filter((row) => !table.selected.includes(row.id));
    enqueueSnackbar('Delete success!');
    setTableData(deleteRows);
    table.onUpdatePageDeleteRows({
      totalRowsInPage: dataInPage.length,
      totalRowsFiltered: dataFiltered.length,
    });
  }, [dataFiltered.length, dataInPage.length, enqueueSnackbar, table, tableData]);

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

  const extractedData = field.reduce((result, key) => ({
    ...result,
    [key]: fieldMapping[key].split('.').reduce((o, i) => o[i]),
  }), {});

  const handleFilterField1 = (event) => {
    const { value } = event.target;
    if (value.length > 7) {
      enqueueSnackbar('You can only select up to 7 options!', { variant: 'error' });
      return;
    }
    setField(value);
  };
  const dateError = isAfter(filters.startDate, filters.endDate);
  const handleExportExcel = () => {
    let data = dataFiltered.map((comp) => ({
      'Complain By': `${comp.student.firstName} ${comp.student.lastName}`,
      'Date': fDate(comp.date),
      'Title': comp.title,
      'Status': comp.status,
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
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Complain');
    XLSX.writeFile(workbook, 'ComplainList.xlsx');
    setField([]);
  };

  return (
    <>
      <Container maxWidth={settings.themeStretch ? false : 'lg'}>
        <CustomBreadcrumbs
          heading='Complain'
          links={[
            {
              name: 'Dashboard',
              href: paths.dashboard.root,
            },
            {
              name: 'Complain',
              href: paths.dashboard.complain.root,
            },
          ]}
          sx={{
            mb: { xs: 3, md: 5 },
          }}
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
                  {complainField.map((option) => (
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
            </Box>
          }
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
                  <Label
                    variant={
                      ((tab.value === 'all' || tab.value === filters.status) && 'filled') || 'soft'
                    }
                    color={
                      (tab.value === 'completed' && 'success') ||
                      (tab.value === 'pending' && 'warning') ||
                      (tab.value === 'cancel' && 'error') ||
                      'default'
                    }
                  >
                    {['completed', 'pending', 'cancel'].includes(tab.value)
                      ? complaints.filter((user) => user.status === tab.value).length
                      : complaints.length}
                  </Label>
                }
              />
            ))}
            <Box display={'flex'} justifyContent={'flex-end'} alignItems={'center'} width={'100%'}>
              <Box display={'flex'} justifyContent={'flex-end'} alignItems={'center'}>
                <Stack direction='row' spacing={1} flexGrow={1} mx={1}>
                  <PDFDownloadLink
                    document={
                      <GenerateOverviewPDF
                        allData={dataFiltered}
                        heading={[
                          {
                            hed: 'Complain By',
                            Size: '240px'
                          },
                          {
                            hed: 'Date',
                            Size: '340px',
                          },
                          {
                            hed: 'Title',
                            Size: '120px',
                          },
                          {
                            hed: 'Status',
                            Size: '160px',
                          }].filter((item) => (field.includes(item.hed) || !field.length))}
                        orientation={'landscape'}
                        configs={configs}
                        SubHeading={'Complain'}
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
                  <Iconify icon='icon-park-outline:excel' width={24} height={24} color={'#637381'} onClick={handleExportExcel} sx={{ cursor: 'pointer' }} />
                </Tooltip>
              </Box>
            </Box>
          </Tabs>

          <ComplainTableToolbar filters={filters} onFilters={handleFilters} dateError={dateError} />

          {canReset && (
            <ComplainTableFiltersResult
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
                      <ComplainTableRow
                        index={index}
                        key={index}
                        row={row}
                        mutate={mutate}
                        selected={table.selected.includes(row.id)}
                        onSelectRow={() => table.onSelectRow(row.id)}
                        onViewRow={() => handleViewRow(row.id)}
                        onEditRow={() => handleEditRow(row.id)}
                        onDeleteRow={() => handleDeleteRow(row.id)}
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
    </>
  );
}

// ----------------------------------------------------------------------

function applyFilter({ inputData, comparator, filters, dateError }) {
  const { name, status, endDate, startDate } = filters;

  const stabilizedThis = inputData.map((el, index) => [el, index]);

  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });

  inputData = stabilizedThis.map((el) => el[0]);

  if (name) {
    inputData = inputData.filter(
      (item) =>
        item.student.lastName.toLowerCase().indexOf(name.toLowerCase()) !== -1 ||
        item.student.firstName.toLowerCase().indexOf(name.toLowerCase()) !== -1,
    );
  }

  if (status !== 'all') {
    inputData = inputData.filter((item) => item.status === status);
  }

  if (!dateError) {
    if (startDate && endDate) {
      inputData = inputData.filter((order) => isBetween(order.date, startDate, endDate));
    }
  }
  return inputData;
}
