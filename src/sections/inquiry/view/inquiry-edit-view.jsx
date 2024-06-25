import React from 'react';
import PropTypes from 'prop-types';
import Container from '@mui/material/Container';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
import { paths } from 'src/routes/paths';
import InquiryNewEditForm from '../inquiry-new-edit-form';

export default function InquiryEditView({ id }) {
  
  return (
    <Container maxWidth="lg">
      <CustomBreadcrumbs
        heading="Edit"
        links={[
          { name: 'Dashboard', href: paths.dashboard.root },
          { name: 'Inquiry', href: paths.dashboard.inquiry.list },
          { name: 'Inquiry Edit'},
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      <InquiryNewEditForm inquiryId={id} />
    </Container>
  );
}

InquiryEditView.propTypes = {
  id: PropTypes.string,
};
