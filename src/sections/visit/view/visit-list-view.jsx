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
  TableContainer, Checkbox, MenuItem, OutlinedInput, Select, InputLabel, FormControl, Stack, Box,
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
import { fDate, isAfter, isBetween } from '../../../utils/format-time';
import * as XLSX from 'xlsx';
import { PDFDownloadLink } from '@react-pdf/renderer';
import GenerateOverviewPdf from '../../generate-pdf/generate-overview-pdf';
import { useGetConfigs } from '../../../api/config';
import CircularProgress from '@mui/material/CircularProgress';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'srNo', label: '#', align: 'center' },
  { id: 'name', label: 'Name' },
  { id: 'contact', label: 'Contact' },
  { id: 'reference', label: 'Reference' },
  { id: 'notes', label: 'Notes' },
  { id: 'address', label: 'Address' },
  { id: '', align: 'center' },
];

const defaultFilters = {
  name: '',
  role: [],
  status: 'all',
  startDate: null,
  endDate: null,
};

// ----------------------------------------------------------------------

export default function VisitListView() {
  const { configs } = useGetConfigs();
  const { user } = useAuthContext();
  const { enqueueSnackbar } = useSnackbar();
  const table = useTable();
  const settings = useSettingsContext();
  const router = useRouter();
  const confirm = useBoolean();
  const { visit, mutate } = useGetVisits();
  const [field, setField] = useState([]);
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
        enqueueSnackbar('Failed to delete visit', { variant: 'error' });
      }
    },
    [enqueueSnackbar, mutate, table, tableData],
  );

  const handleDeleteRows = useCallback(async () => {
    try {
      const selectedIdsArray = [...table.selected];
      const response = await axios.delete(
        `https://admin-panel-dmawv.ondigitalocean.app/api/v2/visit`,
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
      router.push(paths.dashboard.visit.edit(id));
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
      router.push(paths.dashboard.visit.edit(id));
    },
    [router],
  );

  const dateError = isAfter(filters.startDate, filters.endDate);

  const fieldMapping = {
    'Name': 'firstName',
    'Contact No.': 'contact',
    'Contact Person': 'contact_person',
    'Reference': 'reference',
    'Notes': 'notes',
    'Address_': 'address',
  };

  const guardianinfo = (guardianData, row) => {
    const fatherContact = row.guardian_detail
      .find(data => data.relation_type === 'Father')?.contact;
    const firstGuardianContact = row.guardian_detail[0]?.contact;
    return fatherContact || firstGuardianContact || '-';
  };

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

  const VisitField = ['Name', 'Contact No.', 'Contact Person', 'Reference', 'Address_', 'Notes'];
  const handleExportExcel = () => {
    let data = dataFiltered.map((visit) => ({
      Name: visit.firstName + ' ' + visit.lastName,
      'Contact No.': visit.contact,
      Notes: visit.notes,
      'Contact Person': visit.contact_person.firstName + ' ' + visit.contact_person.lastName,
      Reference: visit.reference,
      'Address_': visit.address,
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
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Visit');
    XLSX.writeFile(workbook, 'VisitList.xlsx');
    setField([]);
  };

  return (
    <>
      <Container maxWidth={settings.themeStretch ? false : 'lg'}>
        <CustomBreadcrumbs
          heading='Visits'
          links={[
            { name: 'Dashboard', href: paths.dashboard.root },
            { name: 'Visit', href: paths.dashboard.visit.root },
            { name: 'List' },
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
                  {VisitField.map((option) => (
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
                        { hed: 'Name', Size: '240px' },
                        {
                          hed: 'Contact No.'
                          , Size: '180px',
                        },
                        {
                          hed: 'Contact Person',
                          Size: '180px',
                        },
                        {
                          hed: 'Reference',
                          Size: '180px',
                        },
                        {
                          hed: 'Notes',
                          Size: '200px',
                        },
                        {
                          hed: 'Address_',
                          Size: '100%',
                        },
                      ].filter((item) => (field.includes(item.hed) || !field.length))}
                      orientation={'landscape'}
                      configs={configs}
                      SubHeading={'Visits'}
                      fieldMapping={field.length ? extractedData : fieldMapping}
                    />
                  }
                  fileName={'Visits'}
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
              </Button>
              <Button
                component={RouterLink}
                href={paths.dashboard.visit.new}
                variant='contained'
                startIcon={<Iconify icon='mingcute:add-line' />}
              >
                New Visit
              </Button>
            </Box>
          }
          sx={{
            mb: { xs: 3, md: 5 },
          }}
        />
        <Card>
          <VisitTableToolbar filters={filters} onFilters={handleFilters} roleOptions={_expenses}
                             dateError={dateError} />
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

function applyFilter({
                       inputData, comparator, dateError, filters,
                     },
) {
  const { startDate, name, status, role, endDate } = filters;

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
        user.reference.toLowerCase().indexOf(name.toLowerCase()) !== -1,
    );
  }
  if (status !== 'all') {
    inputData = inputData.filter((user) => user.status === status);
  }
  if (role.length) {
    inputData = inputData.filter((user) => role.includes(user.type));
  }
  if (!dateError) {
    if (startDate && endDate) {
      inputData = inputData.filter((order) => isBetween(order.createdAt, startDate, endDate));
    }
  }
  return inputData;
}
