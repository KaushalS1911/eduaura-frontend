import { Helmet } from 'react-helmet-async';
import { TaskListView } from 'src/sections/task/view';


// ----------------------------------------------------------------------

export default function TaskListPage() {
  return (
    <>
      <Helmet>
        <title> Dashboard: Task List</title>
      </Helmet>

      <TaskListView />
    </>
  );
}
