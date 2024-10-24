import PropTypes from 'prop-types';
import moment from 'moment';

import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import MenuItem from '@mui/material/MenuItem';
import TableRow from '@mui/material/TableRow';
import Checkbox from '@mui/material/Checkbox';
import TableCell from '@mui/material/TableCell';
import IconButton from '@mui/material/IconButton';
import ListItemText from '@mui/material/ListItemText';

import { useBoolean } from 'src/hooks/use-boolean';

import Label from 'src/components/label';
import Iconify from 'src/components/iconify';
import { ConfirmDialog } from 'src/components/custom-dialog';
import CustomPopover, { usePopover } from 'src/components/custom-popover';

import StudentQuickEditForm from './student-quick-edit-form';
import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';
import { getResponsibilityValue } from '../../permission/permission';
import { useGetConfigs } from '../../api/config';
import { useAuthContext } from '../../auth/hooks';
import { Link } from 'react-router-dom';
import { useParams } from 'react-router';

// ----------------------------------------------------------------------

export default function StudentTableRow({ row, selected, onEditRow, onSelectRow, onDeleteRow }) {
  const { firstName, lastName, profile_pic, course, joining_date, email, contact } = row;
  const confirm = useBoolean();
  const { configs } = useGetConfigs();
  const { user } = useAuthContext();
  const quickEdit = useBoolean();
  const popover = usePopover();
  const router = useRouter();

  return (
    <>
      <TableRow hover selected={selected}>
        {getResponsibilityValue('delete_student', configs, user)
        && <TableCell padding='checkbox'>
          <Checkbox checked={selected} onClick={onSelectRow} />
        </TableCell>}
        <TableCell>{row.enrollment_no}</TableCell>
        <TableCell sx={{ display: 'flex', alignItems: 'center' }}>
          <Avatar alt={`${firstName} ${lastName}`} src={profile_pic} sx={{ mr: 2 }} />
          <ListItemText
            primary={
              <Link to={paths.dashboard.student.edit(row._id)}
                    style={{ textDecoration: 'none', fontWeight: 'bold', color: 'inherit' }}

              >
                {`${firstName} ${lastName}`}
              </Link>
            }
            secondary={email}
            primaryTypographyProps={{ typography: 'body2' }}
            secondaryTypographyProps={{
              component: 'span',
              color: 'text.disabled',
            }}
          />
        </TableCell>
        <TableCell sx={{ whiteSpace: 'nowrap' }}>{contact}</TableCell>
        <TableCell sx={{ whiteSpace: 'nowrap' }}>{course}</TableCell>
        <TableCell sx={{ whiteSpace: 'nowrap' }}>
          {moment(joining_date).format('DD/MM/YYYY')}
        </TableCell>
        <TableCell>
          <Label
            variant='soft'
            color={
              (row.status === 'completed' && 'success') ||
              (row.status === 'running' && 'warning') ||
              (row.status === 'leaved' && 'error') ||
              (row.status === 'training' && 'info') ||
              'default'
            }
          >
            {row.status}
          </Label>
        </TableCell>
        <TableCell>
          <Label
            variant='soft'
            color={
              row.fee_detail.installments.every((installment) => installment.status === 'paid')
                ? 'success'
                : 'warning'
            }
          >
            {row.fee_detail.installments.every((installment) => installment.status === 'paid')
              ? 'completed'
              : 'pending'}
          </Label>
        </TableCell>
        <TableCell align='right' sx={{ px: 1, whiteSpace: 'nowrap' }}>
          <IconButton color={popover.open ? 'inherit' : 'default'} onClick={popover.onOpen}>
            <Iconify icon='eva:more-vertical-fill' />
          </IconButton>
        </TableCell>
      </TableRow>
      <StudentQuickEditForm currentUser={row} open={quickEdit.value} onClose={quickEdit.onFalse} />
      <CustomPopover
        open={popover.open}
        onClose={popover.onClose}
        arrow='right-top'
        sx={{ width: 140 }}
      >
        {getResponsibilityValue('print_student_detail', configs, user)
        && <MenuItem
          onClick={() => {
            router.push(paths.dashboard.student.studentView(row._id));
            popover.onClose();
          }}
        >
          <Iconify icon='raphael:view' />
          View Detail
        </MenuItem>}
      </CustomPopover>
      <ConfirmDialog
        open={confirm.value}
        onClose={confirm.onFalse}
        title='Delete'
        content='Are you sure want to delete?'
        action={
          <Button variant='contained' color='error' onClick={onDeleteRow}>
            Delete
          </Button>
        }
      />
    </>
  );
}

StudentTableRow.propTypes = {
  onDeleteRow: PropTypes.func,
  onEditRow: PropTypes.func,
  onSelectRow: PropTypes.func,
  row: PropTypes.object,
  selected: PropTypes.bool,
};
