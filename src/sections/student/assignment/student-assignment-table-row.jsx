import PropTypes from 'prop-types';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import { fDate } from 'src/utils/format-time';
import Label from 'src/components/label';

// ----------------------------------------------------------------------

export default function StudentAssignmentTableRow({
                                                    row,
                                                    selected,
                                                    index,
                                                  }) {
  const { status, remarks } = row;

  return (
    <>
      <TableRow hover selected={selected}>
        <TableCell>{index + 1}</TableCell>
        <TableCell sx={{ whiteSpace: 'nowrap' }}>{row?.assignmentdata?.title}</TableCell>
        <TableCell sx={{ whiteSpace: 'nowrap' }}>{row?.assignmentdata?.desc}</TableCell>
        <TableCell sx={{ whiteSpace: 'nowrap' }}>{fDate(row?.assignmentdata?.date)}</TableCell>
        <TableCell>
          <Label
            variant='soft'
            color={
              (status === 'Completed' && 'success') ||
              (status === 'Pending' && 'warning') ||
              (status === 'Not Completed' && 'error') ||
              'default'
            }
          >
            {status}
          </Label>
        </TableCell>
        <TableCell sx={{ whiteSpace: 'nowrap' }}>{remarks}</TableCell>
      </TableRow>
    </>
  );
}

StudentAssignmentTableRow.propTypes = {
  onDeleteRow: PropTypes.func,
  onEditRow: PropTypes.func,
  onSelectRow: PropTypes.func,
  onViewRow: PropTypes.func,
  row: PropTypes.object,
  selected: PropTypes.bool,
};
