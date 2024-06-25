import { Helmet } from 'react-helmet-async';

import { StudentListView } from 'src/sections/student/view';

// ----------------------------------------------------------------------

export default function StudentListPage() {
  return (
    <>
      <Helmet>
        <title> Dashboard: Student List</title>
      </Helmet>

      <StudentListView />
    </>
  );
}
