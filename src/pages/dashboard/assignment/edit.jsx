import { Helmet } from 'react-helmet-async';
import { useParams } from 'src/routes/hooks';
import { AssignmentEditView } from '../../../sections/assignment/view';


// ----------------------------------------------------------------------

export default function AssignmentEditPage() {
  const params = useParams();

  const { id } = params;

  return (
    <>
      <Helmet>
        <title> Dashboard: Assignment Edit</title>
      </Helmet>

      <AssignmentEditView id={`${id}`} />
    </>
  );
}
