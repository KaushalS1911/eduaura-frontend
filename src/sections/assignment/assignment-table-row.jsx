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
// import ExpenseQuickEditForm from './examination-quick-edit-form';
import { Avatar, ListItemText, Tooltip } from '@mui/material';
import AssignmentQuickEditForm from './assignment-quick-edit-form';
import { ExamImage } from '../../_mock/_inquiry';
import { useRouter } from 'src/routes/hooks';
import { paths } from 'src/routes/paths';
import { useGetConfigs } from '../../api/config';
import { useAuthContext } from '../../auth/hooks';
import { getResponsibilityValue } from '../../permission/permission';

// ----------------------------------------------------------------------

export default function AssignmentTableRow({
                                              row,
                                              selected,
                                              onEditRow,
                                              onSelectRow,
                                              onDeleteRow,
                                              index,
                                              mutate,
                                            }) {
  const { conducted_by, date, desc, title, total_marks } = row;
  const { configs } = useGetConfigs();
  const { user } = useAuthContext();
  const confirm = useBoolean();
  const quickEdit = useBoolean();
  const router = useRouter();
  const popover = usePopover();

  return (
    <>
      <TableRow hover selected={selected}>
        <TableCell sx={{ whiteSpace: 'nowrap' }}>{index + 1}</TableCell>

        <TableCell sx={{ whiteSpace: 'nowrap' }}>{moment(date).format('ll')}</TableCell>
        <TableCell sx={{ display: 'flex', alignItems: 'center' }}>
          <Avatar
            src={title}
            alt={title}
            sx={{
              width: 40,
              margin: '0px 5px',
              height: 40,
              border: (theme) => `solid 2px ${theme.palette.background.default}`,
            }}
          >
            {title.charAt(0).toUpperCase()}
          </Avatar>
          <ListItemText
            primary={title}
            primaryTypographyProps={{ typography: 'body2' }}
            secondaryTypographyProps={{
              component: 'span',
              color: 'text.disabled',
            }}
          />
        </TableCell>

        <TableCell
          sx={{ whiteSpace: 'nowrap' }}
        >{`${conducted_by?.firstName} ${conducted_by?.lastName}`}</TableCell>

        <TableCell sx={{ whiteSpace: 'nowrap' }}>{desc}</TableCell>

        <TableCell align='right' sx={{ px: 1, whiteSpace: 'nowrap' }}>
          <Tooltip title='Quick Edit' placement='top' arrow>
            <IconButton color={quickEdit.value ? 'inherit' : 'default'} onClick={quickEdit.onTrue}>
              <Iconify icon='solar:pen-bold' />
            </IconButton>
          </Tooltip>
          <IconButton color={popover.open ? 'inherit' : 'default'} onClick={popover.onOpen}>
            <Iconify icon='eva:more-vertical-fill' />
          </IconButton>
        </TableCell>
      </TableRow>

      {/*{getResponsibilityValue('create_batch', configs, user) && <AssignmentQuickEditForm*/}
      {/*  mutate={mutate}*/}
      {/*  currentUser={row}*/}
      {/*  open={quickEdit.value}*/}
      {/*  onClose={quickEdit.onFalse}*/}
      {/*/>}*/}

      <CustomPopover
        open={popover.open}
        onClose={popover.onClose}
        arrow='right-top'
        sx={{ width: 'auto' }}
      >
        {getResponsibilityValue('delete_assignment', configs, user) && <MenuItem
          onClick={() => {
            confirm.onTrue();
            popover.onClose();
          }}
          sx={{ color: 'error.main' }}
        >
          <Iconify icon='solar:trash-bin-trash-bold' />
          Delete
        </MenuItem>}

        {getResponsibilityValue('update_assignment', configs, user) && <MenuItem
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
        title='Delete'
        content='Are you sure want to delete?'
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

AssignmentTableRow.propTypes = {
  onDeleteRow: PropTypes.func,
  onEditRow: PropTypes.func,
  onSelectRow: PropTypes.func,
  row: PropTypes.object,
  selected: PropTypes.bool,
  index: PropTypes.number,
};
