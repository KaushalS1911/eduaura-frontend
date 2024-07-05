import { Helmet } from 'react-helmet-async';
import StudentPage from 'src/sections/student/student-overview-page/student-page';

// ----------------------------------------------------------------------

export default function StudentCreatePage() {
  return (
    <>
      <Helmet>
        <title> Dashboard: Student Details View</title>
      </Helmet>

      <StudentPage />
    </>
  );
}
