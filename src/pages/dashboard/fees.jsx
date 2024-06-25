import { Helmet } from 'react-helmet-async';
import { FeesDetailsPage } from 'src/sections/overview/fees/view';


// ----------------------------------------------------------------------

export default function OverviewFilePage() {
  return (
    <>
      <Helmet>
        <title> Dashboard: File</title>
      </Helmet>

          <FeesDetailsPage />
    </>
  );
}
