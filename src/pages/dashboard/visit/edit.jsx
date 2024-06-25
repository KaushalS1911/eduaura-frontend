import { Helmet } from 'react-helmet-async';

import { useParams } from 'src/routes/hooks';
import { VisitEditView } from 'src/sections/visit/view';


// ----------------------------------------------------------------------

export default function VisitEditPage() {
  const params = useParams();

  const { id } = params;

  return (
    <>
      <Helmet>
        <title> Dashboard: Visit Edit</title>
      </Helmet>

      <VisitEditView id={`${id}`} />
    </>
  );
}
