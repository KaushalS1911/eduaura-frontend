import { Helmet } from 'react-helmet-async';
import { AccountView } from 'src/sections/main_account/view';

// ----------------------------------------------------------------------

export default function DemoListPage() {
  return (
    <>
      <Helmet>
        <title> Dashboard: Demo List</title>
      </Helmet>
      <AccountView />
    </>
  );
}
