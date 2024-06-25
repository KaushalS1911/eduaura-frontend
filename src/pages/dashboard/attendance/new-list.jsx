import { Helmet } from 'react-helmet-async';
import { AddAttendanceListView } from 'src/sections/attendance/view';

// ----------------------------------------------------------------------

export default function DemoListPage() {
  return (
    <>
      <Helmet>
        <title> Dashboard: Demo List</title>
      </Helmet>
      <AddAttendanceListView />
    </>
  );
}
