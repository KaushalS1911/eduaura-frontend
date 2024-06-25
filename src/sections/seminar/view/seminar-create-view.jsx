import Container from '@mui/material/Container';

import { paths } from 'src/routes/paths';

import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';

import SeminarNewEditForm from '../seminar-new-edit-form';

// ----------------------------------------------------------------------

export default function SeminarCreateView() {
  const settings = useSettingsContext();

  return (
    <Container maxWidth={settings.themeStretch ? false : 'xl'}>
      <CustomBreadcrumbs
        heading="Create a new employee"
        links={[
          {
            name: 'Dashboard',
            href: paths.dashboard.root,
          },
          {
            name: 'Seminar',
            href: paths.dashboard.seminar.list,
          },
          { name: 'New Seminar' },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />

      <SeminarNewEditForm />
    </Container>
  );
}
