import React from 'react';
import PropTypes from 'prop-types';
import Container from '@mui/material/Container';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
import { paths } from 'src/routes/paths';
import ProfileEditForm from '../profile-edit';

export default function ProfileEditView() {
  return (
    <Container maxWidth="lg">
      <CustomBreadcrumbs
        heading="Edit"
        links={[{ name: 'Dashboard', href: paths.dashboard.root }, { name: 'Profile Edit' }]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      <ProfileEditForm />
    </Container>
  );
}
