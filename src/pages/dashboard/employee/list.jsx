import { useParams } from 'react-router';
import { Helmet } from 'react-helmet-async';

import { EmployeeListView } from 'src/sections/employee/view';

// ----------------------------------------------------------------------

export default function EmployeeListPage() {
  const params = useParams();

  const { id } = params;
  return (
    <>
      <Helmet>
        <title> Dashboard: Employee List</title>
      </Helmet>

      <EmployeeListView id={`${id}`}/>
    </>
  );
}
