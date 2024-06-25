import { Helmet } from 'react-helmet-async';

import { useParams } from 'src/routes/hooks';

import { StudentEditView } from 'src/sections/student/view';
import GuardianView from 'src/sections/student/guardian/student-guardian-view';

// ----------------------------------------------------------------------

export default function UserEditPage() {
  const params = useParams();

  const { id } = params;

  return (
    <>
      <Helmet>
        <title> Dashboard: Student Edit</title>
      </Helmet>

      <GuardianView id={`${id}`} />
    </>
  );
}
