import { Helmet } from 'react-helmet-async';


import { SeminarCreateView } from 'src/sections/seminar/view';

// ----------------------------------------------------------------------

export default function SeminarCreatePage() {
  return (
    <>
      <Helmet>
        <title> Dashboardd:Create a new Seminar</title>
      </Helmet>

      <SeminarCreateView />
    </>
  );
}
