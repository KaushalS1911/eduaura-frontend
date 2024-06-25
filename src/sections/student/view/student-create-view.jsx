import { useState, useCallback, useEffect } from 'react';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Container from '@mui/material/Container';
import { paths } from 'src/routes/paths';
import { _userPlans, _userPayment, _userInvoices, _userAddressBook } from 'src/_mock';
import Iconify from 'src/components/iconify';
import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
import StudentAccountGeneral from '../student-account-general';
import StudentAccountChangePassword from '../student-account-change-password';
import StudentAccountBillingHistory from '../student-account-billing-history';
import StudentAttendanceListView from '../attendance/student-attendance-list-view';
import ExaminationListView from '../examination/examination-list-view';
import StudentNewEditForm from '../student-new-edit-form';
import { useGetSingleStudent, useGetStudents } from 'src/api/student';
import RemarkView from './remarks/remark-view';
import GuardianView from '../guardian/student-guardian-view';
import FeesView from '../feesDetails/fee-installment-view';
import StudentAttendanceView from '../attendance/student-attendance-view';
import StudentDetailsView from '../progress/student-details-view';
// ----------------------------------------------------------------------
const TABS = [
  {
    value: 'Personal Details',
    label: 'Personal Details',
    icon: <Iconify icon="solar:user-id-bold" width={24} />,
  },
  {
    value: 'Guardian Info',
    label: 'Guardian Info',
    icon: <Iconify icon="solar:bill-list-bold" width={24} />,
  },
  {
    value: 'fees details',
    label: 'Fees Details',
    icon: <Iconify icon="solar:bell-bing-bold" width={24} />,
  },
  {
    value: 'Attendance',
    label: 'Attendance',
    icon: <Iconify icon="solar:share-bold" width={24} />,
  },
  // {
  //   value: 'Progress',
  //   label: 'Progress',
  //   icon: <Iconify icon="ic:round-vpn-key" width={24} />,
  // },
  {
    value: 'Examination',
    label: 'Examination',
    icon: <Iconify icon="ic:round-vpn-key" width={24} />,
  },
  // {
  //   value: 'Complains',
  //   label: 'Complains',
  //   icon: <Iconify icon="ic:round-vpn-key" width={24} />,
  // },
  {
    value: 'Remarks',
    label: 'Remarks',
    icon: <Iconify icon="ic:round-vpn-key" width={24} />,
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
          heading="Student"
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
      {currentStudent &&
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
      }
      {currentTab === 'Personal Details' && (
        <StudentNewEditForm currentStudent={currentStudent} mutate={mutate} />
      )}
      {currentTab === 'Guardian Info' && (
        <GuardianView currentStudent={currentStudent} mutate={mutate} />
      )}
      {currentTab === 'fees details' && <FeesView currentStudent={currentStudent} />}
      {currentTab === 'Attendance' && <StudentAttendanceView currentStudent={currentStudent} />}
      {currentTab === 'Progress' && <StudentDetailsView currentStudent={currentStudent} />}
      {currentTab === 'Examination' && <ExaminationListView currentStudent={currentStudent} />}
      {currentTab === 'Remarks' && <RemarkView currentStudent={currentStudent} mutate={mutate} />}
    </Container>
  );
}
