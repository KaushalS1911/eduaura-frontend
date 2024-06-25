import { Helmet } from 'react-helmet-async';
import { AddAttendanceListView, AttendanceListView } from 'src/sections/attendance/view';

// ----------------------------------------------------------------------

export default function DemoListPage() {
  return (
    <>
      <Helmet>
        <title> Dashboard: Demo List</title>
      </Helmet>
      <AttendanceListView />
    </>
  );
}
