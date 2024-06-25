import { Helmet } from 'react-helmet-async';

import { useParams } from 'src/routes/hooks';
import { BatchEditView } from 'src/sections/batches/view';


// ----------------------------------------------------------------------

export default function BatchEditPage() {
  const params = useParams();

  const { id } = params;

  return (
    <>
      <Helmet>
        <title> Dashboard: Batch Edit</title>
      </Helmet>

      <BatchEditView id={`${id}`} />
    </>
  );
}
