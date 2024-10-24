import { useState, useCallback } from 'react';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Container from '@mui/material/Container';
import { paths } from 'src/routes/paths';
import Iconify from 'src/components/iconify';
import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
import ExaminationListView from '../examination/examination-list-view';
import StudentNewEditForm from '../student-new-edit-form';
import RemarkView from './remarks/remark-view';
import GuardianView from '../guardian/student-guardian-view';
import FeesView from '../feesDetails/fee-installment-view';
import StudentAttendanceView from '../attendance/student-attendance-view';
import StudentDetailsView from '../progress/student-details-view';
import StudentAssignmentView from '../assignment/student-assignment-view';

// ----------------------------------------------------------------------

const TABS = [
  {
    value: 'Personal Details',
    label: 'Personal Details',
    icon: <Iconify icon='mdi:card-account-details' width={24} />,
  },
  {
    value: 'Guardian Info',
    label: 'Guardian Info',
    icon: <Iconify icon='fluent:guardian-24-regular' width={24} />,
  },
  {
    value: 'fees details',
    label: 'Fees Details',
    icon: <Iconify icon='tdesign:money' width={24} />,
  },
  {
    value: 'Attendance',
    label: 'Attendance',
    icon: <Iconify icon='ic:outline-co-present' width={24} />,
  },
  {
    value: 'Assignment',
    label: 'Assignment',
    icon: <Iconify icon='material-symbols:assignment-add-sharp' width={24} />,
  },
  {
    value: 'Examination',
    label: 'Examination',
    icon: <Iconify icon='healthicons:i-exam-multiple-choice-outline' width={24} />,
  },
  {
    value: 'Progress',
    label: 'Progress',
    icon: <Iconify icon='grommet-icons:in-progress' width={24} />,
  },
  {
    value: 'Remarks',
    label: 'Remarks',
    icon: <Iconify icon='ic:round-vpn-key' width={24} />,
  },
];

// ----------------------------------------------------------------------

export default function StudentCreateView({ currentStudent, mutate }) {
  const settings = useSettingsContext();
  const [currentTab, setCurrentTab] = useState('Personal Details');

  const handleChangeTab = useCallback((event, newValue) => {
    setCurrentTab(newValue);
  }, []);

  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      {!currentStudent && (
        <CustomBreadcrumbs
          heading='Student'
          links={[
            { name: 'Dashboard', href: paths.dashboard.root },
            { name: 'Student', href: paths.dashboard.student.list },
            { name: 'New Student' },
          ]}
          sx={{
            mb: { xs: 3, md: 5 },
          }}
        />
      )}
      {currentStudent && (
        <Tabs
          value={currentTab}
          onChange={handleChangeTab}
          sx={{
            mb: { xs: 3, md: 5 },
          }}
        >
          {TABS.map((tab) => (
            <Tab key={tab.value} label={tab.label} icon={tab.icon} value={tab.value} />
          ))}
        </Tabs>
      )}
      {currentTab === 'Personal Details' && (
        <StudentNewEditForm currentStudent={currentStudent} mutate={mutate} />
      )}
      {currentTab === 'Guardian Info' && (
        <GuardianView currentStudent={currentStudent} mutate={mutate} />
      )}
      {currentTab === 'fees details' && <FeesView currentStudent={currentStudent} />}
      {currentTab === 'Attendance' && <StudentAttendanceView currentStudent={currentStudent} />}
      {currentTab === 'Assignment' && <StudentAssignmentView currentStudent={currentStudent} />}
      {currentTab === 'Progress' && (
        <StudentDetailsView currentStudent={currentStudent} mutate={mutate} />
      )}
      {currentTab === 'Examination' && <ExaminationListView currentStudent={currentStudent} />}
      {currentTab === 'Remarks' && <RemarkView currentStudent={currentStudent} mutate={mutate} />}
    </Container>
  );
}
