import PropTypes from 'prop-types';

import Link from '@mui/material/Link';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import Divider from '@mui/material/Divider';
import MenuItem from '@mui/material/MenuItem';
import TableRow from '@mui/material/TableRow';
import Checkbox from '@mui/material/Checkbox';
import TableCell from '@mui/material/TableCell';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import ListItemText from '@mui/material/ListItemText';

import { useBoolean } from 'src/hooks/use-boolean';

import { fCurrency } from 'src/utils/format-number';
import { fDate, fTime } from 'src/utils/format-time';

import Label from 'src/components/label';
import Iconify from 'src/components/iconify';
import { ConfirmDialog } from 'src/components/custom-dialog';
import CustomPopover, { usePopover } from 'src/components/custom-popover';

// ----------------------------------------------------------------------

export default function AttendanceTableRow({
  row,
  selected,
  onSelectRow,
  onViewRow,
  onEditRow,
  onDeleteRow,
}) {
  const {  date, status, student_id, index } = row;

  const confirm = useBoolean();

  const popover = usePopover();

  return (
    <>
      <TableRow hover selected={selected}>
        {/* <TableCell padding="checkbox">
          <Checkbox checked={selected} onClick={onSelectRow} />
        </TableCell> */}

        <TableCell align="center">{index + 1}</TableCell>


        <TableCell sx={{ display: 'flex', alignItems: 'center' }}>
          {/* <Avatar alt={invoiceTo.name} sx={{ mr: 2 }}>
            {invoiceTo.name.charAt(0).toUpperCase()}
          </Avatar> */}
          <Avatar alt={student_id?.firstName} sx={{ mr: 2 }}>
            {student_id?.profile_pic || student_id?.firstName?.charAt(0).toUpperCase()}
          </Avatar>

          <ListItemText
            disableTypography
            primary={
              <Typography variant="body2" noWrap>
                {(student_id?.firstName + ' ' + student_id?.lastName) || ''}
              </Typography>
            }
            secondary={
              <Link
                noWrap
                variant="body2"
                onClick={onViewRow}
                sx={{ color: 'text.disabled', cursor: 'pointer' }}
              >
                {student_id?.email}
              </Link>
            }
          />
        </TableCell>


        <TableCell>{student_id?.enrollment_no}</TableCell>

        <TableCell>{student_id?.email}</TableCell>

        <TableCell>{student_id?.course}</TableCell>

        <TableCell>
          <Label
            variant="soft"
            color={
              (status === 'present' && 'success') ||
              (status === 'late' && 'warning') ||
              (status === 'absent' && 'error') ||
              'default'
            }
          >
            {status}
          </Label>
        </TableCell>

        {/* <TableCell align="right" sx={{ px: 1 }}>
          <IconButton color={popover.open ? 'inherit' : 'default'} onClick={popover.onOpen}>
            <Iconify icon="eva:more-vertical-fill" />
          </IconButton>
        </TableCell> */}
      </TableRow>

      {/* <CustomPopover
        open={popover.open}
        onClose={popover.onClose}
        arrow="right-top"
        sx={{ width: 160 }}
      >
        <MenuItem
          onClick={() => {
            onViewRow();
            popover.onClose();
          }}
        >
          <Iconify icon="solar:eye-bold" />
          View
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

        <Divider sx={{ borderStyle: 'dashed' }} />

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
      </CustomPopover> */}

      {/* <ConfirmDialog
        open={confirm.value}
        onClose={confirm.onFalse}
        title="Delete"
        content="Are you sure want to delete?"
        action={
          <Button variant="contained" color="error" onClick={onDeleteRow}>
            Delete
          </Button>
        }
      /> */}
    </>
  );
}

AttendanceTableRow.propTypes = {
  onDeleteRow: PropTypes.func,
  onEditRow: PropTypes.func,
  onSelectRow: PropTypes.func,
  onViewRow: PropTypes.func,
  row: PropTypes.object,
  selected: PropTypes.bool,
};
