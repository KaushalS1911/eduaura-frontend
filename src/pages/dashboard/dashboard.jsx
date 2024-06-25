import { Helmet } from 'react-helmet-async';
import DashboardView from 'src/sections/dashboard-view/view/dashboard-view';


// ----------------------------------------------------------------------

export default function OverviewDashboardPage() {
  return (
    <>
      <Helmet>
        <title> Dashboard: App</title>
      </Helmet>

      <DashboardView />
    </>
  );
}
