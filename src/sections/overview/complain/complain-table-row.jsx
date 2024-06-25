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
import moment from 'moment';

// ----------------------------------------------------------------------

export default function ComplainTableRow({
  row,
  selected,
  onSelectRow,
  onViewRow,
  onEditRow,
  index,
  onDeleteRow,
}) {
  const { date, title, status, student } = row;

  const confirm = useBoolean();

  const popover = usePopover();

  return (
    <TableRow key={index}>
      <TableCell> {index + 1}</TableCell>
      <TableCell sx={{ display: 'flex', alignItems: 'center' }}>
        <Avatar
          alt={`${student.firstName} ${student.lastName}`}
          src={student.profile_pic}
          sx={{ mr: 2 }}
        />

        <ListItemText
          primary={`${student.firstName} ${student.lastName}`}
          // secondary={student.email}
          primaryTypographyProps={{ typography: 'body2' }}
          secondaryTypographyProps={{
            component: 'span',
            color: 'text.disabled',
          }}
        />
      </TableCell>
      <TableCell>{title}</TableCell>
      <TableCell> {moment(date).format('DD/MM/YYYY')}</TableCell>
      <TableCell>
        <Label
          variant="soft"
          color={
            (status === 'completed' && 'success') ||
            (status === 'pending' && 'warning') ||
            'default'
          }
        >
          {status}
        </Label>
      </TableCell>
    </TableRow>
  );
}

ComplainTableRow.propTypes = {
  onDeleteRow: PropTypes.func,
  onEditRow: PropTypes.func,
  onSelectRow: PropTypes.func,
  onViewRow: PropTypes.func,
  row: PropTypes.object,
  selected: PropTypes.bool,
};
