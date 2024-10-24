import { useState, useCallback } from 'react';
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
import { isAfter, isBetween } from 'src/utils/format-time';
import { INVOICE_SERVICE_OPTIONS } from 'src/_mock';
import Label from 'src/components/label';
import Scrollbar from 'src/components/scrollbar';
import { useSnackbar } from 'src/components/snackbar';
import { useSettingsContext } from 'src/components/settings';
import {
  useTable,
  emptyRows,
  TableNoData,
  getComparator,
  TableEmptyRows,
  TableHeadCustom,
  TablePaginationCustom,
} from 'src/components/table';

// ----------------------------------------------------------------------

import StudentAssignmentTableRow from './student-assignment-table-row';
import StudentAssignmentTableToolbar from './student-assignment-table-toolbar';
import StudentAssignmentTableFiltersResult from './student-assignment-table-filters-result';

const TABLE_HEAD = [
  { id: '', label: 'Sr no.' },
  { id: 'Title', label: 'Title' },
  { id: 'Description', label: 'Description' },
  { id: 'Date', label: 'Date' },
  { id: 'status', label: 'Status' },
  { id: 'remarks', label: 'remarks' },
];

const defaultFilters = {
  name: '',
  service: [],
  status: 'all',
  startDate: null,
  endDate: null,
};

// ----------------------------------------------------------------------

export default function StudentAssignmentListView({ assignmentData }) {
  const { enqueueSnackbar } = useSnackbar();
  const theme = useTheme();
  const settings = useSettingsContext();
  const router = useRouter();
  const table = useTable({ defaultOrderBy: 'createDate' });
  const [tableData, setTableData] = useState(assignmentData);
  const [filters, setFilters] = useState(defaultFilters);
  const dateError = isAfter(filters.startDate, filters.endDate);

  const dataFiltered = applyFilter({
    inputData: assignmentData,
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

  const TABS = [
    { value: 'all', label: 'All', color: 'default', count: tableData.length },
    {
      value: 'Completed',
      label: 'Completed',
      color: 'success',
      count: getInvoiceLength('Completed'),
    },
    {
      value: 'Pending',
      label: 'Pending',
      color: 'warning',
      count: getInvoiceLength('Pending'),
    },
    {
      value: 'Not Completed',
      label: 'Not Completed',
      color: 'error',
      count: getInvoiceLength('Not Completed'),
    },
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

  return (
    <>
      <Container maxWidth={settings.themeStretch ? false : 'lg'}>
        <Card>
          <Tabs
            value={filters.status}
            onChange={handleFilterStatus}
            sx={{
              px: 2.5,
              boxShadow: `inset 0 -2px 0 0 ${alpha(theme.palette.grey[500], 0.08)}`,
            }}
          >
            {TABS.map((tab) => (
              <Tab
                key={tab.value}
                value={tab.value}
                label={tab.label}
                iconPosition='end'
                icon={
                  <Label
                    variant={
                      ((tab.value === 'all' || tab.value === filters.status) && 'filled') || 'soft'
                    }
                    color={tab.color}
                  >
                    {['Completed', 'Pending', 'Not Completed'].includes(tab.value)
                      ? assignmentData.filter((user) => user.status === tab.value).length
                      : assignmentData.length}
                  </Label>
                }
              />
            ))}
          </Tabs>
          <StudentAssignmentTableToolbar
            filters={filters}
            onFilters={handleFilters}
            dateError={dateError}
            serviceOptions={INVOICE_SERVICE_OPTIONS.map((option) => option.name)}
          />
          {canReset && (
            <StudentAssignmentTableFiltersResult
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
                      <StudentAssignmentTableRow
                        key={row._id}
                        index={index}
                        row={row}
                        selected={table.selected.includes(row._id)}
                        onSelectRow={() => table.onSelectRow(row._id)}
                        onViewRow={() => handleViewRow(row._id)}
                        onEditRow={() => handleEditRow(row._id)}
                        onDeleteRow={() => handleDeleteRow(row._id)}
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
  const { startDate, endDate, status } = filters;

  if (!dateError) {
    if (startDate && endDate) {
      inputData = inputData.filter((invoice) => isBetween(invoice.assignmentdata.date, startDate, endDate));
    }
  }
  if (status !== 'all') {
    inputData = inputData.filter((item) => item.status === status);
  }

  return inputData;
}
