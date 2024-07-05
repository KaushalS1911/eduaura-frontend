import PropTypes from 'prop-types';

import Container from '@mui/material/Container';

import { paths } from 'src/routes/paths';

import { _invoices } from 'src/_mock';

import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
import { useGetSingleStudent } from 'src/api/student';
import StudentDetails from './student-details';
import { useParams } from 'src/routes/hooks';

// ----------------------------------------------------------------------

export default function StudentPage() {
  const params = useParams();
  const { data, mutate } = useGetSingleStudent(params.id);
  const settings = useSettingsContext();

  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      <CustomBreadcrumbs
        heading="Student View"
        links={[
          {
            name: 'Dashboard',
            href: paths.dashboard.root,
          },
          {
            name: 'student',
            href: paths.dashboard.student.list,
          },
          { name: 'ER Number' + ' ' + data?.enrollment_no },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />
      <StudentDetails studentData={data} />
    </Container>
  );
}

StudentPage.propTypes = {
  id: PropTypes.string,
};
