import Container from '@mui/material/Container';

import { paths } from 'src/routes/paths';

import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
import TaskNewForm from '../task-new-form';


// ----------------------------------------------------------------------

export default function TaskCreateView() {
  const settings = useSettingsContext();

  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      <CustomBreadcrumbs
        heading="Create a new task"
        links={[
          {
            name: 'Dashboard',
            href: paths.dashboard.root,
          },
          {
            name: 'Task',
            href: paths.dashboard.task.root,
          },
          { name: 'New Task' },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />

      <TaskNewForm />
    </Container>
  );
}
