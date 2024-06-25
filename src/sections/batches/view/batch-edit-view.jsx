import PropTypes from 'prop-types';

import Container from '@mui/material/Container';

import { paths } from 'src/routes/paths';

import { _userList } from 'src/_mock';

import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
import BatchNewEditForm from '../batch-new-edit-form';

// ----------------------------------------------------------------------

export default function BatchEditView({ id }) {
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
            name: 'Batches',
            href: paths.dashboard.batches.root,
          },
          { name: 'Edit' },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />

      <BatchNewEditForm batchId={id} />
    </Container>
  );
}

BatchEditView.propTypes = {
  id: PropTypes.string,
};
