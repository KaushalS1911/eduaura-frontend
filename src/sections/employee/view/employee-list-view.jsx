import isEqual from 'lodash/isEqual';
import { useState, useCallback } from 'react';
import {
  Card,
  Table,
  Button,
  Tooltip,
  Container,
  TableBody,
  IconButton,
  TableContainer,
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

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: '', label: '#' },
  { id: 'name', label: 'Name' },
  { id: 'contact', label: 'Phone Number', width: 180 },
  { id: 'technology', label: 'Technology', width: 220 },
  { id: 'role', label: 'Role', width: 180 },
  { id: 'joiningDate', label: 'Joining Date', width: 120 },
  { id: 'dob', label: 'Birth Date', width: 100 },
  { id: '', width: 100 },
];

const defaultFilters = {
  name: '',
  role: [],
  status: 'all',
};

// ----------------------------------------------------------------------

export default function EmployeeListView() {
  const { user } = useAuthContext();
  const { enqueueSnackbar } = useSnackbar();
  const table = useTable();
  const settings = useSettingsContext();
  const router = useRouter();
  const confirm = useBoolean();
  const { employees, mutate } = useGetEmployees();
  const [filters, setFilters] = useState(defaultFilters);

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
    [table]
  );

  const handleResetFilters = useCallback(() => {
    setFilters(defaultFilters);
  }, []);

  // Single Delete
  const handleDeleteRow = useCallback(
    async (_id) => {
      try {
        const URL = `${import.meta.env.VITE_AUTH_API}/api/company/${user.company_id}/${_id}/deleteEmployee`;
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
    [enqueueSnackbar, mutate, confirm,user.company_id]
  );

  // Multiple Delete
  const handleDeleteRows = useCallback(async () => {
    try {
      const URL = `${import.meta.env.VITE_AUTH_API}/api/company/${user.company_id}/delete/all-employee`;

      const sortedSelectedIds = [...table.selected].sort();
      await Promise.all(
        sortedSelectedIds.map(async (selectedId) => {
          const response = await axios.delete(URL,{data: { ids: [selectedId] }});
          if (response.status === 200) {
            enqueueSnackbar(response.data.data.message, { variant: 'success' });
            mutate();
            confirm.onFalse();
          } else {
            enqueueSnackbar(response.data.message, { variant: 'error' });
          }
        })
      );
    } catch (error) {
      console.error('Failed to delete Employee', error);
      enqueueSnackbar('Failed to delete Employee', { variant: 'error' });
    }
  }, [enqueueSnackbar, mutate, confirm, table.selected, user.company_id]);

  const handleEditRow = useCallback(
    (id) => {
      router.push(paths.dashboard.employee.edit(id));
    },
    [router]
  );

  return (
    <>
      <Container maxWidth={settings.themeStretch ? false : 'lg'}>
        <CustomBreadcrumbs
          heading="List"
          links={[
            { name: 'Dashboard', href: paths.dashboard.root },
            { name: 'Employee', href: paths.dashboard.employee.list },
            { name: 'Employee' },
          ]}
          action={
            <Button
              component={RouterLink}
              href={paths.dashboard.employee.new}
              variant="contained"
              startIcon={<Iconify icon="mingcute:add-line" />}
            >
              New Employee
            </Button>
          }
          sx={{ mb: { xs: 3, md: 5 } }}
        />

        <Card>
          <EmployeeTableToolbar filters={filters} onFilters={handleFilters} roleOptions={_roles} />

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
                  // onSort={table.onSort}
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
        user.firstName.toLowerCase().indexOf(name.toLowerCase()) !== -1 ||
        user.email.toLowerCase().indexOf(name.toLowerCase()) !== -1
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
