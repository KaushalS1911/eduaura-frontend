import { Helmet } from 'react-helmet-async';

import { useParams } from 'src/routes/hooks';
import { ExaminationCreateView } from 'src/sections/examination/view';
// import ExaminationCreateView from 'src/sections/examination/view/examination-create-view';

// import { ExpenseEditView } from 'src/sections/expenses/view';

// ----------------------------------------------------------------------

export default function ExaminationCreatePage() {
  const params = useParams();

  const { id } = params;

  return (
    <>
      <Helmet>
        <title> Dashboard: Examination Create</title>
      </Helmet>

      {/* <ExpenseEditView id={`${id}`} /> */}
      <ExaminationCreateView />
    </>
  );
}
