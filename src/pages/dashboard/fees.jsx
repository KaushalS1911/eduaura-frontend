import { Helmet } from 'react-helmet-async';
import { FeesDetailsPage } from 'src/sections/fees/view';


// ----------------------------------------------------------------------

export default function FeesPage() {
  return (
    <>
      <Helmet>
        <title> Dashboard: File</title>
      </Helmet>

      <FeesDetailsPage />
    </>
  );
}
