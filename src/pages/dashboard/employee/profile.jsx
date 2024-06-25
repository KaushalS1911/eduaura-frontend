import { Helmet } from 'react-helmet-async';

import { EmployeeProfileView } from 'src/sections/employee/view';

// ----------------------------------------------------------------------

export default function EmployeeProfilePage() {
  return (
    <>
      <Helmet>
        <title> Dashboard: Employee Profile</title>
      </Helmet>

      <EmployeeProfileView />
    </>
  );
}
