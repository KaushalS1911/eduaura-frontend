import React, { useCallback, useState } from 'react';
import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import TableRow from '@mui/material/TableRow';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import CardHeader from '@mui/material/CardHeader';
import TableContainer from '@mui/material/TableContainer';
import TablePagination from '@mui/material/TablePagination';
import { fCurrency } from 'src/utils/format-number';
import Scrollbar from 'src/components/scrollbar';
import { emptyRows, getComparator, TableEmptyRows, TableHeadCustom, TableNoData, useTable } from 'src/components/table';
import { fDate, isAfter, isBetween } from 'src/utils/format-time';
import CustomPopover, { usePopover } from 'src/components/custom-popover';
import Iconify from '../../../components/iconify';
import { Grid, ListItemText, MenuItem, Stack, TextField } from '@mui/material';
import { PDFDownloadLink } from '@react-pdf/renderer';
import GenerateOverviewPDF from '../../generate-pdf/generate-overview-pdf';
import Tooltip from '@mui/material/Tooltip';
import CircularProgress from '@mui/material/CircularProgress';
import AttendanceTableToolbar from '../../attendance/attendance-table-toolbar';
import { INVOICE_SERVICE_OPTIONS } from '../../../_mock';
import OverdueTableRow from './overdue-table-row';
import OverdueTableToolbar from './overdue-table-toolbar';
import AttendanceTableFiltersResult from '../../attendance/attendance-table-filters-result';
import OverdueTableFiltersResult from './overdue-table-filters-result';
import GenerateOverviewPdf from '../../generate-pdf/generate-overview-pdf';
import { useGetConfigs } from '../../../api/config';
import * as XLSX from 'xlsx';

const defaultFilters = {
  startDay: '',
  endDay: '',
};

const fieldMapping = {
  'Name': 'firstName',
  'Fee': 'fee_detail.installments.amount',
  'Contact': 'contact',
  'Installment Date': 'fee_detail',
};
export default function OverdueListView({ title, subheader, tableData, tableLabels, ...other }) {
  const [page, setPage] = useState(0);
  const table = useTable({ defaultOrderBy: 'createDate' });
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const { configs } = useGetConfigs();
  const [field, setField] = useState([]);
  const [filters, setFilters] = useState(defaultFilters);

  const canReset = (!!filters.startDay && !!filters.endDay);

  const dayError = isAfter(filters.startDay, filters.endDay);
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };
  const dataFiltered = applyFilter({
    inputData: tableData,
    filters,
    dayError,
  });
  const notFound = (!dataFiltered.length && canReset) || !dataFiltered.length;
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

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
  const handleExportExcel = () => {
    let data = dataFiltered.map((overdue) => ({
      Name: overdue.firstName + ' ' + overdue.lastName,
      Fee: overdue.fee_detail.installments.amount,
      'Contact': overdue.contact,
      Installment: fDate(overdue.fee_detail.installments.installment_date)
    }));
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Employee');
    XLSX.writeFile(workbook, 'EmployeeList.xlsx');
  };
  const dataInPage = dataFiltered.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  return (
    <Card {...other}>
      <CardHeader title={
        <Box>

          <Box display='flex' justifyContent='space-between' alignItems='center'>
            <Grid container spacing={2} alignItems='center' justifyContent='space-between'>
              <Grid item>
                <span>{title}</span>
              </Grid>
              <Grid item xs={12} sm={5} md={4}>
                <Box sx={{display: "flex",alignItems: "center",justifyContent: "space-between"}}>
                <OverdueTableToolbar
                  filters={filters}
                  onFilters={handleFilters}
                />
                {/*<Stack direction='row' spacing={1} flexGrow={1} mx={1} alignItems={"center"} justifyContent={"space-around"}>*/}
                  <PDFDownloadLink
                    document={
                      <GenerateOverviewPdf
                        allData={dataFiltered}
                        heading={[
                          { hed: 'Name', Size: '240px' },
                          {
                            hed: 'Fee',
                            Size: '260px',
                          },
                          {
                            hed: 'Contact',
                            Size: '180px',
                          },
                          {
                            hed: 'Installment Date',
                            Size: '180px',
                          }].filter((item) => (field.includes(item.hed) || !field.length))}
                        orientation={'landscape'}
                        configs={configs}
                        SubHeading={'Overdue'}
                        fieldMapping={fieldMapping}
                      />
                    }
                    fileName={'Overdue'}
                    style={{ textDecoration: 'none' }}
                  >
                    {({ loading }) => (
                      <Tooltip title='Export to PDF'>
                        {loading ? (
                          <CircularProgress size={24} />
                        ) : (
                          <Iconify
                            icon='eva:cloud-download-fill'
                            // onClick={() => setField([])}
                            sx={{ width: 30, height: 30, color: '#637381', mt: 1 }}
                          />
                        )}

                      </Tooltip>
                    )}
                  </PDFDownloadLink>
                  <Tooltip title='Export to Excel'>
                    <Iconify icon='icon-park-outline:excel' width={24} height={24} color={'#637381'} onClick={handleExportExcel} sx={{cursor: "pointer"}}/>
                  </Tooltip>
                {/*</Stack>*/}
                </Box>
              </Grid>
            </Grid>
          </Box>
          {canReset && (
            <OverdueTableFiltersResult
              filters={filters}
              onFilters={handleFilters}
              onResetFilters={handleResetFilters}
              results={dataFiltered.length}
              sx={{ p: 2.5, pt: 0 }}
            />
          )}
        </Box>
      } subheader={subheader} sx={{ mb: 3 }} />

      <TableContainer sx={{ overflow: 'unset' }}>
        <Scrollbar>
          <Table sx={{ minWidth: 680 }} size={table.dense ? 'small' : 'medium'}>
            <TableHeadCustom
              order={table.order}
              orderBy={table.orderBy}
              headLabel={tableLabels}
              rowCount={dataFiltered.length}
              numSelected={table.selected.length}
              onSort={table.onSort}
            />

            <TableBody>
              {dataInPage.map((row, index) => (
                <OverdueTableRow key={row.id} row={row} index={page * rowsPerPage + index} />
              ))}

              <TableNoData notFound={notFound} />
            </TableBody>
          </Table>
        </Scrollbar>
      </TableContainer>

      <TablePagination
        rowsPerPageOptions={[5]}
        component='div'
        count={tableData.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />

      <Divider sx={{ borderStyle: 'dashed' }} />

    </Card>
  );
}

OverdueListView.propTypes = {
  subheader: PropTypes.string,
  tableData: PropTypes.array,
  tableLabels: PropTypes.array,
  title: PropTypes.string,
};

// ----------------------------------------------------------------------

function applyFilter({ inputData, filters, dayError }) {
  const { startDay, endDay } = filters;

  if (!dayError) {
    if (startDay && endDay) {
      inputData = inputData.filter((product) => isBetween(product.fee_detail.installments.installment_date, startDay, endDay));
    }
  }

  return inputData;
}

OverdueListView.propTypes = {
  row: PropTypes.object.isRequired,
  index: PropTypes.number.isRequired,
};
