import React, { useMemo } from 'react';

import { paths } from 'src/routes/paths';

import { useTranslate } from 'src/locales';

// import Label from 'src/components/label';
import Iconify from 'src/components/iconify';
import SvgColor from 'src/components/svg-color';
import { useAuthContext } from 'src/auth/hooks';

// ----------------------------------------------------------------------

const icon = (name) => (
  <SvgColor src={`/assets/icons/navbar/${name}.svg`} sx={{ width: 1, height: 1 }} />
);

const ICONS = {
  job: icon('ic_job'),
  blog: icon('ic_blog'),
  chat: icon('ic_chat'),
  mail: icon('ic_mail'),
  user: icon('ic_user'),
  student: <Iconify icon="ph:student-bold" sx={{ width: 1, height: 1 }} />,
  employee: <Iconify icon="clarity:employee-solid" sx={{ width: 1, height: 1 }} />,
  inquiry: <Iconify icon="heroicons-solid:newspaper" sx={{ width: 1, height: 1 }} />,
  demo: <Iconify icon="material-symbols:demography-outline" sx={{ width: 1, height: 1 }} />,
  seminar: <Iconify icon="material-symbols:overview-sharp" sx={{ width: 1, height: 1 }} />,
  attandance: <Iconify icon="fluent:clipboard-task-list-20-filled" sx={{ width: 1, height: 1 }} />,
  expenses: <Iconify icon="mingcute:wallet-fill" sx={{ width: 1, height: 1 }} />,
  task: <Iconify icon="fluent:task-list-square-person-20-filled" sx={{ width: 1, height: 1 }} />,
  visit: <Iconify icon="material-symbols:nest-doorbell-visitor" sx={{ width: 1, height: 1 }} />,
  exam: <Iconify icon="healthicons:i-exam-multiple-choice-negative" sx={{ width: 1, height: 1 }} />,
  file: icon('ic_file'),
  lock: icon('ic_lock'),
  tour: icon('ic_tour'),
  order: icon('ic_order'),
  label: icon('ic_label'),
  blank: icon('ic_blank'),
  kanban: icon('ic_kanban'),
  folder: icon('ic_folder'),
  banking: icon('ic_banking'),
  booking: icon('ic_booking'),
  invoice: icon('ic_invoice'),
  product: icon('ic_product'),
  calendar: icon('ic_calendar'),
  disabled: icon('ic_disabled'),
  external: icon('ic_external'),
  menuItem: icon('ic_menu_item'),
  ecommerce: icon('ic_ecommerce'),
  analytics: icon('ic_analytics'),
  dashboard: icon('ic_dashboard'),
  batches: <Iconify icon="mdi:google-classroom" sx={{ width: 1, height: 1 }} />,
};

// ----------------------------------------------------------------------
export function useNavData() {
  const { user } = useAuthContext();
  const { t } = useTranslate();

  const data = useMemo(
    () => [
      // OVERVIEW
      // ----------------------------------------------------------------------
      {
        subheader: t('overview'),
        items: [
          {
            title: t('dashboard'),
            path: paths.dashboard.root,
            icon: ICONS.dashboard,
          },
          // ACCOUNT
          user?.role === 'Admin' && {
            title: t('account'),
            path: paths.dashboard.account.root,
            icon: ICONS.user,
          },
        ].filter(Boolean),
      },

      // MANAGEMENT
      // ----------------------------------------------------------------------
      {
        subheader: t('management'),
        items: [
          // VISIT
          {
            title: t('visit'),
            path: paths.dashboard.visit.list,
            icon: ICONS.visit,
          },
          // INQUIRY
          {
            title: t('inquiry'),
            path: paths.dashboard.inquiry.list,
            icon: ICONS.inquiry,
          },
          // DEMO
          {
            title: t('Demo'),
            path: paths.dashboard.demo.root,
            icon: ICONS.demo,
          },
          // STUDENT
          user?.role !== 'student' && {
            title: t('student'),
            path: paths.dashboard.student.list,
            icon: ICONS.student,
          },

          // EMPLOYEE
          {
            title: t('employee'),
            path: paths.dashboard.employee.list,
            icon: ICONS.employee,
          },
        ].filter(Boolean), // Filter out any falsy values
      },
      {
        subheader: t('management'),
        items: [
          // BATCH
          {
            title: t('batches'),
            path: paths.dashboard.batches.root,
            icon: ICONS.batches,
          },
          // ATTENDANCE
          {
            title: t('attendance'),
            path: paths.dashboard.attendance.root,
            icon: ICONS.attandance,
          },
          // EXAM
          {
            title: t('exam'),
            path: paths.dashboard.examination.list,
            icon: ICONS.exam,
          },
          // SEMINAR
          {
            title: t('seminar'),
            path: paths.dashboard.seminar.list,
            icon: ICONS.seminar,
          },
          // FEES
          {
            title: t('fees'),
            path: paths.dashboard.general.fees,
            icon: ICONS.invoice,
          },
        ],
      },
      {
        subheader: t('management'),
        items: [
          // CALENDAR
          {
            title: t('calendar'),
            path: paths.dashboard.calendar,
            icon: ICONS.calendar,
          },
          // EXPENSES
          {
            title: t('expenses'),
            path: paths.dashboard.expenses.list,
            icon: ICONS.expenses,
          },
          // TASK
          {
            title: t('task'),
            path: paths.dashboard.task.list,
            icon: ICONS.task,
          },
          // COMPLAIN
          {
            title: t('Complaints'),
            path: paths.dashboard.complain.root,
            icon: ICONS.file,
          },
          // KANBAN
          // {
          //   title: t('kanban'),
          //   path: paths.dashboard.kanban,
          //   icon: ICONS.kanban,
          // },
        ],
      },
    ],
    [t, user?.role] // Include user.role as a dependency
  );

  return data;
}
