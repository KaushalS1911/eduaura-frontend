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

import { useGetSeminar } from 'src/api/seminar';
import SeminarTableToolbar from '../seminar-table-toolbar';
import SeminarTableRow from '../seminar-table-row';
import { Box, Checkbox, FormControl, InputLabel, MenuItem, OutlinedInput, Select, Stack } from '@mui/material';
import { PDFDownloadLink } from '@react-pdf/renderer';
import GenerateOverviewPdf from '../../generate-pdf/generate-overview-pdf';
import CircularProgress from '@mui/material/CircularProgress';
import { useGetConfigs } from '../../../api/config';
import { fDate, fDateTime } from '../../../utils/format-time';
import * as XLSX from 'xlsx';
import { useAuthContext } from '../../../auth/hooks';
import { getResponsibilityValue } from '../../../permission/permission';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'Sr no', label: '#' },
  { id: 'title', label: 'Title' },
  { id: 'description', label: 'Description' },
  { id: 'date', label: 'Date' },
  { id: 'Schedule by', label: 'Schedule by' },
  { id: 'Attended by', label: 'Attended by', align: 'center' },
  { id: '', width: 88 },
];

const defaultFilters = {
  name: '',
  status: 'all',
};
const seminarField = [
  'Title',
  'Description',
  'Seminar Date',
  'Schedule by',
  'Attended by',
];
const fieldMapping = {
  'Title': 'title',
  'Description': 'desc',
  'Seminar Date': 'date_time',
  'Schedule by': 'firstName',
  'Attended by': 'attended_by',
};
// ----------------------------------------------------------------------

export default function SeminarListView() {
  const { enqueueSnackbar } = useSnackbar();
  const table = useTable();
  const { configs } = useGetConfigs();
  const { user } = useAuthContext();
  const settings = useSettingsContext();

  const router = useRouter();

  const confirm = useBoolean();

  const [filters, setFilters] = useState(defaultFilters);
  const [field, setField] = useState([]);
  const { seminars, SeminarError, mutate } = useGetSeminar();
  useEffect(() => {
    if (SeminarError) {
      enqueueSnackbar('Failed to fetch Seminar', { variant: 'error' });
    }
  }, [SeminarError, enqueueSnackbar]);

  const dataFiltered = applyFilter({
    inputData: seminars,
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
    [table],
  );

  // Single Delete
  const handleDeleteRow = useCallback(
    async (_id) => {
      try {
        const URL = `${import.meta.env.VITE_AUTH_API}/api/company/seminar/${_id}`;
        const response = await axios.delete(URL);
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
    [enqueueSnackbar, mutate, confirm],
  );

  const handleEditRow = useCallback(
    (id) => {
      router.push(paths.dashboard.seminar.edit(id));
    },
    [router],
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
  const handleExportExcel = () => {
    let data = dataFiltered.map((seminar) => ({
      Title: seminar.title,
      Description: seminar.desc,
      'Seminar Date': fDateTime(seminar.date_time),
      'Schedule by': seminar.schedule_by.firstName + ' ' + seminar.schedule_by.lastName,
      'Attended by': seminar.attended_by ? seminar.attended_by.map((attendee) => `${attendee.firstName} ${attendee.lastName}`).join(', ') : '-',
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
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Seminar');
    XLSX.writeFile(workbook, 'SeminarList.xlsx');
    setField([]);
  };
  return (
    <>
      <Container maxWidth={settings.themeStretch ? false : 'xl'}>
        <CustomBreadcrumbs
          heading='Seminar '
          links={[
            { name: 'Dashboard', href: paths.dashboard.root },
            { name: 'Seminar', href: paths.dashboard.seminar.list },
          ]}
          action={
            <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, alignItems: 'center', gap: 1 }}>
              {getResponsibilityValue('print_seminar_detail', configs, user) && (<><FormControl
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
                  {seminarField.map((option) => (
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
                          { hed: 'Title', Size: '240px' },
                          {
                            hed: 'Description',
                            Size: '260px',
                          },
                          {
                            hed: 'Seminar Date',
                            Size: '180px',
                          },
                          {
                            hed: 'Schedule by',
                            Size: '180px',
                          },
                          {
                            hed: 'Attended by',
                            Size: '250px',
                          },
                        ].filter((item) => (field.includes(item.hed) || !field.length))}
                        orientation={'landscape'}
                        configs={configs}
                        SubHeading={'Seminar'}
                        fieldMapping={field.length ? extractedData : fieldMapping}
                      />
                    }
                    fileName={'Seminar'}
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
                </Button></>)}

              {getResponsibilityValue('create_seminar', configs, user) && <Button
                component={RouterLink}
                href={paths.dashboard.seminar.new}
                variant='contained'
                startIcon={<Iconify icon='mingcute:add-line' />}
              >
                New Seminar
              </Button>}
            </Box>
          }
          sx={{
            mb: { xs: 3, md: 5 },
          }}
        />

        <Card>
          <SeminarTableToolbar filters={filters} onFilters={handleFilters} />

          <TableContainer sx={{ position: 'relative', overflow: 'unset' }}>
            <TableSelectedAction
              dense={table.dense}
              numSelected={table.selected.length}
              rowCount={dataFiltered.length}
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
                />

                <TableBody>
                  {dataFiltered
                    .slice(
                      table.page * table.rowsPerPage,
                      table.page * table.rowsPerPage + table.rowsPerPage,
                    )
                    .map((row, index) => (
                      <SeminarTableRow
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
        title='Delete'
        content={
          <>
            Are you sure you want to delete <strong>{table.selected.length}</strong> items?
          </>
        }
        action={
          <Button variant='contained' color='error'>
            Delete
          </Button>
        }
      />
    </>
  );
}

// ----------------------------------------------------------------------

function applyFilter({
                       inputData, comparator, filters,
                     }
  ,
) {
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
      (user) => user.title.toLowerCase().indexOf(name.toLowerCase()) !== -1,
    );
  }

  if (status !== 'all') {
    inputData = inputData.filter((order) => order.status === status);
  }

  return inputData;
}
