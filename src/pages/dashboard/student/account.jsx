import { Helmet } from 'react-helmet-async';
import { StudentCreateView } from 'src/sections/student/view';

// ----------------------------------------------------------------------

export default function AccountPage() {
  return (
    <>
      <Helmet>
        <title> Dashboard: Account Settings</title>
      </Helmet>
    <StudentCreateView />
    </>
  );
}
