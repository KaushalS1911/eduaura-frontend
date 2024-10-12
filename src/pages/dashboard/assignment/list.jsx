import { Helmet } from 'react-helmet-async';
import { AssignmentListView } from '../../../sections/assignment/view';


// ----------------------------------------------------------------------

export default function AssignmentListPage() {
  return (
    <>
      <Helmet>
        <title> Dashboard: Assignment List</title>
      </Helmet>

      <AssignmentListView />
    </>
  );
}
