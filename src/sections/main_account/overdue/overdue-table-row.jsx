import React from 'react';
import PropTypes from 'prop-types';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import ListItemText from '@mui/material/ListItemText';
import { fCurrency } from 'src/utils/format-number';
import { fDate, fTime } from 'src/utils/format-time';

// ----------------------------------------------------------------------

export default function OverdueTableRow({ row, index }) {

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

      {/*<CustomPopover*/}
      {/*  open={popover.open}*/}
      {/*  onClose={popover.onClose}*/}
      {/*  arrow="right-top"*/}
      {/*  sx={{ width: 160 }}*/}
      {/*>*/}
      {/*  <MenuItem*/}
      {/*    onClick={() => {*/}
      {/*      setOpen(true);*/}
      {/*      setsingleAttendanceID(_id);*/}
      {/*      popover.onClose();*/}
      {/*    }}*/}
      {/*  >*/}
      {/*    <Iconify icon="solar:pen-bold" />*/}
      {/*    Edit*/}
      {/*  </MenuItem>*/}
      {/*  <Divider sx={{ borderStyle: 'dashed' }} />*/}
      {/*  <MenuItem*/}
      {/*    onClick={() => {*/}
      {/*      confirm.onTrue();*/}
      {/*      setsingleAttendanceID(_id);*/}
      {/*      popover.onClose();*/}
      {/*    }}*/}
      {/*    sx={{ color: 'error.main' }}*/}
      {/*  >*/}
      {/*    <Iconify icon="solar:trash-bin-trash-bold" />*/}
      {/*    Delete*/}
      {/*  </MenuItem>*/}
      {/*</CustomPopover>*/}
    </>
  );
}

OverdueTableRow.propTypes = {
  onDeleteRow: PropTypes.func,
  onEditRow: PropTypes.func,
  onSelectRow: PropTypes.func,
  onViewRow: PropTypes.func,
  row: PropTypes.object,
  selected: PropTypes.bool,
};
