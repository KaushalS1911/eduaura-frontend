import PropTypes from 'prop-types';
import moment from 'moment';

import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import TableRow from '@mui/material/TableRow';
import Checkbox from '@mui/material/Checkbox';
import TableCell from '@mui/material/TableCell';
import IconButton from '@mui/material/IconButton';
import ListItemText from '@mui/material/ListItemText';

import { useBoolean } from 'src/hooks/use-boolean';

import Iconify from 'src/components/iconify';
import { ConfirmDialog } from 'src/components/custom-dialog';
import CustomPopover, { usePopover } from 'src/components/custom-popover';

import { Box } from '@mui/system';
import EmployeeQuickEditForm from './employee-quick-edit-form';

// ----------------------------------------------------------------------

export default function EmployeeTableRow({
  row,
  index,
  selected,
  onEditRow,
  onSelectRow,
  onDeleteRow,
}) {
  const { avatar_url, role, email, contact, firstName, lastName, technology, joining_date, dob } =
    row;

  const confirm = useBoolean();

  const quickEdit = useBoolean();

  const popover = usePopover();

  return (
    <>
      <TableRow hover selected={selected}>
        {/* <TableCell padding="checkbox">
          <Checkbox checked={selected} onClick={onSelectRow} />
        </TableCell> */}

        <TableCell>
          <Box>{index + 1}</Box>
        </TableCell>

        <TableCell sx={{ display: 'flex', alignItems: 'center' }}>
          <Avatar alt={`${firstName} ${lastName}`} src={avatar_url} sx={{ mr: 2 }} />

          <ListItemText
            primary={`${firstName} ${lastName}`}
            secondary={email}
            primaryTypographyProps={{ typography: 'body2' }}
            secondaryTypographyProps={{
              component: 'span',
              color: 'text.disabled',
            }}
          />
        </TableCell>

        <TableCell sx={{ whiteSpace: 'nowrap' }}>{contact}</TableCell>

        <TableCell sx={{ whiteSpace: 'nowrap' }}>{technology}</TableCell>

        <TableCell sx={{ whiteSpace: 'nowrap' }}>{role}</TableCell>
        <TableCell sx={{ whiteSpace: 'nowrap' }}>
          {moment(joining_date).format('DD/MM/YYYY')}
        </TableCell>
        <TableCell sx={{ whiteSpace: 'nowrap' }}>{moment(dob).format('DD/MM/YYYY')}</TableCell>

        <TableCell align="right" sx={{ px: 1, whiteSpace: 'nowrap' }}>
          <Tooltip title="Quick Edit" placement="top" arrow>
            <IconButton
              color={quickEdit.value ? 'inherit' : 'default'}
              onClick={() => {
                onEditRow();
              }}
            >
              <Iconify icon="solar:pen-bold" />
            </IconButton>
          </Tooltip>

          {/* <IconButton color={popover.open ? 'inherit' : 'default'} onClick={popover.onOpen}>
            <Iconify icon="eva:more-vertical-fill" />
          </IconButton> */}
        </TableCell>
      </TableRow>

      <EmployeeQuickEditForm
        currentEmployee={row}
        open={quickEdit.value}
        onClose={quickEdit.onFalse}
      />

      <CustomPopover
        open={popover.open}
        onClose={popover.onClose}
        onClick={() => {
          onEditRow();
        }}
        arrow="right-top"
        sx={{ width: 140 }}
      >
        {/* <MenuItem
          onClick={() => {
            confirm.onTrue();
            popover.onClose();
          }}
          sx={{ color: 'error.main' }}
        >
          <Iconify icon="solar:trash-bin-trash-bold" />
          Delete
        </MenuItem> */}

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
          <Button variant="contained" color="error" onClick={onDeleteRow}>
            Delete
          </Button>
        }
      />
    </>
  );
}

EmployeeTableRow.propTypes = {
  onDeleteRow: PropTypes.func,
  onEditRow: PropTypes.func,
  index: PropTypes.func,
  onSelectRow: PropTypes.func,
  row: PropTypes.object,
  selected: PropTypes.bool,
};
