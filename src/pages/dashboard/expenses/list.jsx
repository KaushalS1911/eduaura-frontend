import { Helmet } from 'react-helmet-async';

import { ExpenseListView } from 'src/sections/expense/view';

// ----------------------------------------------------------------------

export default function ExpenseListPage() {
  return (
    <>
      <Helmet>
        <title> Dashboard: Expense List</title>
      </Helmet>

      <ExpenseListView />
    </>
  );
}
