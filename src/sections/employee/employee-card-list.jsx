import PropTypes from 'prop-types';

import Box from '@mui/material/Box';

import EmployeeCard from './employee-card';

// ----------------------------------------------------------------------

export default function EmployeeCardList({ users }) {
  return (
    <Box
      gap={3}
      display="grid"
      gridTemplateColumns={{
        xs: 'repeat(1, 1fr)',
        sm: 'repeat(2, 1fr)',
        md: 'repeat(3, 1fr)',
      }}
    >
      {users.map((user) => (
        <EmployeeCard key={user.id} user={user} />
      ))}
    </Box>
  );
}

EmployeeCardList.propTypes = {
  users: PropTypes.array,
};
