import { useState, useCallback } from 'react';

import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import TableBody from '@mui/material/TableBody';
import IconButton from '@mui/material/IconButton';
import TableContainer from '@mui/material/TableContainer';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { useBoolean } from 'src/hooks/use-boolean';

import { isAfter, isBetween } from 'src/utils/format-time';

import Iconify from 'src/components/iconify';
import Scrollbar from 'src/components/scrollbar';
import { useSnackbar } from 'src/components/snackbar';
import { ConfirmDialog } from 'src/components/custom-dialog';
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

import FeesTableFiltersResult from '../fees-table-filters-result';
import FeesTableRow from '../fees-table-row';
import FeesTableToolbar from '../fees-table-toolbar';
import { useGetStudents } from 'src/api/student';
import { useGetConfigs } from '../../../api/config';
import { Box, Checkbox, FormControl, InputLabel, MenuItem, OutlinedInput, Select, Stack } from '@mui/material';
import { PDFDownloadLink } from '@react-pdf/renderer';
import GenerateOverviewPdf from '../../generate-pdf/generate-overview-pdf';
import CircularProgress from '@mui/material/CircularProgress';
import { RouterLink } from '../../../routes/components';
import PdfFeesPdf from '../fees-overview-pdf';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'srNo', label: '#', align: 'center' },
  { id: 'profile', label: 'Profile' },
  { id: 'enroll', label: 'Enroll No' },
  { id: 'contact', label: 'Contact' },
  { id: 'course', label: 'Course' },
  { id: 'joining_date', label: 'Joining Date' },
  // { id: 'status', label: 'Status' },
  { id: 'installments', label: 'Installments', align: 'center' },
];
const defaultFilters = {
  name: '',
  status: 'all',
  startDate: null,
  endDate: null,
};
const feesField = [
  'Name',
  // 'Contact',
  'Amount paid',
  'Discount',
  'Total Amount',
  'Installments',
];
const fieldMapping = {
  'Name': 'name',
  // 'Contact': 'contact',
  'Amount paid': 'amount_paid',
  'Discount': 'discount',
  'Total Amount': 'total_amount',
  'Installments': 'fee_detail.installments',
};

// ----------------------------------------------------------------------

export default function FeesListView() {
  const { enqueueSnackbar } = useSnackbar();

  const table = useTable({ defaultOrderBy: 'feesNumber' });

  const router = useRouter();
  const [field, setField] = useState([]);
  const confirm = useBoolean();
  const { configs } = useGetConfigs();
  const { students, mutate } = useGetStudents();

  const [tableData, setTableData] = useState(students);

  const [filters, setFilters] = useState(defaultFilters);

  const dateError = isAfter(filters.startDate, filters.endDate);

  const dataFiltered = applyFilter({
    inputData: students,
    comparator: getComparator(table.order, table.orderBy),
    filters,
    dateError,
  });

  const dataInPage = dataFiltered.slice(
    table.page * table.rowsPerPage,
    table.page * table.rowsPerPage + table.rowsPerPage
  );

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
    [table]
  );
  const handleEditRow = () => {};
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
    [dataInPage.length, enqueueSnackbar, table, tableData]
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

  const handleViewRow = useCallback(
    (id) => {
      router.push(paths.dashboard.order.details(id));
    },
    [router]
  );

  const handleFilterStatus = useCallback(
    (event, newValue) => {
      handleFilters('status', newValue);
    },
    [handleFilters]
  );
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
  return (
    <>
      <CustomBreadcrumbs
        heading="Fees"
        links={[
          {
            name: 'Dashboard',
            href: paths.dashboard.root,
          },
          {
            name: 'Fees',
            href: paths.dashboard.student.list,
          },
          // { name: 'Fees' },
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
                {feesField.map((option) => (
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
                  <PdfFeesPdf
                    feeData={dataFiltered}
                    heading={[
                      { hed: 'Name', Size: '240px' },
                      // { hed: 'Contact', Size: '260px' },
                      { hed: 'Amount paid', Size: '140px' },
                      { hed: 'Discount', Size: '100px' },
                      { hed: 'Total Amount', Size: '140px' },
                      { hed: 'Installments', Size: '100%' },
                    ].filter((item) => (field.includes(item.hed) || !field.length))}
                    orientation={'landscape'}
                    configs={configs}
                    SubHeading={'Fees'}
                    fieldMapping={field.length ? extractedData : fieldMapping}
                  />
                }
                fileName={'FeesList'}
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
            {/*<Button*/}
            {/*  variant='contained'*/}
            {/*  startIcon={<Iconify icon='icon-park-outline:excel' />}*/}
            {/*  onClick={handleExportExcel}*/}
            {/*  sx={{ margin: '0px 10px' }}*/}
            {/*>*/}
            {/*  Export to Excel*/}
            {/*</Button>*/}
          </Box>
        }
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />

      <Card>
        <FeesTableToolbar filters={filters} onFilters={handleFilters} dateError={dateError} />

        {canReset && (
          <FeesTableFiltersResult
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
                dataFiltered.map((row) => row.id)
              )
            }
            action={
              <Tooltip title="Delete">
                <IconButton color="primary" onClick={confirm.onTrue}>
                  <Iconify icon="solar:trash-bin-trash-bold" />
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
                    table.page * table.rowsPerPage + table.rowsPerPage
                  )
                  .map((row, index) => (
                    <FeesTableRow
                      index={index}
                      key={index}
                      row={row}
                      selected={table.selected.includes(row._id)}
                      onSelectRow={() => table.onSelectRow(row._id)}
                      onDeleteRow={() => handleDeleteRow(row._id)}
                      onViewRow={() => handleViewRow(row._id)}
                      onEditRow={() => handleEditRow(row._id)}
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
          //
          dense={table.dense}
          onChangeDense={table.onChangeDense}
        />
      </Card>

      <ConfirmDialog
        open={confirm.value}
        onClose={confirm.onFalse}
        title="Delete"
        content={
          <>
            Are you sure want to delete <strong> {table.selected.length} </strong> items?
          </>
        }
        action={
          <Button
            variant="contained"
            color="error"
            onClick={() => {
              handleDeleteRows();
              confirm.onFalse();
            }}
          >
            Delete
          </Button>
        }
      />
      {/* <InvoiceDetailsView id="e99f09a7-dd88-49d5-b1c8-1daf80c2d7b2" /> */}
    </>
  );
}

// ----------------------------------------------------------------------

function applyFilter({ inputData, comparator, filters, dateError }) {
  const { status, name, startDate, endDate } = filters;
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
        item.firstName.toLowerCase().indexOf(name.toLowerCase()) !== -1 ||
        item.lastName.toLowerCase().indexOf(name.toLowerCase()) !== -1
    );
  }

  if (status !== 'all') {
    inputData = inputData.filter((order) => order.status === status);
  }

  if (!dateError) {
    if (startDate && endDate) {
      // console.log("fil : ",inputData);
      inputData = inputData.filter((order) => isBetween(order.joining_date, startDate, endDate));
    }
  }

  return inputData;
}
