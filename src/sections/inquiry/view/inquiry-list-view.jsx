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
// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'Sr no', label: 'Sr No' },
  { id: 'studentName', label: 'Student Name' },
  { id: 'appointment', label: 'Appointment' },
  { id: 'contact', label: 'Contact', align: 'center' },
  { id: 'email', label: 'Email', align: 'center' },
  { id: 'demo', label: 'Demo', align: 'center' },
  { id: '', width: 88 },
];

const defaultFilters = {
  name: '',
  status: 'all',
};

// ----------------------------------------------------------------------

export default function InquiryListView() {
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
    [table]
  );

  // Single Delete
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
    [enqueueSnackbar, mutate, confirm]
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
    [table.selected, enqueueSnackbar, mutate, confirm]
  );

  const handleEditRow = useCallback(
    (id) => {
      router.push(paths.dashboard.inquiry.edit(id));
    },
    [router]
  );

  return (
    <>
      <Container maxWidth={settings.themeStretch ? false : 'lg'}>
        <CustomBreadcrumbs
          heading="Inquiry List"
          links={[
            { name: 'Dashboard', href: paths.dashboard.root },
            { name: 'Inquiry', href: paths.dashboard.inquiry.list },
            { name: 'Inquiry' },
          ]}
          action={
            <Button
              component={RouterLink}
              href={paths.dashboard.inquiry.new}
              variant="contained"
              startIcon={<Iconify icon="mingcute:add-line" />}
            >
              New Inquiry
            </Button>
          }
          sx={{
            mb: { xs: 3, md: 5 },
          }}
        />

        <Card>
          <InquiryTableToolbar filters={filters} onFilters={handleFilters} />

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
        title="Delete"
        content={
          <>
            Are you sure you want to delete <strong>{table.selected.length}</strong> items?
          </>
        }
        action={
          <Button variant="contained" color="error" onClick={handleDeleteRows}>
            Delete
          </Button>
        }
      />
    </>
  );
}

// ----------------------------------------------------------------------

function applyFilter({ inputData, comparator, filters }) {
  const { status, name } = filters;

  const stabilizedThis = inputData.map((el, index) => [el, index]);

  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });

  inputData = stabilizedThis.map((el) => el[0]);

  if (name) {
    inputData = inputData.filter(
      (user) => user.firstName.toLowerCase().indexOf(name.toLowerCase()) !== -1
    );
  }

  if (status !== 'all') {
    inputData = inputData.filter((order) => order.status === status);
  }

  return inputData;
}
