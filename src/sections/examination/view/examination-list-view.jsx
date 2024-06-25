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
  alpha,
} from '@mui/material';

import { paths } from 'src/routes/paths';
import { useAuthContext } from 'src/auth/hooks';
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

import { useGetExpense } from 'src/api/expense';
import ExaminationTableRow from '../examination-table-row';
import ExaminationTableToolbar from '../examination-table-toolbar';
import ExaminationTableFiltersResult from '../examination-table-filters-result';
import { useGetExam } from 'src/api/examination';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'srNo', label: 'SrNo' },
  { id: 'faculty', label: 'Faculty' },
  { id: 'exam', label: 'Exam' },
  { id: 'description', label: 'Detail' },
  { id: 'total marks', label: 'Marks' },
  { id: 'date', label: 'Date' },
  // { id: 'amount', label: 'Amount', width: 320 },
  { id: '', width: 88 },
];

const defaultFilters = {
  name: '',
  role: [],
  status: 'all',
};

// ----------------------------------------------------------------------

export default function ExpenseListView() {
  const { user } = useAuthContext();
  const { enqueueSnackbar } = useSnackbar();
  const table = useTable();
  const settings = useSettingsContext();
  const router = useRouter();
  const confirm = useBoolean();
  const [tableData, setTableData] = useState([]);
  const [filters, setFilters] = useState(defaultFilters);
  const { exam, mutate } = useGetExam(user?.company_id);

  useEffect(() => {
    if (exam) {
      setTableData(exam);
    }
  }, [exam]);
  const handleDeleteRow = useCallback(
    async (id) => {
      try {
        const response = await axios.delete(
          `https://admin-panel-dmawv.ondigitalocean.app/api/company/exam/${id}`,
          { data: { ids: id } }
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
    [enqueueSnackbar, mutate, table, tableData]
  );

  const handleDeleteRows = useCallback(async () => {
    try {
      const selectedIdsArray = [...table.selected];
      const response = await axios.delete(
        `https://admin-panel-dmawv.ondigitalocean.app/api/company/exam`,
        { data: { ids: selectedIdsArray } }
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
      console.error('Failed to delete examination', error);
      enqueueSnackbar('Failed to delete examination', { variant: 'error' });
    }
  }, [enqueueSnackbar, mutate, table, confirm]);

  const dataFiltered = applyFilter({
    inputData: tableData,
    comparator: getComparator(table.order, table.orderBy),
    filters,
  });

  const dataInPage = dataFiltered.slice(
    table.page * table.rowsPerPage,
    table.page * table.rowsPerPage + table.rowsPerPage
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
    [table]
  );

  const handleResetFilters = useCallback(() => {
    setFilters(defaultFilters);
  }, []);

  const handleEditRow = useCallback(
    (id) => {
      router.push(paths.dashboard.examination.edit(id));
    },
    [router]
  );

  const handleFilterStatus = useCallback(
    (event, newValue) => {
      handleFilters('status', newValue);
    },
    [handleFilters]
  );

  const handleViewRow = useCallback(
    (id) => {
      router.push(paths.dashboard.examination.edit(id));
    },
    [router]
  );

  return (
    <>
      <Container maxWidth={settings.themeStretch ? false : 'lg'}>
        <CustomBreadcrumbs
          heading="Exams"
          links={[
            { name: 'Dashboard', href: paths.dashboard.root },
            { name: 'Exams', href: paths.dashboard.examination.root },
          ]}
          action={
            <Button
              component={RouterLink}
              href={paths.dashboard.examination.new}
              variant="contained"
              startIcon={<Iconify icon="mingcute:add-line" />}
            >
              New Exam
            </Button>
          }
          sx={{
            mb: { xs: 3, md: 5 },
          }}
        />

        <Card>
          <ExaminationTableToolbar
            filters={filters}
            onFilters={handleFilters}
            roleOptions={_roles}
          />

          {canReset && (
            <ExaminationTableFiltersResult
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
                  dataFiltered.map((row) => row._id)
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
                  //     dataFiltered.map((row) => row._id)
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
                      <ExaminationTableRow
                        key={row._id}
                        mutate={mutate}
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

function applyFilter({ inputData, comparator, filters }) {
  const { name, status, role } = filters;

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
        user.title.toLowerCase().indexOf(name.toLowerCase()) !== -1 ||
        user.conducted_by.firstName.toLowerCase().indexOf(name.toLowerCase()) !== -1 ||
        user.conducted_by.lastName.toLowerCase().indexOf(name.toLowerCase()) !== -1 ||
        user.desc.toLowerCase().indexOf(name.toLowerCase()) !== -1
    );
  }

  if (status !== 'all') {
    inputData = inputData.filter((user) => user.status === status);
  }

  if (role.length) {
    inputData = inputData.filter((user) => role.includes(user.role));
  }

  return inputData;
}
