import PropTypes from 'prop-types';

import {
  Box,
  Button,
  MenuItem,
  TableRow,
  Checkbox,
  TableCell,
  IconButton,
  Tooltip,
} from '@mui/material';

import { useBoolean } from 'src/hooks/use-boolean';
import { fDate } from 'src/utils/format-time';

import Iconify from 'src/components/iconify';
import { ConfirmDialog } from 'src/components/custom-dialog';
import CustomPopover, { usePopover } from 'src/components/custom-popover';
import DemoNewEditForm from './Demo-new-edit-form';

export default function InquiryTableRow({
  row,
  index,
  selected,
  onEditRow,
  onSelectRow,
  onDeleteRow,
}) {
  const { firstName, lastName, email, contact, dob } = row;

  const confirm = useBoolean();
  const popover = usePopover();

  const quickEdit = useBoolean();

  return (
    <>
      <TableRow hover selected={selected}>
        {/* <TableCell padding="checkbox">
          <Checkbox checked={selected} onClick={onSelectRow} />
        </TableCell> */}

        <TableCell>
          <Box>{index + 1}</Box>
        </TableCell>

        <TableCell>{firstName + lastName}</TableCell>

        <TableCell>{fDate(dob)}</TableCell>

        <TableCell align="center"> {contact} </TableCell>

        <TableCell align="center"> {email} </TableCell>

        <TableCell align="center">
          {/* <Tooltip title="Demo" placement="top" arrow>
            <IconButton color={quickEdit.value ? 'inherit' : 'default'} onClick={quickEdit.onTrue}>
              <Iconify icon="solar:pen-bold" />
            </IconButton>
          </Tooltip> */}
          <Button variant="contained" onClick={quickEdit.onTrue}>
            + Demo
          </Button>
        </TableCell>

        <TableCell align="right" sx={{ px: 1, whiteSpace: 'nowrap' }}>
          <IconButton color={popover.open ? 'inherit' : 'default'} onClick={popover.onOpen}>
            <Iconify icon="eva:more-vertical-fill" />
          </IconButton>
        </TableCell>
      </TableRow>

      <CustomPopover
        open={popover.open}
        onClose={popover.onClose}
        arrow="right-top"
        sx={{ width: 140 }}
      >
        <MenuItem
          onClick={() => {
            confirm.onTrue();
            popover.onClose();
          }}
          sx={{ color: 'error.main' }}
        >
          <Iconify icon="solar:trash-bin-trash-bold" />
          Delete
        </MenuItem>

        <MenuItem
          onClick={() => {
            onEditRow();
            popover.onClose();
          }}
        >
          <Iconify icon="solar:eye-bold" />
          Edit
        </MenuItem>
      </CustomPopover>

      <DemoNewEditForm currentId={row} open={quickEdit.value} onClose={quickEdit.onFalse} />

      <ConfirmDialog
        open={confirm.value}
        onClose={confirm.onFalse}
        title="Delete"
        content="Are you sure you want to delete?"
        action={
          <Button variant="contained" color="error" onClick={onDeleteRow}>
            Delete
          </Button>
        }
      />
    </>
  );
}

InquiryTableRow.propTypes = {
  row: PropTypes.object.isRequired,
  index: PropTypes.number.isRequired,
  selected: PropTypes.bool.isRequired,
  onEditRow: PropTypes.func.isRequired,
  onDeleteRow: PropTypes.func.isRequired,
  onSelectRow: PropTypes.func.isRequired,
};
