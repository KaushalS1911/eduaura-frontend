import sumBy from 'lodash/sumBy';
import { useState, useCallback, useEffect } from 'react';

import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Tooltip from '@mui/material/Tooltip';
import Container from '@mui/material/Container';
import TableBody from '@mui/material/TableBody';
import IconButton from '@mui/material/IconButton';
import { alpha, useTheme } from '@mui/material/styles';
import TableContainer from '@mui/material/TableContainer';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';
import { RouterLink } from 'src/routes/components';

import { useBoolean } from 'src/hooks/use-boolean';

import { isAfter, isBetween } from 'src/utils/format-time';

import { _invoices, INVOICE_SERVICE_OPTIONS } from 'src/_mock';

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

import attendanceAddAnalytic from '../attendance-add-invoice-analytic';
import AttendanceAddTableRow from '../attendance-add-table-row';
import AttendanceAddTableToolbar from '../attendance-add-table-toolbar';
import AttendanceAddTableFiltersResult from '../attendance-add-table-filters-result';
import { Box } from '@mui/system';
import { FormProvider, useForm } from 'react-hook-form';
import { useGetBatches, useGetSingleBatches } from 'src/api/batch';
import { useAuthContext } from 'src/auth/hooks';
import { useGetAttendanceAdd } from 'src/api/attendance';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'invoiceNumber', label: 'Customer' },
  { id: 'Contact', label: 'Contact' },
  { id: 'status', label: 'options', width: 280 },
];

const defaultFilters = {
  name: '',
  service: [],
  status: 'all',
  startDate: null,
  endDate: null,
};

// ----------------------------------------------------------------------

export default function AddAttendanceListView() {
  // Options of batches
  const { batch } = useGetBatches();
  const [SingleBatchID, setSingleBatchID] = useState();
  const { Singlebatch } = useGetSingleBatches(SingleBatchID);

  const { enqueueSnackbar } = useSnackbar();

  const theme = useTheme();

  const settings = useSettingsContext();

  const router = useRouter();

  const table = useTable({ defaultOrderBy: 'createDate' });

  const confirm = useBoolean();

  const [tableData, setTableData] = useState([]);

  useEffect(() => {
    if (Singlebatch?.batch_members) {
      setTableData(Singlebatch.batch_members);
    }
  }, [Singlebatch]);

  const [filters, setFilters] = useState(defaultFilters);

  const methods = useForm();

  const dateError = isAfter(filters.startDate, filters.endDate);

  const dataFiltered = applyFilter({
    inputData: tableData,
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
    !!filters.name ||
    !!filters.service.length ||
    filters.status !== 'all' ||
    (!!filters.startDate && !!filters.endDate);

  const notFound = (!dataFiltered.length && canReset) || !dataFiltered.length;

  const getInvoiceLength = (status) => tableData.filter((item) => item.status === status).length;

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

  const handleEditRow = useCallback(
    (id) => {
      router.push(paths.dashboard.invoice.edit(id));
    },
    [router]
  );

  const handleViewRow = useCallback(
    (id) => {
      router.push(paths.dashboard.invoice.details(id));
    },
    [router]
  );

  // ====================================
  const { user } = useAuthContext();
  const [todayDate, setTodayDate] = useState();
  const [attendanceData, setAttendanceData] = useState([]);
  const [responce1, setResponce1] = useState({ status: null });

  const handleAttendanceChange = ({ id, status }) => {
    // Check if the record exists
    const isExist = attendanceData.some((e) => e.student_id === id);

    // Filter out the existing record if it exists
    let filteredData = attendanceData;
    if (isExist) {
      filteredData = attendanceData.filter((e) => e.student_id !== id);
    }

    // Create the new student record
    const student = {
      student_id: id,
      status,
      date: todayDate,
      company_id: user.company_id,
    };

    // Add the new record to the filtered data
    setAttendanceData([...filteredData, student]);
  };


  async function attendancePost(attendanceData) {
    try {
      const responce = await useGetAttendanceAdd(attendanceData);
      if (responce && responce.status === 200) {
        setResponce1(responce);
        enqueueSnackbar('Attendance submitted successfully!', { variant: 'success' });
      } else {
        throw new Error('Failed to submit attendance');
      }
    } catch (error) {
      setResponce1(null);
      enqueueSnackbar('Failed to submit attendance', { variant: 'error' });
    }
  }

  return (
    <>
      <Container maxWidth={settings.themeStretch ? false : 'lg'}>
        <CustomBreadcrumbs
          heading="List"
          sx={{ marginBottom: 4 }}
          links={[
            {
              name: 'Dashboard',
              href: paths.dashboard.root,
            },
            {
              name: 'Attendance',
              href: paths.dashboard.attendance.root,
            },
            {
              name: 'List',
            },
          ]}
        />

        <Card>
          <AttendanceAddTableToolbar
            setSingleBatchID={setSingleBatchID}
            filters={filters}
            onFilters={handleFilters}
            dateError={dateError}
            serviceOptions={batch.map((option) => option)}
            setTodayDate={setTodayDate}
          />
          <TableContainer sx={{ position: 'relative', overflow: 'unset' }}>
            <Scrollbar>
              <FormProvider {...methods}>
                <Table size={table.dense ? 'small' : 'medium'} sx={{ minWidth: 800 }}>
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
                      ?.slice(
                        table.page * table.rowsPerPage,
                        table.page * table.rowsPerPage + table.rowsPerPage
                      )
                      .map((row) => (
                        <AttendanceAddTableRow
                          key={row.id}
                          row={row}
                          selected={table.selected.includes(row.id)}
                          onSelectRow={() => table.onSelectRow(row.id)}
                          onViewRow={() => handleViewRow(row.id)}
                          onEditRow={() => handleEditRow(row.id)}
                          onDeleteRow={() => handleDeleteRow(row.id)}
                          onAttendanceChange={handleAttendanceChange}
                          responce1={responce1}
                        />
                      ))}
                    <TableEmptyRows
                      height={denseHeight}
                      emptyRows={emptyRows(table.page, table.rowsPerPage, dataFiltered.length)}
                    />
                    <TableNoData notFound={notFound} />
                  </TableBody>
                </Table>
                <Box sx={{ m: '18px', display: 'flex', justifyContent: 'end' }}>
                  <Button
                    variant="contained"
                    type="submit"
                    onClick={() => attendancePost(attendanceData)}
                  >
                    Submit
                  </Button>
                </Box>
              </FormProvider>
            </Scrollbar>
          </TableContainer>
        </Card>
      </Container>

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
    </>
  );
}

// ----------------------------------------------------------------------

function applyFilter({ inputData, comparator, filters, dateError }) {
  const { name, status, service = [], startDate, endDate } = filters;

  if (!inputData) return [];

  const stabilizedThis = inputData.map((el, index) => [el, index]);

  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });

  inputData = stabilizedThis.map((el) => el[0]);

  if (name) {
    inputData = inputData.filter(
      (invoice) =>
        invoice.invoiceNumber.toLowerCase().indexOf(name.toLowerCase()) !== -1 ||
        invoice.invoiceTo.name.toLowerCase().indexOf(name.toLowerCase()) !== -1
    );
  }

  if (status !== 'all') {
    inputData = inputData.filter((invoice) => invoice.status === status);
  }

  // if (service.length) {
  //   inputData = inputData.filter((invoice) =>
  //     invoice.items.some((filterItem) => service.includes(filterItem.service))
  //   );
  // }

  if (!dateError) {
    if (startDate && endDate) {
      inputData = inputData.filter((invoice) => isBetween(invoice.createDate, startDate, endDate));
    }
  }

  return inputData;
}
