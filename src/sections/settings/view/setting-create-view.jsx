import React, { useState, useCallback } from 'react';
import Iconify from 'src/components/iconify';
import { useSettingsContext } from 'src/components/settings';
import Container from '@mui/material/Container';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
import { paths } from 'src/routes/paths';
import AppbanerCreate from './app-banner-create';
import CompanyProfile from './company-profile-create-view';
import CourseCreatePage from './course-create-view';
import EmployeeCreatePage from './employee-role-crete-view';
import Labcreatepage from './lab-create-view';
import Userrolecreatepage from './user-role-create-view';
import ExpensesCreatePage from './expenses-create-view';
import Developercreatepage from './developer-role-create-view';

const TABS = [
  {
    value: 'Company Profile',
    label: 'Company Profile',
    icon: <Iconify icon="mdi:company" width={24} />,
  },
  {
    value: 'User Role',
    label: 'User Role',
    icon: <Iconify icon="fa6-solid:user-gear" width={24} />,
  },
  {
    value: 'Employee Role',
    label: 'Employee Role',
    icon: <Iconify icon="clarity:employee-solid" width={24} />,
  },
  {
    value: 'Expeneses',
    label: 'Expeneses',
    icon: <Iconify icon="mingcute:wallet-fill" width={24} />,
  },
  {
    value: 'Courses',
    label: 'Courses',
    icon: <Iconify icon="hugeicons:course" width={24} />,
  },
  {
    value: 'Lab',
    label: 'Lab',
    icon: <Iconify icon="mdi:google-classroom" width={24} />,
  },
  {
    value: 'Developer Option',
    label: 'Developer Option',
    icon: <Iconify icon="material-symbols:developer-mode-tv-outline-rounded" width={24} />,
  },
  {
    value: 'Application Banner',
    label: 'Application Banner',
    icon: <Iconify icon="mdi:application-edit" width={24} />,
  },
];

export default function SettingsPage() {
  const settings = useSettingsContext();

  const [currentTab, setCurrentTab] = useState('Expeneses');

  const handleChangeTab = useCallback((event, newValue) => {
    setCurrentTab(newValue);
  }, []);

  return (
    <>
      <Container maxWidth={settings.themeStretch ? false : 'lg'}>
        <CustomBreadcrumbs
          heading="Settings"
          links={[{ name: 'Dashboard', href: paths.dashboard.root }, { name: 'Settings' }]}
          sx={{
            mb: { xs: 3, md: 5 },
          }}
        />

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

        {currentTab === 'Expeneses' && <ExpensesCreatePage />}
        {currentTab === 'Company Profile' && <CompanyProfile />}
        {currentTab === 'User Role' && <Userrolecreatepage />}
        {currentTab === 'Courses' && <CourseCreatePage />}
        {currentTab === 'Lab' && <Labcreatepage />}
        {currentTab === 'Employee Role' && <EmployeeCreatePage />}
        {currentTab === 'Developer Option' && <Developercreatepage />}
        {currentTab === 'Application Banner' && <AppbanerCreate />}
      </Container>
    </>
  );
}
