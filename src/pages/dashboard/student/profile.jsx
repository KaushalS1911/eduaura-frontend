import { Helmet } from 'react-helmet-async';

import { StudentProfileView } from 'src/sections/student/view';

// ----------------------------------------------------------------------

export default function StudentProfilePage() {
  return (
    <>
      <Helmet>
        <title> Dashboard: Student Profile</title>
      </Helmet>

      <StudentProfileView />
    </>
  );
}
