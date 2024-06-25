import PropTypes from 'prop-types';

import Container from '@mui/material/Container';

import { paths } from 'src/routes/paths';

import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';

import EmployeeNewEditForm from '../employee-new-edit-form';
import { useGetSingleEmployee } from 'src/api/employee';

// ----------------------------------------------------------------------

export default function EmployeeEditView({ id }) {
  const settings = useSettingsContext();
  const { employee } = useGetSingleEmployee(id);

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
            name: 'Employee',
            href: paths.dashboard.employee.list,
          },
          { name: 'Employee Edit' },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />

      {employee && <EmployeeNewEditForm employee={employee} />}
    </Container>
  );
}

EmployeeEditView.propTypes = {
  id: PropTypes.string,
};
