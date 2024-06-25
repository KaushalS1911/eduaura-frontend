import { Helmet } from 'react-helmet-async';

import { useParams } from 'src/routes/hooks';
import { ExpenseEditView } from 'src/sections/expense/view';


// ----------------------------------------------------------------------

export default function ExpensesEditPage() {
  const params = useParams();

  const { id } = params;

  return (
    <>
      <Helmet>
        <title> Dashboard: Expense Edit</title>
      </Helmet>

      <ExpenseEditView id={`${id}`} />
    </>
  );
}
