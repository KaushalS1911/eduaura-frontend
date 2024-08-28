import { useState } from 'react';
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
import { TableHeadCustom } from 'src/components/table';
import { fDate } from 'src/utils/format-time';
import CustomPopover, { usePopover } from 'src/components/custom-popover';
import Iconify from '../../components/iconify';
import { ListItemText, MenuItem } from '@mui/material';

export default function AccountNewInvoice({ title, subheader, tableData, tableLabels, ...other }) {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const dataInPage = tableData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  return (
    <Card {...other}>
      <CardHeader title={title} subheader={subheader} sx={{ mb: 3 }} />

      <TableContainer sx={{ overflow: 'unset' }}>
        <Scrollbar>
          <Table sx={{ minWidth: 680 }}>
            <TableHeadCustom headLabel={tableLabels} />
            <TableBody>
              {dataInPage.map((row, index) => (
                <AccountNewInvoiceRow key={row.id} row={row} index={page * rowsPerPage + index} />
              ))}
            </TableBody>
          </Table>
        </Scrollbar>
      </TableContainer>

      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
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

AccountNewInvoice.propTypes = {
  subheader: PropTypes.string,
  tableData: PropTypes.array,
  tableLabels: PropTypes.array,
  title: PropTypes.string,
};

// ----------------------------------------------------------------------

function AccountNewInvoiceRow({ row, index }) {
  const popover = usePopover();

  const handleDownload = () => {
    popover.onClose();
    console.info('DOWNLOAD', row.id);
  };
  const handlePrint = () => {
    popover.onClose();
    console.info('PRINT', row.id);
  };
  const handleShare = () => {
    popover.onClose();
    console.info('SHARE', row.id);
  };
  const handleDelete = () => {
    popover.onClose();
    console.info('DELETE', row.id);
  };

  return (
    <>
      <TableRow>
        <TableCell align='center'>{index + 1}</TableCell>
        <TableCell>{`${row.firstName} ${row.lastName}`}</TableCell>
        <TableCell>{fCurrency(row?.fee_detail?.installments?.amount)}</TableCell>
        <TableCell>{row.contact}</TableCell>
        <TableCell>
          <ListItemText
            primary={fDate(row?.fee_detail?.installments?.installment_date)}
            primaryTypographyProps={{ variant: 'body2', noWrap: true }}
            secondaryTypographyProps={{
              mt: 0.5,
              component: 'span',
              variant: 'caption',
            }}
          />
        </TableCell>
      </TableRow>

      <CustomPopover
        open={popover.open}
        onClose={popover.onClose}
        arrow='right-top'
        sx={{ width: 160 }}
      >
        <MenuItem onClick={handleDownload}>
          <Iconify icon='eva:cloud-download-fill' />
          Download
        </MenuItem>
        <MenuItem onClick={handlePrint}>
          <Iconify icon='solar:printer-minimalistic-bold' />
          Print
        </MenuItem>
        <MenuItem onClick={handleShare}>
          <Iconify icon='solar:share-bold' />
          Share
        </MenuItem>
        <Divider sx={{ borderStyle: 'dashed' }} />
        <MenuItem onClick={handleDelete} sx={{ color: 'error.main' }}>
          <Iconify icon='solar:trash-bin-trash-bold' />
          Delete
        </MenuItem>
      </CustomPopover>
    </>
  );
}

AccountNewInvoiceRow.propTypes = {
  row: PropTypes.object.isRequired,
  index: PropTypes.number.isRequired,
};
