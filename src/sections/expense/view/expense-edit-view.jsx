import PropTypes from 'prop-types';

import Container from '@mui/material/Container';

import { paths } from 'src/routes/paths';

import { _userList } from 'src/_mock';

import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
import ExpenseNewEditForm from '../expenses-new-edit-form';

// ----------------------------------------------------------------------

export default function ExpenseEditView({ id }) {
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
            name: 'Expense',
            href: paths.dashboard.expenses.root,
          },
          { name: 'Form' },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />

      <ExpenseNewEditForm expensesId={id} />
    </Container>
  );
}

ExpenseEditView.propTypes = {
  id: PropTypes.string,
};
