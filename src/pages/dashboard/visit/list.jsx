import { Helmet } from 'react-helmet-async';

import VisitListView from 'src/sections/visit/view/visit-list-view';

// ----------------------------------------------------------------------

export default function VisitListPage() {
  return (
    <>
      <Helmet>
        <title> Dashboard: Visit List</title>
      </Helmet>

      <VisitListView />
    </>
  );
}
