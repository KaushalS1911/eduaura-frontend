import { Helmet } from 'react-helmet-async';

import { useParams } from 'src/routes/hooks';
import { TaskEditView } from 'src/sections/task/view';


// ----------------------------------------------------------------------

export default function TaskEditPage() {
  const params = useParams();

  const { id } = params;

  return (
    <>
      <Helmet>
        <title> Dashboard: Task Edit</title>
      </Helmet>

      <TaskEditView id={`${id}`} />
    </>
  );
}
