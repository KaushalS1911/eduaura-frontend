import Box from '@mui/material/Box';

import { useEffect } from 'react';


import { useGetStudents } from 'src/api/student';


import StudentCard from './student-card';

// ----------------------------------------------------------------------

export default function StudentCardList() {
  const { students ,mutate} = useGetStudents();

  useEffect(()=>{
    mutate();
  },[mutate])

  return (
    <Box
      gap={3}
      display="grid"
      gridTemplateColumns={{
        xs: 'repeat(1, 1fr)',
        sm: 'repeat(2, 1fr)',
        md: 'repeat(4, 2fr)',
      }}
    >
      {students.map((user) => (
        <StudentCard key={user._id} user={user} />
      ))}
    </Box>
  );
}
