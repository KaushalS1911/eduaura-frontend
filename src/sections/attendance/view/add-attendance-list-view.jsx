import { useForm, FormProvider } from 'react-hook-form';
import { useState, useEffect, useCallback } from 'react';

import { Box } from '@mui/system';
import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import TableBody from '@mui/material/TableBody';
import { useTheme } from '@mui/material/styles';
import TableContainer from '@mui/material/TableContainer';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { useBoolean } from 'src/hooks/use-boolean';

import { isAfter, isBetween } from 'src/utils/format-time';

import { useAuthContext } from 'src/auth/hooks';
import { GetAttendanceAdd } from 'src/api/attendance';
import { useGetBatches, useGetSingleBatches } from 'src/api/batch';

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
} from 'src/components/table';

import AttendanceAddTableRow from '../attendance-add-table-row';
import AttendanceAddTableToolbar from '../attendance-add-table-toolbar';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'srNo', label: '#' },
  { id: 'studentName', label: 'Name' },
  { id: 'contact', label: 'Contact' },
  { id: 'email', label: 'Email' },
  { id: 'status', label: 'Options' },
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
    table.page * table.rowsPerPage + table.rowsPerPage,
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
    [table],
  );

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

  // ====================================
  const { user } = useAuthContext();
  const [todayDate, setTodayDate] = useState();
  const [attendanceData, setAttendanceData] = useState([]);
  const [response, setResponse] = useState({ status: null });

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
      company_id: user?.company_id,
    };

    // Add the new record to the filtered data
    setAttendanceData([...filteredData, student]);
  };

  async function attendancePost(data) {
    try {
      const res = await GetAttendanceAdd(data);
      if (res && res.status === 200) {
        setResponse(res);
        enqueueSnackbar('Attendance submitted successfully!', { variant: 'success' });
        router.push(paths.dashboard.attendance.root);
      } else {
        throw new Error('Failed to submit attendance');
      }
    } catch (error) {
      setResponse(null);
      enqueueSnackbar('Failed to submit attendance', { variant: 'error' });
    }
  }

  return (
    <>
      <Container maxWidth={settings.themeStretch ? false : 'lg'}>
        <CustomBreadcrumbs
          heading='Add Attendance'
          sx={{ marginBottom: 4 }}
          links={[
            {
              name: 'Dashboard',
              href: paths.dashboard.root,
            },
            {
              name: 'Add Attendance',
              href: paths.dashboard.attendance.root,
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

                      ?.map((row, index) => (
                        <AttendanceAddTableRow
                          key={row.id}
                          index={index}
                          row={row}
                          selected={table.selected.includes(row.id)}
                          onSelectRow={() => table.onSelectRow(row.id)}
                          onViewRow={() => handleViewRow(row.id)}
                          onEditRow={() => handleEditRow(row.id)}
                          onDeleteRow={() => handleDeleteRow(row.id)}
                          onAttendanceChange={handleAttendanceChange}
                          response={response}
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
                    variant='contained'
                    type='submit'
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
        invoice.invoiceTo.name.toLowerCase().indexOf(name.toLowerCase()) !== -1,
    );
  }

  if (status !== 'all') {
    inputData = inputData.filter((invoice) => invoice.status === status);
  }

  if (!dateError) {
    if (startDate && endDate) {
      inputData = inputData.filter((invoice) => isBetween(invoice.createDate, startDate, endDate));
    }
  }

  return inputData;
}
