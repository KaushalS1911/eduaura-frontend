import Container from '@mui/material/Container';

import { paths } from 'src/routes/paths';

import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
import VisitNewForm from '../visit-new-form';


// ----------------------------------------------------------------------

export default function VisitCreateView() {
  const settings = useSettingsContext();

  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      <CustomBreadcrumbs
        heading="Create a new visit"
        links={[
          {
            name: 'Dashboard',
            href: paths.dashboard.root,
          },
          {
            name: 'Visit',
            href: paths.dashboard.visit.root,
          },
          { name: 'New Visit' },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />

      <VisitNewForm />
    </Container>
  );
}
