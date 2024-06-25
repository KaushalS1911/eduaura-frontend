import Button from '@mui/material/Button';
import Container from '@mui/material/Container';

import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';


import Iconify from 'src/components/iconify';

import { useSettingsContext } from 'src/components/settings';

import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';

import StudentCardList from '../student-card-list';

// ----------------------------------------------------------------------

export default function StudentCardsView() {
  const settings = useSettingsContext();

  return (
    <Container maxWidth={settings.themeStretch ? false : 'xl'}>
      <CustomBreadcrumbs
        heading="Student Cards"
        links={[
          { name: 'Dashboard', href: paths.dashboard.root },
          { name: 'Students', href: paths.dashboard.student.list },
          { name: 'Cards' },
        ]}
        action={
          <Button
            component={RouterLink}
            href={paths.dashboard.student.new}
            variant="contained"
            startIcon={<Iconify icon="mingcute:add-line" />}
          >
            New Stdent
          </Button>
        }
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      <StudentCardList />
    </Container>
  );
}
