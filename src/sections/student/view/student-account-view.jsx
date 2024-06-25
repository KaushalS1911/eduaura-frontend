// import { useState, useCallback } from 'react';

// import Tab from '@mui/material/Tab';
// import Tabs from '@mui/material/Tabs';
// import Container from '@mui/material/Container';

// import { paths } from 'src/routes/paths';

// import {_userPlans, _userPayment, _userInvoices, _userAddressBook } from 'src/_mock';

// import Iconify from 'src/components/iconify';
// import { useSettingsContext } from 'src/components/settings';
// import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';

// import StudentAccountGeneral from '../student-account-general';
// import StudentAccountBilling from '../student-account-billing';
// import StudentAccountChangePassword from '../student-account-change-password';
// import StudentAccountBillingHistory from '../student-account-billing-history';

// import StudentAttendanceListView from './student-attendance-list-view';

// import ExaminationListView from './examination-list-view';

// import StudentComplainCreateView from './student-complain-create-view';

// // ----------------------------------------------------------------------

// const TABS = [
//   {
//     value: 'Personal Details',
//     label: 'Personal Details',
//     icon: <Iconify icon="solar:user-id-bold" width={24} />,
//   },
//   {
//     value: 'Guardian Info',
//     label: 'Guardian Info',
//     icon: <Iconify icon="solar:bill-list-bold" width={24} />,
//   },
//   {
//     value: 'fee details',
//     label: 'Fee Details',
//     icon: <Iconify icon="solar:bell-bing-bold" width={24} />,
//   },
//   {
//     value: 'Attendance',
//     label: 'Attendance',
//     icon: <Iconify icon="solar:share-bold" width={24} />,
//   },
//   {
//     value: 'Progress',
//     label: 'Progress',
//     icon: <Iconify icon="ic:round-vpn-key" width={24} />,
//   },
//   {
//     value: 'Examination',
//     label: 'Examination',
//     icon: <Iconify icon="ic:round-vpn-key" width={24} />,
//   },
//   {
//     value: 'Complains & remarks',
//     label: 'Complains & remarks',
//     icon: <Iconify icon="ic:round-vpn-key" width={24} />,
//   },
// ];

// // ----------------------------------------------------------------------

// export default function StudentAccountView() {
//   const settings = useSettingsContext();

//   const [currentTab, setCurrentTab] = useState('Personal Details');

//   const handleChangeTab = useCallback((event, newValue) => {
//     setCurrentTab(newValue);
//   }, []);


//   return (
//     <Container maxWidth={settings.themeStretch ? false : 'lg'}>
//       <CustomBreadcrumbs
//         heading="Account"
//         links={[
//           { name: 'Dashboard', href: paths.dashboard.root },
//           { name: 'Account' },
//         ]}
//         sx={{
//           mb: { xs: 3, md: 5 },
//         }}
//       />

//       <Tabs
//         value={currentTab}
//         onChange={handleChangeTab}
//         sx={{
//           mb: { xs: 3, md: 5 },
//         }}
//       >
//         {TABS.map((tab) => (
//           <Tab key={tab.value} label={tab.label} icon={tab.icon} value={tab.value} />
//         ))}
//       </Tabs>

//       {currentTab === 'Personal Details' && <StudentAccountGeneral />}

//       {currentTab === 'Guardian Info' && (
//         <StudentAccountBilling
//           plans={_userPlans}
//           cards={_userPayment}
//           invoices={_userInvoices}
//           addressBook={_userAddressBook}
//         />
//       )}
//       {currentTab === 'fee details' && <StudentAccountBillingHistory invoices={_userInvoices} />}

//       {currentTab === 'Attendance' && <StudentAttendanceListView />}

//       {currentTab === 'Progress' && <StudentAccountChangePassword />}

//       {currentTab === 'Examination' && <ExaminationListView />}

//       {currentTab === 'Complains & remarks' && <StudentComplainCreateView />}
//     </Container>
//   );
// }
