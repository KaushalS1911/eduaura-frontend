import { Helmet } from 'react-helmet-async';

import { useParams } from 'src/routes/hooks';
import { TaskCreateView } from 'src/sections/task/view';


// ----------------------------------------------------------------------

export default function TaskCreatePage() {
 

  return (
    <>
      <Helmet>
        <title> Dashboard: Task Create</title>
      </Helmet>

      <TaskCreateView />
    </>
  );
}
