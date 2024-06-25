import PropTypes from 'prop-types';

import Container from '@mui/material/Container';

import { paths } from 'src/routes/paths';

import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';

import SeminarNewEditForm from '../seminar-new-edit-form';

// ----------------------------------------------------------------------

export default function SeminarEditView({id}) {
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
            name: 'Seminar',
            href: paths.dashboard.seminar.list,
          },
          { name: 'Seminar Edit' },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />

      <SeminarNewEditForm SeminarId={id}/>
    </Container>
  );
}

SeminarEditView.propTypes = {
  id: PropTypes.string,
};
