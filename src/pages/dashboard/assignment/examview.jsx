import { Helmet } from 'react-helmet-async';

import ExamPage from 'src/sections/examination/exam-overview/exam-page';

// ----------------------------------------------------------------------

export default function AssignmentEditPage() {
  return (
    <>
      <Helmet>
        <title> Dashboard: Assignment OverView</title>
      </Helmet>

      <ExamPage />
    </>
  );
}
