import { Helmet } from 'react-helmet-async';

import { useParams } from 'src/routes/hooks';

import SeminarEditView from 'src/sections/seminar/view/seminar-edit-view';

// ----------------------------------------------------------------------

export default function SeminarEditPage() {
  const params = useParams();
  const { id } = params;

  return (
    <>
      <Helmet>
        <title> Dashboard: Seminar Edit</title>
      </Helmet>

      <SeminarEditView id={`${id}`} />
    </>
  );
}
