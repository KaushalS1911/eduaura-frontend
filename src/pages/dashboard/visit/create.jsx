import { Helmet } from 'react-helmet-async';

import { useParams } from 'src/routes/hooks';
import { VisitCreateView } from 'src/sections/visit/view';


// ----------------------------------------------------------------------

export default function VisitCreatePage() {
  const params = useParams();

  const { id } = params;

  return (
    <>
      <Helmet>
        <title> Dashboard: Visit Create</title>
      </Helmet>

      <VisitCreateView />
    </>
  );
}
