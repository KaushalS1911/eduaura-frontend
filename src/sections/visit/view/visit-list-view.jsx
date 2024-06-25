import isEqual from 'lodash/isEqual';
import { useState, useCallback, useEffect } from 'react';
import axios from 'axios';

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

import { paths } from 'src/routes/paths';
import { useAuthContext } from 'src/auth/hooks';
import { useRouter } from 'src/routes/hooks';
import { RouterLink } from 'src/routes/components';
import { useBoolean } from 'src/hooks/use-boolean';
import { _expenses } from 'src/_mock';

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
import VisitTableRow from '../visit-table-row';
import VisitTableToolbar from '../visit-table-toolbar';
import VisitTableFiltersResult from '../visit-table-filters-result';
import { useGetVisits } from 'src/api/visit';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'srNo', label: 'Sr No', width: 150 },
  { id: 'name', label: 'Name' },
  { id: 'contact', label: 'Contact', width: 230 },
  { id: 'reference', label: 'Reference', width: 230 },
  { id: 'notes', label: 'Notes', width: 230 },
  { id: 'address', label: 'Address', width: 230 },
  { id: '' },
];

const defaultFilters = {
  name: '',
  role: [],
  status: 'all',
};

// ----------------------------------------------------------------------

export default function VisitListView() {
  const { user } = useAuthContext();
  const { enqueueSnackbar } = useSnackbar();
  const table = useTable();
  const settings = useSettingsContext();
  const router = useRouter();
  const confirm = useBoolean();
  const { visit, mutate } = useGetVisits();
  const [tableData, setTableData] = useState([]);
  const [filters, setFilters] = useState(defaultFilters);

  useEffect(() => {
    if (visit) {
      setTableData(visit);
    }
  }, [visit]);

  const handleDeleteRow = useCallback(
    async (id) => {
      try {
        const response = await axios.delete(
          `https://admin-panel-dmawv.ondigitalocean.app/api/v2/visit`,
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
        enqueueSnackbar('Failed to delete visit', { variant: 'error' });
      }
    },
    [enqueueSnackbar, mutate, table, tableData]
  );

  const handleDeleteRows = useCallback(async () => {
    try {
      const selectedIdsArray = [...table.selected];
      const response = await axios.delete(
        `https://admin-panel-dmawv.ondigitalocean.app/api/v2/visit`,
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
      console.error('Failed to delete Visit', error);
      enqueueSnackbar('Failed to delete Visit', { variant: 'error' });
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
      router.push(paths.dashboard.visit.edit(id));
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
      router.push(paths.dashboard.visit.edit(id));
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
            { name: 'Visit', href: paths.dashboard.visit.root },
            { name: 'List' },
          ]}
          action={
            <Button
              component={RouterLink}
              href={paths.dashboard.visit.new}
              variant="contained"
              startIcon={<Iconify icon="mingcute:add-line" />}
            >
              New Visit
            </Button>
          }
          sx={{
            mb: { xs: 3, md: 5 },
          }}
        />

        <Card>
          <VisitTableToolbar filters={filters} onFilters={handleFilters} roleOptions={_expenses} />

          {canReset && (
            <VisitTableFiltersResult
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
              // onSelectAllRows={(checked) =>
              //   table.onSelectAllRows(
              //     checked,
              //     dataFiltered.map((row) => row._id)
              //   )
              // }
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
                      <VisitTableRow
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
        user.lastName.toLowerCase().indexOf(name.toLowerCase()) !== -1 ||
        user.reference.toLowerCase().indexOf(name.toLowerCase()) !== -1
    );
  }

  if (status !== 'all') {
    inputData = inputData.filter((user) => user.status === status);
  }

  if (role.length) {
    inputData = inputData.filter((user) => role.includes(user.type));
  }

  return inputData;
}
