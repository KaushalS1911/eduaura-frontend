import { Helmet } from 'react-helmet-async';

import { StudentCreateView } from 'src/sections/student/view';

// ----------------------------------------------------------------------

export default function StudentCreatePage() {
  return (
    <>
      <Helmet>
        <title> Dashboard: Create a new student</title>
      </Helmet>

      <StudentCreateView />
    </>
  );
}
