import { Helmet } from 'react-helmet-async';

import { EmployeeCreateView } from 'src/sections/employee/view';

// ----------------------------------------------------------------------

export default function EmployeeCreatePage() {
  return (
    <>
      <Helmet>
        <title> Dashboard: Create a new employee</title>
      </Helmet>

      <EmployeeCreateView />
    </>
  );
}
