import { Helmet } from 'react-helmet-async';

import { ExaminationListView } from 'src/sections/examination/view';

// ----------------------------------------------------------------------

export default function ExaminationListPage() {
  return (
    <>
      <Helmet>
        <title> Dashboard: Examination List</title>
      </Helmet>

      <ExaminationListView />
    </>
  );
}
