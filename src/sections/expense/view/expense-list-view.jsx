import isEqual from 'lodash/isEqual';
import { useState, useCallback, useEffect } from 'react';
import axios from 'axios';

import {
  Tab,
  Tabs,
  Card,
  Table,
  Button,
  Tooltip,
  Container,
  TableBody,
  IconButton,
  TableContainer,
  alpha, FormControl, InputLabel, Select, OutlinedInput, MenuItem, Checkbox, Stack, Box,
} from '@mui/material';

import { paths } from 'src/routes/paths';
import { useAuthContext } from 'src/auth/hooks';
import { useRouter } from 'src/routes/hooks';
import { RouterLink } from 'src/routes/components';
import { useBoolean } from 'src/hooks/use-boolean';
import { _expenses, USER_STATUS_OPTIONS } from 'src/_mock';

import Label from 'src/components/label';
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

import { useGetExpense } from 'src/api/expense';
import ExpenseTableRow from '../expenses-table-row';
import ExpenseTableToolbar from '../expenses-table-toolbar';
import ExpenseTableFiltersResult from '../expenses-table-filters-result';
import { fDate, isAfter, isBetween } from '../../../utils/format-time';
import { PDFDownloadLink } from '@react-pdf/renderer';
import GenerateOverviewPdf from '../../generate-pdf/generate-overview-pdf';
import CircularProgress from '@mui/material/CircularProgress';
import { useGetConfigs } from '../../../api/config';
import * as XLSX from 'xlsx';
import { getResponsibilityValue } from '../../../permission/permission';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'srNo', label: '#' },
  { id: 'date', label: 'Date' },
  { id: 'type', label: 'Type' },
  { id: 'amount', label: 'Amount' },
  { id: 'description', label: 'Description' },
  { id: '' },
];

const defaultFilters = {
  name: '',
  role: [],
  status: 'all',
  startDate: null,
  endDate: null,
};
const expenseField = [
  'Date',
  'Expense Type',
  'Amount',
  'Description',
];
const fieldMapping = {
  'Date': 'date',
  'Expense Type': 'type',
  'Amount': 'amount',
  'Description': 'desc',
};
// ----------------------------------------------------------------------

