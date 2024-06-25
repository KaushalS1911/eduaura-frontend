import PropTypes from 'prop-types';
import moment from 'moment';

import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import TableRow from '@mui/material/TableRow';
import Checkbox from '@mui/material/Checkbox';
import TableCell from '@mui/material/TableCell';
import IconButton from '@mui/material/IconButton';

import { useBoolean } from 'src/hooks/use-boolean';

import Iconify from 'src/components/iconify';
import { ConfirmDialog } from 'src/components/custom-dialog';
import CustomPopover, { usePopover } from 'src/components/custom-popover';
import TaskQuickEditForm from './task-quick-edit-form';
import Label from 'src/components/label';

// ----------------------------------------------------------------------

export default function TaskTableRow({
  row,
  selected,
  onEditRow,
  onSelectRow,
  onDeleteRow,
  index,
}) {
  const { assigned_to,  desc, title } = row;
  const confirm = useBoolean();
  const quickEdit = useBoolean();

  const popover = usePopover();

  return (
    <>
      <TableRow hover selected={selected}>
        {/* <TableCell padding="checkbox" sx={{ width: '90px' }}>
          <Checkbox checked={selected} onClick={onSelectRow} />
        </TableCell> */}

        <TableCell sx={{ whiteSpace: 'nowrap' }}>{index + 1}</TableCell>

        <TableCell sx={{ whiteSpace: 'nowrap' }}>{title}</TableCell>

        <TableCell sx={{ whiteSpace: 'nowrap' }}>{desc} </TableCell>
      
        <TableCell
          sx={{ whiteSpace: 'nowrap' }}
        >{`${assigned_to?.firstName} ${assigned_to?.lastName}`}</TableCell>

        {/* <TableCell sx={{ whiteSpace: 'nowrap' }}>{moment(date).format('DD/MM/YYYY')}</TableCell> */}
        <TableCell>
          <Label
            variant="soft"
            color={
              (row.status === 'Completed' && 'success') ||
              (row.status === 'Pending' && 'warning') ||
              'default'
            }
          >
            {row.status}
          </Label>
        </TableCell>
        <TableCell align="right" sx={{ px: 1, whiteSpace: 'nowrap' }}>
          <IconButton color={popover.open ? 'inherit' : 'default'} onClick={popover.onOpen}>
            <Iconify icon="eva:more-vertical-fill" />
          </IconButton>
        </TableCell>
      </TableRow>

      <TaskQuickEditForm currentUser={row} open={quickEdit.value} onClose={quickEdit.onFalse} />

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
          <Iconify icon="solar:pen-bold" />
          Edit
        </MenuItem>
      </CustomPopover>
      <ConfirmDialog
        open={confirm.value}
        onClose={confirm.onFalse}
        title="Delete"
        content="Are you sure want to delete?"
        action={
          <Button
            variant="contained"
            color="error"
            onClick={() => {
              onDeleteRow(), confirm.onFalse();
            }}
          >
            Delete
          </Button>
        }
      />
    </>
  );
}

TaskTableRow.propTypes = {
  onDeleteRow: PropTypes.func,
  onEditRow: PropTypes.func,
  onSelectRow: PropTypes.func,
  row: PropTypes.object,
  selected: PropTypes.bool,
  index: PropTypes.number,
};
