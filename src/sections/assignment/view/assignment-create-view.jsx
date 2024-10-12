import Container from '@mui/material/Container';

import { paths } from 'src/routes/paths';

import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
import AssignmentNewForm from '../assignment-new-form';


// ----------------------------------------------------------------------

export default function AssignmentCreateView() {
  const settings = useSettingsContext();

  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      <CustomBreadcrumbs
        heading="Create a new assignment"
        links={[
          {
            name: 'Dashboard',
            href: paths.dashboard.root,
          },
          {
            name: 'Assignment',
            href: paths.dashboard.assignment.root,
          },
          { name: 'New Assignment' },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />

      <AssignmentNewForm />
    </Container>
  );
}
