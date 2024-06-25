import Container from '@mui/material/Container';

import { paths } from 'src/routes/paths';

import { useSettingsContext } from 'src/components/settings';

import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';

import StudentCreateView from 'src/sections/student/view/student-create-view';
import { useParams } from 'src/routes/hooks';
import { useGetSingleStudent } from 'src/api/student';
import { useEffect, useState } from 'react';

// ----------------------------------------------------------------------

export default function StudentEditView({ id }) {
  const settings = useSettingsContext();
  const { data, mutate } = useGetSingleStudent(id);

  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      <CustomBreadcrumbs
        heading="Edit Student"
        links={[
          {
            name: 'Dashboard',
            href: paths.dashboard.root,
          },
          {
            name: 'Student',
            href: paths.dashboard.student.list,
          },
          {
            name: 'Edit Student',
            href: paths.dashboard.root,
          },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />


      {data && <StudentCreateView currentStudent={data} mutate={mutate} />}
    </Container>
  );
}
