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
import VisitQuickEditForm from './visit-quick-edit-form';
import { getResponsibilityValue } from '../../permission/permission';
import { useGetConfigs } from '../../api/config';
import { useAuthContext } from '../../auth/hooks';

// ----------------------------------------------------------------------

export default function VisitTableRow({
                                        row,
                                        selected,
                                        onEditRow,
                                        onSelectRow,
                                        onDeleteRow,
                                        index,
                                      }) {
  const { firstName, lastName, address, contact, notes, reference } = row;
  const { configs } = useGetConfigs();
  const { user } = useAuthContext();
  const confirm = useBoolean();
  const quickEdit = useBoolean();
  const popover = usePopover();

  return (
    <>
      <TableRow hover selected={selected}>
        {/* <TableCell padding="checkbox" sx={{ width: '90px' }}>
          <Checkbox checked={selected} onClick={onSelectRow} />
        </TableCell> */}

        <TableCell align='center'>{index + 1}</TableCell>

        <TableCell>{`${firstName} ${lastName}`}</TableCell>

        <TableCell>{contact}</TableCell>
        <TableCell>{reference}</TableCell>
        <TableCell>{notes}</TableCell>
        <TableCell>{address}</TableCell>

        <TableCell align='center'>
          <IconButton color={popover.open ? 'inherit' : 'default'} onClick={popover.onOpen}>
            <Iconify icon='eva:more-vertical-fill' />
          </IconButton>
        </TableCell>
      </TableRow>

      <VisitQuickEditForm currentUser={row} open={quickEdit.value} onClose={quickEdit.onFalse} />

      <CustomPopover
        open={popover.open}
        onClose={popover.onClose}
        arrow='right-top'
        sx={{ width: 140 }}
      >
        {getResponsibilityValue('delete_visit', configs, user) && <MenuItem
          onClick={() => {
            confirm.onTrue();
            popover.onClose();
          }}
          sx={{ color: 'error.main' }}
        >
          <Iconify icon='solar:trash-bin-trash-bold' />
          Delete
        </MenuItem>}

        {getResponsibilityValue('update_visit', configs, user) && <MenuItem
          onClick={() => {
            onEditRow();
            popover.onClose();
          }}
        >
          <Iconify icon='solar:pen-bold' />
          Edit
        </MenuItem>}
      </CustomPopover>
      <ConfirmDialog
        open={confirm.value}
        onClose={confirm.onFalse}
        title='Delete Visit'
        content='Are you sure want to delete selected visit?'
        action={
          <Button
            variant='contained'
            color='error'
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

VisitTableRow.propTypes = {
  onDeleteRow: PropTypes.func,
  onEditRow: PropTypes.func,
  onSelectRow: PropTypes.func,
  row: PropTypes.object,
  selected: PropTypes.bool,
  index: PropTypes.number,
};
