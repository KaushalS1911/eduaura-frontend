import { Helmet } from 'react-helmet-async';
import { AssignmentCreateView } from '../../../sections/assignment/view';


// ----------------------------------------------------------------------

export default function AssignmentCreatePage() {


  return (
    <>
      <Helmet>
        <title> Dashboard: Assignment Create</title>
      </Helmet>

      <AssignmentCreateView />
    </>
  );
}
