import PropTypes from 'prop-types';

import Container from '@mui/material/Container';

import { paths } from 'src/routes/paths';

import { _invoices } from 'src/_mock';

import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
import { useGetSingleStudent } from 'src/api/student';
import InvoiceDetails from './invoice-details';
import { useParams } from 'src/routes/hooks';

// ----------------------------------------------------------------------

export default function InvoiceDetailsView() {
  const params = useParams();
  const { data, mutate } = useGetSingleStudent(params.id);
  const settings = useSettingsContext();

  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      <CustomBreadcrumbs
        heading="Fee Invoice"
        links={[
          {
            name: 'Dashboard',
            href: paths.dashboard.root,
          },
          {
            name: 'Fees',
            href: paths.dashboard.general.fees,
          },
          { name: 'ER Number' + ' ' + data?.enrollment_no },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      <InvoiceDetails invoice={data} />
    </Container>
  );
}

InvoiceDetailsView.propTypes = {
  id: PropTypes.string,
};
