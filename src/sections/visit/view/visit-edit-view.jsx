import PropTypes from 'prop-types';

import Container from '@mui/material/Container';

import { paths } from 'src/routes/paths';

import { _userList } from 'src/_mock';

import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
import VisitNewEditForm from '../visit-new-edit-form';

// ----------------------------------------------------------------------

export default function VisitEditView({ id }) {
  const settings = useSettingsContext();

  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      <CustomBreadcrumbs
        heading="Edit"
        links={[
          {
            name: 'Dashboard',
            href: paths.dashboard.root,
          },
          {
            name: 'Visit',
            href: paths.dashboard.visit.root,
          },
          { name: 'Form' },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />

      <VisitNewEditForm expensesId={id} />
    </Container>
  );
}

VisitEditView.propTypes = {
  id: PropTypes.string,
};
