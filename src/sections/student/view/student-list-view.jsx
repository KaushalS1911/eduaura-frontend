import isEqual from 'lodash/isEqual';
import { useState, useCallback } from 'react';
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
import StudentTableRow from '../student-table-row';
import StudentTableToolbar from '../student-table-toolbar';
import StudentTableFiltersResult from '../student-table-filters-result';
import { useGetStudents } from '../../../api/student';
import axios from 'axios';
import { LoadingScreen } from '../../../components/loading-screen';
import { isAfter, isBetween } from '../../../utils/format-time';
import { useAuthContext } from '../../../auth/hooks';
import { useGetBatches } from '../../../api/batch';

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
  Batch: [],
};

// ----------------------------------------------------------------------

export default function StudentListView() {
  const { enqueueSnackbar } = useSnackbar();
  const table = useTable();
  const settings = useSettingsContext();
  const router = useRouter();
  const confirm = useBoolean();
  const { user } = useAuthContext();
  const { batch } = useGetBatches(`${user?.company_id}`);
  const { students, studentsLoading, mutate } = useGetStudents();
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

  const dateError = isAfter(filters.startDate, filters.endDate);

  return (
    <>
      {studentsLoading ? <LoadingScreen /> : <Container maxWidth={settings.themeStretch ? false : 'lg'}>
        <CustomBreadcrumbs
          heading='List'
          links={[
            { name: 'Dashboard', href: paths.dashboard.root },
            { name: 'Student', href: paths.dashboard.student.list },
          ]}
          action={
            <Button
              component={RouterLink}
              href={paths.dashboard.student.new}
              variant='contained'
              startIcon={<Iconify icon='mingcute:add-line' />}
            >
              New Student
            </Button>
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
                  <Label
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
                }
              />
            ))}
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
      </Container>}
      <ConfirmDialog
        open={confirm.value}
        onClose={confirm.onFalse}
        title='Delete Student'
        content={
          <>
            Are you sure want to delete <strong> {table.selected.length} </strong> student?
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
}

// ----------------------------------------------------------------------

function applyFilter({ inputData, comparator, filters, dateError }) {
  const { name, status, gender, endDate, startDate } = filters;

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
        (user.firstName && user.firstName.toLowerCase().includes(name.toLowerCase())) ||
        (user.contact && user.contact.toLowerCase().includes(name.toLowerCase())) ||
        (user.email && user.email.toLowerCase().includes(name.toLowerCase())) ||
        (user.lastName && user.lastName.toLowerCase().includes(name.toLowerCase())),
    );
  }
  if (gender.length) {
    inputData = inputData.filter((user) => gender.includes(user?.gender));
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