export default function ExpenseListView() {
  const { user } = useAuthContext();
  const { configs } = useGetConfigs();
  const { enqueueSnackbar } = useSnackbar();
  const table = useTable();
  const [field, setField] = useState([]);
  const settings = useSettingsContext();
  const router = useRouter();
  const confirm = useBoolean();
  const { expense, mutate } = useGetExpense(user);
  const [tableData, setTableData] = useState([]);
  const [filters, setFilters] = useState(defaultFilters);

  useEffect(() => {
    if (expense) {
      setTableData(expense);
    }
  }, [expense]);

  const handleDeleteRow = useCallback(
    async (id) => {
      try {
        const response = await axios.delete(
          `https://server-eduaura-pyjuy.ondigitalocean.app/api/company/${user?.company_id}/delete/all-expense`,
          { data: { ids: id } },
        );
        if (response.status === 200) {
          enqueueSnackbar('deleted successfully', { variant: 'success' });

          confirm.onFalse();
          mutate();
        } else {
          enqueueSnackbar('Failed to delete items', { variant: 'error' });
        }
      } catch (error) {
        console.error('Failed to delete inquiry', error);
        enqueueSnackbar('Failed to delete expense', { variant: 'error' });
      }
    },
    [enqueueSnackbar, mutate, table, tableData],
  );

  const handleDeleteRows = useCallback(async () => {
    try {
      const selectedIdsArray = [...table.selected];
      const response = await axios.delete(
        `https://server-eduaura-pyjuy.ondigitalocean.app/api/company/${user?.company_id}/delete/all-expense`,
        { data: { ids: selectedIdsArray } },
      );
      if (response.status === 200) {
        enqueueSnackbar('deleted successfully', { variant: 'success' });
        setTableData((prevData) => prevData.filter((row) => !selectedIdsArray.includes(row.id)));
        table.onUpdatePageDeleteRow(selectedIdsArray.length);
        mutate();
        confirm.onFalse();
      } else {
        enqueueSnackbar('Failed to delete items', { variant: 'error' });
      }
    } catch (error) {
      console.error('Failed to delete Expenses', error);
      enqueueSnackbar('Failed to delete Expenses', { variant: 'error' });
    }
  }, [enqueueSnackbar, mutate, table, confirm]);

  const dataFiltered = applyFilter({
    inputData: tableData,
    comparator: getComparator(table.order, table.orderBy),
    filters,
  });

  const dataInPage = dataFiltered.slice(
    table.page * table.rowsPerPage,
    table.page * table.rowsPerPage + table.rowsPerPage,
  );

  const denseHeight = table.dense ? 56 : 76;

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

  const handleEditRow = useCallback(
    (id) => {
      router.push(paths.dashboard.expenses.edit(id));
    },
    [router],
  );

  const handleFilterStatus = useCallback(
    (event, newValue) => {
      handleFilters('status', newValue);
    },
    [handleFilters],
  );

  const handleViewRow = useCallback(
    (id) => {
      router.push(paths.dashboard.expenses.edit(id));
    },
    [router],
  );
  const extractedData = field.reduce((result, key) => ({
    ...result,
    [key]: fieldMapping[key].split('.').reduce((o, i) => o[i]),
  }), {});

  const handleExportExcel = () => {
    let data = dataFiltered.map((exp) => ({
      Date: fDate(exp.date),
      'Expense Type': exp.type,
      'Amount': exp.amount,
      'Description': exp.desc,
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
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Expense');
    XLSX.writeFile(workbook, 'expenseList.xlsx');
    setField([]);
  };

  const handleFilterField1 = (event) => {
    const { value } = event.target;
    if (value.length > 7) {
      enqueueSnackbar('You can only select up to 7 options!', { variant: 'error' });
      return;
    }
    setField(value);
  };
  const dateError = isAfter(filters.startDate, filters.endDate);

  return (
    <>
      <Container maxWidth={settings.themeStretch ? false : 'lg'}>
        <CustomBreadcrumbs
          heading='Expense'
          links={[
            { name: 'Dashboard', href: paths.dashboard.root },
            { name: 'Expense', href: paths.dashboard.expenses.root },
          ]}
          action={
            <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, alignItems: 'center', gap: 1 }}>
              {getResponsibilityValue('print_expense_detail', configs, user) && (<> <FormControl
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
                  {expenseField.map((option) => (
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
                          { hed: 'Date', Size: '180px' },
                          {
                            hed: 'Expense Type',
                            Size: '180px',
                          },
                          {
                            hed: 'Amount',
                            Size: '180px',
                          },
                          {
                            hed: 'Description',
                            Size: '180px',
                          }].filter((item) => (field.includes(item.hed) || !field.length))}
                        orientation={'landscape'}
                        configs={configs}
                        SubHeading={'Expense'}
                        fieldMapping={field.length ? extractedData : fieldMapping}
                      />
                    }
                    fileName={'Expenses'}
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
                </Button></>)}

              {getResponsibilityValue('create_expense', configs, user) && <Button
                component={RouterLink}
                href={paths.dashboard.expenses.new}
                variant='contained'
                startIcon={<Iconify icon='mingcute:add-line' />}
              >
                New Expense
              </Button>}
            </Box>
          }
          sx={{
            mb: { xs: 3, md: 5 },
          }}
        />

        <Card>
          <ExpenseTableToolbar
            filters={filters}
            onFilters={handleFilters}
            roleOptions={_expenses}
            dateError={dateError}
          />

          {canReset && (
            <ExpenseTableFiltersResult
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
                  // onSelectAllRows={(checked) =>
                  //   table.onSelectAllRows(
                  //     checked,
                  //     dataFiltered.map((row) => row._id)
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
                      <ExpenseTableRow
                        key={row._id}
                        row={row}
                        index={index}
                        selected={table.selected.includes(row._id)}
                        onSelectRow={() => table.onSelectRow(row._id)}
                        onDeleteRow={() => handleDeleteRow(row._id)}
                        onEditRow={() => handleEditRow(row._id)}
                        onViewRow={() => handleViewRow(row._id)}
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
            Are you sure want to delete <strong> {table.selected.length} </strong> items?
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
  const { name, status, role, startDate, endDate } = filters;

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
        user.type.toLowerCase().indexOf(name.toLowerCase()) !== -1 ||
        user.desc.toLowerCase().indexOf(name.toLowerCase()) !== -1,
    );
  }

  if (status !== 'all') {
    inputData = inputData.filter((user) => user.status === status);
  }

  if (!dateError) {
    if (startDate && endDate) {
      inputData = inputData.filter((order) => isBetween(order.date, startDate, endDate));
    }
  }

  if (role.length) {
    inputData = inputData.filter((user) => role.includes(user.type));
  }

  return inputData;
}
