import { Helmet } from 'react-helmet-async';

import ExamPage from 'src/sections/examination/exam-overview/exam-page';

// ----------------------------------------------------------------------

export default function ExaminationEditPage() {
  return (
    <>
      <Helmet>
        <title> Dashboard: Examination OverView</title>
      </Helmet>

      <ExamPage />
    </>
  );
}
