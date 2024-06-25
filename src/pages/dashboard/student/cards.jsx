import { Helmet } from 'react-helmet-async';

import { StudentCardsView } from 'src/sections/student/view';

// ----------------------------------------------------------------------

export default function StudentCardsPage() {
  return (
    <>
      <Helmet>
        <title> Dashboard: Student Cards</title>
      </Helmet>
      
      <StudentCardsView />
    </>
  );
}
