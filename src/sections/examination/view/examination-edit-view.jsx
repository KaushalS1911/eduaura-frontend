import PropTypes from 'prop-types';

import Container from '@mui/material/Container';

import { paths } from 'src/routes/paths';

import { _userList } from 'src/_mock';

import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
import ExaminationNewEditForm from '../examination-new-edit-form';

// ----------------------------------------------------------------------

export default function ExaminationEditView({ id }) {
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
            name: 'Examination',
            href: paths.dashboard.examination.root,
          },
          { name: 'Form' },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />

      <ExaminationNewEditForm examinationId={id} />
    </Container>
  );
}

ExaminationEditView.propTypes = {
  id: PropTypes.string,
};
