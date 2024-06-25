import { Helmet } from 'react-helmet-async';

import { useParams } from 'src/routes/hooks';
import { ExaminationEditView } from 'src/sections/examination/view';


// ----------------------------------------------------------------------

export default function ExaminationEditPage() {
  const params = useParams();

  const { id } = params;

  return (
    <>
      <Helmet>
        <title> Dashboard: Examination Edit</title>
      </Helmet>

      <ExaminationEditView id={`${id}`} />
    </>
  );
}
