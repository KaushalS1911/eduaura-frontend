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
import moment from 'moment';
import Label from '../../components/label';
import { useGetConfigs } from '../../api/config';
import { useAuthContext } from '../../auth/hooks';
import { getResponsibilityValue } from '../../permission/permission';

export default function InquiryTableRow({
                                          row,
                                          index,
                                          selected,
                                          onEditRow,
                                          onSelectRow,
                                          onDeleteRow,
                                        }) {
  const { firstName, lastName, email, contact, dob, status } = row;

  const confirm = useBoolean();
  const popover = usePopover();
  const quickEdit = useBoolean();
  const { configs } = useGetConfigs();
  const { user } = useAuthContext();

  return (
    <>
      <TableRow hover selected={selected}>
        {/* <TableCell padding="checkbox">
          <Checkbox checked={selected} onClick={onSelectRow} />
        </TableCell> */}

        <TableCell align={'center'}>{index + 1}</TableCell>

        <TableCell>{firstName + ' ' + lastName}</TableCell>

        <TableCell> {contact} </TableCell>

        <TableCell> {email} </TableCell>

        <TableCell>{moment(dob).format('DD/MM/YYYY')}</TableCell>
        {getResponsibilityValue('create_demo', configs, user) && <TableCell>
          <Tooltip title='Add a new Demo' placement='top' arrow>
            <Button variant='outlined' onClick={quickEdit.onTrue}>
              + Demo
            </Button>
          </Tooltip>
        </TableCell>}

        <TableCell>
          <Label
            variant='soft'
            color={
              (status === 'Active' && 'success') ||
              (status === 'In Active' && 'error') ||
              'default'
            }
          >
            {status}
          </Label>
        </TableCell>

        <TableCell align='center' sx={{ px: 1, whiteSpace: 'nowrap' }}>
          <IconButton color={popover.open ? 'inherit' : 'default'} onClick={popover.onOpen}>
            <Iconify icon='eva:more-vertical-fill' />
          </IconButton>
        </TableCell>
      </TableRow>

      <CustomPopover
        open={popover.open}
        onClose={popover.onClose}
        arrow='right-top'
        sx={{ width: 140 }}
      >
        {getResponsibilityValue('delete_inquiry', configs, user)
        && <MenuItem
          onClick={() => {
            confirm.onTrue();
            popover.onClose();
          }}
          sx={{ color: 'error.main' }}
        >
          <Iconify icon='solar:trash-bin-trash-bold' />
          Delete
        </MenuItem>}

        {getResponsibilityValue('update_inquiry', configs, user)
        && <MenuItem
          onClick={() => {
            onEditRow();
            popover.onClose();
          }}
        >
          <Iconify icon='solar:eye-bold' />
          Edit
        </MenuItem>}
      </CustomPopover>

      <DemoNewEditForm currentId={row} open={quickEdit.value} onClose={quickEdit.onFalse} />

      <ConfirmDialog
        open={confirm.value}
        onClose={confirm.onFalse}
        title='Delete Inquiry'
        content='Are you sure you want to delete selected inquiry?'
        action={
          <Button variant='contained' color='error' onClick={onDeleteRow}>
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
