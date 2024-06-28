import { Container } from '@mui/system';
import React from 'react';
import { _mock } from 'src/_mock';
import { useAuthContext } from 'src/auth/hooks';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
import { useSettingsContext } from 'src/components/settings';
import { paths } from 'src/routes/paths';
import FeesListView from './fees-list-view';

const FeesDetailsPage = () => {
  const settings = useSettingsContext();
  //   const user = useAuthContext();

  return (
    <>
      <Container maxWidth={settings.themeStretch ? false : 'lg'}>
        {/* <CustomBreadcrumbs
          heading="Fees"
          links={[
            { name: 'Dashboard', href: paths.dashboard.root },
            { name: 'Fees', href: paths.dashboard.general.fees },
          ]}
          sx={{
            mb: { xs: 3, md: 5 },
          }}
              /> */}
        <FeesListView />
      </Container>
    </>
  );
};

export default FeesDetailsPage;
