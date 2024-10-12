import PropTypes from 'prop-types';

import Container from '@mui/material/Container';

import { paths } from 'src/routes/paths';

import { _invoices } from 'src/_mock';

import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
import { useGetSingleStudent } from 'src/api/student';
import { useParams } from 'src/routes/hooks';
import ExamDetails from './exam-details';
import { useGetSingleExam } from 'src/api/examination';

// ----------------------------------------------------------------------

export default function ExamPage() {
  const params = useParams();
  const { batchExamData } = useGetSingleExam(params.batchExamId);
  const settings = useSettingsContext();

  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      <CustomBreadcrumbs
        heading="ExamResult View"
        links={[
          {
            name: 'Dashboard',
            href: paths.dashboard.root,
          },
          {
            name: 'Exam',
            href: paths.dashboard.examination.list,
          },
          {
            name: 'ExamResult',
          },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />
      <ExamDetails examData={batchExamData} />
    </Container>
  );
}

ExamPage.propTypes = {
  id: PropTypes.string,
};
