import { Helmet } from 'react-helmet-async';

import { EmployeeCardsView } from 'src/sections/employee/view';

// ----------------------------------------------------------------------

export default function EmployeeCardsPage() {
  return (
    <>
      <Helmet>
        <title> Dashboard: Employee Cards</title>
      </Helmet>

      <EmployeeCardsView />
    </>
  );
}
