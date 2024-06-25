import { Helmet } from 'react-helmet-async';
import { BatchListView } from 'src/sections/batches/view';


// ----------------------------------------------------------------------

export default function BatchListPage() {
  return (
    <>
      <Helmet>
        <title> Dashboard: Batch List</title>
      </Helmet>

      <BatchListView />
    </>
  );
}
