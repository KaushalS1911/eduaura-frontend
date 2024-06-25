import { Helmet } from 'react-helmet-async';

import { useParams } from 'src/routes/hooks';
import ExpenseCreateView from 'src/sections/expense/view/expense-create-view';

// import { ExpenseEditView } from 'src/sections/expenses/view';

// ----------------------------------------------------------------------

export default function ExpensesCreatePage() {
  const params = useParams();

  const { id } = params;

  return (
    <>
      <Helmet>
        <title> Dashboard: Expense Create</title>
      </Helmet>

      {/* <ExpenseEditView id={`${id}`} /> */}
      <ExpenseCreateView />
    </>
  );
}
