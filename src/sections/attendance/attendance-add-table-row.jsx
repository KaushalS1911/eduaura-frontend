import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';
import Link from '@mui/material/Link';
import Avatar from '@mui/material/Avatar';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import Typography from '@mui/material/Typography';
import ListItemText from '@mui/material/ListItemText';

import { RHFRadioGroup } from 'src/components/hook-form';
import { useBoolean } from 'src/hooks/use-boolean';

// Dummy data for `INQUIRY_SUGGESTED_IN`, replace it with your actual data source
const INQUIRY_SUGGESTED_IN = [
  { value: 'present', label: 'Present' },
  { value: 'late', label: 'Late' },
  { value: 'absent', label: 'Absent' },
];

export default function AttendanceAddTableRow({
  index,
  row,
  selected,
  onAttendanceChange,
  response = { status: null },
}) {
  const { contact, email, firstName, lastName, profile_pic, _id } = row;
  const confirm = useBoolean();

  const [attendanceStatus, setAttendanceStatus] = useState('');

  const handleAttendanceChange = (event) => {
    const status = event.target.value;
    setAttendanceStatus(status);
    onAttendanceChange({ id: _id, status });
  };

  useEffect(() => {
    if (response && response.status === 200) {
      setAttendanceStatus('');
    } else {
      setAttendanceStatus('');
    }
  }, [response]);

  return (
    <TableRow hover selected={selected} >
      <TableCell >{index + 1}</TableCell>
      <TableCell sx={{ display: 'flex', alignItems: 'center'}}>
        <Avatar alt={`${firstName} ${lastName}`} src={profile_pic} sx={{ mr: 2 }}>
          {!profile_pic && firstName.charAt(0).toUpperCase()}
        </Avatar>
        <ListItemText
          disableTypography
          primary={
            <Typography variant="body2" noWrap>
              {`${firstName} ${lastName}`}
            </Typography>
          }

        />
      </TableCell>
      <TableCell>{contact}</TableCell>
      <TableCell>{email}</TableCell>
      <TableCell>
        <RHFRadioGroup
          row
          spacing={0}
          name="suggested_by"
          options={INQUIRY_SUGGESTED_IN}
          value={attendanceStatus}
          onChange={handleAttendanceChange}
        />
      </TableCell>
    </TableRow>
  );
}

AttendanceAddTableRow.propTypes = {
  onDeleteRow: PropTypes.func,
  onEditRow: PropTypes.func,
  onSelectRow: PropTypes.func,
  onViewRow: PropTypes.func,
  onAttendanceChange: PropTypes.func.isRequired,
  row: PropTypes.shape({
    contact: PropTypes.string,
    email: PropTypes.string,
    firstName: PropTypes.string,
    lastName: PropTypes.string,
    profile_pic: PropTypes.string,
    _id: PropTypes.string,
  }).isRequired,
  selected: PropTypes.bool,
  response: PropTypes.shape({
    status: PropTypes.number,
  }),
};
