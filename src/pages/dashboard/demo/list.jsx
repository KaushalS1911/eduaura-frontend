import { Helmet } from 'react-helmet-async';
import DemoListView from 'src/sections/demo/view/demo-list-view';

// ----------------------------------------------------------------------

export default function DemoListPage() {
  return (
    <>
      <Helmet>
        <title> Dashboard: Demo List</title>
      </Helmet>
      <DemoListView />
    </>
  );
}
