import PropTypes from 'prop-types';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import ListItemText from '@mui/material/ListItemText';
import { useBoolean } from 'src/hooks/use-boolean';
import { fDate, fTime } from 'src/utils/format-time';
import Label from 'src/components/label';
import { usePopover } from 'src/components/custom-popover';

// ----------------------------------------------------------------------

export default function StudentAttendanceTableRow({
                                                    row,
                                                    selected,
                                                    index,
                                                  }) {
  const { date, status } = row;

  return (
    <>
      <TableRow hover selected={selected}>
        <TableCell>{index + 1}</TableCell>
        <TableCell>
          <ListItemText
            primary={fDate(date)}
            secondary={fTime(date)}
            primaryTypographyProps={{ typography: 'body2', noWrap: true }}
            secondaryTypographyProps={{
              mt: 0.5,
              component: 'span',
              typography: 'caption',
            }}
          />
        </TableCell>
        <TableCell>
          <Label
            variant='soft'
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
      </TableRow>
    </>
  );
}

StudentAttendanceTableRow.propTypes = {
  onDeleteRow: PropTypes.func,
  onEditRow: PropTypes.func,
  onSelectRow: PropTypes.func,
  onViewRow: PropTypes.func,
  row: PropTypes.object,
  selected: PropTypes.bool,
};
