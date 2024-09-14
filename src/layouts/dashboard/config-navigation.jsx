import React, { useMemo } from 'react';
import { paths } from 'src/routes/paths';
import { useTranslate } from 'src/locales';
import Iconify from 'src/components/iconify';
import SvgColor from 'src/components/svg-color';
import { useAuthContext } from 'src/auth/hooks';
import { useGetConfigs } from '../../api/config';

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
  student: <Iconify icon='ph:student-bold' sx={{ width: 1, height: 1 }} />,
  employee: <Iconify icon='clarity:employee-solid' sx={{ width: 1, height: 1 }} />,
  inquiry: <Iconify icon='heroicons-solid:newspaper' sx={{ width: 1, height: 1 }} />,
  demo: <Iconify icon='material-symbols:demography-outline' sx={{ width: 1, height: 1 }} />,
  seminar: <Iconify icon='material-symbols:overview-sharp' sx={{ width: 1, height: 1 }} />,
  attandance: <Iconify icon='fluent:clipboard-task-list-20-filled' sx={{ width: 1, height: 1 }} />,
  expenses: <Iconify icon='mingcute:wallet-fill' sx={{ width: 1, height: 1 }} />,
  task: <Iconify icon='fluent:task-list-square-person-20-filled' sx={{ width: 1, height: 1 }} />,
  visit: <Iconify icon='material-symbols:nest-doorbell-visitor' sx={{ width: 1, height: 1 }} />,
  exam: <Iconify icon='healthicons:i-exam-multiple-choice-negative' sx={{ width: 1, height: 1 }} />,
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
  setting: <Iconify icon='solar:settings-bold-duotone' width={24} />,
  batches: <Iconify icon='mdi:google-classroom' sx={{ width: 1, height: 1 }} />,
};

// ----------------------------------------------------------------------
export function useNavData() {
  const { user } = useAuthContext();
  const { t } = useTranslate();
  const { configs } = useGetConfigs();

  const navigationData = useMemo(
    () => [
      {
        subheader: t('overview'),
        items: [
          {
            title: t('dashboard'),
            path: paths.dashboard.root,
            icon: ICONS.dashboard,
          },
          {
            title: t('account'),
            path: paths.dashboard.account.root,
            icon: ICONS.user,
          },
        ],
      },
      {
        subheader: t('management'),
        items: [
          {
            title: t('visit'),
            path: paths.dashboard.visit.list,
            icon: ICONS.visit,
          },
          {
            title: t('inquiry'),
            path: paths.dashboard.inquiry.list,
            icon: ICONS.inquiry,
          },
          {
            title: t('Demo'),
            path: paths.dashboard.demo.root,
            icon: ICONS.demo,
          },
          user?.role !== 'student' && {
            title: t('student'),
            path: paths.dashboard.student.list,
            icon: ICONS.student,
          },
          {
            title: t('employee'),
            path: paths.dashboard.employee.list,
            icon: ICONS.employee,
          },
          {
            title: t('batches'),
            path: paths.dashboard.batches.root,
            icon: ICONS.batches,
          },
        ],
      },
      {
        subheader: t('academic'),
        items: [
          {
            title: t('attendance'),
            path: paths.dashboard.attendance.root,
            icon: ICONS.attandance,
          },
          {
            title: t('exam'),
            path: paths.dashboard.examination.list,
            icon: ICONS.exam,
          },
          {
            title: t('seminar'),
            path: paths.dashboard.seminar.list,
            icon: ICONS.seminar,
          },
        ],
      },
      {
        subheader: t('finance'),
        items: [
          {
            title: t('fees'),
            path: paths.dashboard.general.fees,
            icon: ICONS.invoice,
          },
          {
            title: t('expenses'),
            path: paths.dashboard.expenses.list,
            icon: ICONS.expenses,
          },
        ],
      },
      {
        subheader: t('productivity'),
        items: [
          {
            title: t('calendar'),
            path: paths.dashboard.calendar,
            icon: ICONS.calendar,
          },
          {
            title: t('task'),
            path: paths.dashboard.task.list,
            icon: ICONS.task,
          },
        ],
      },
      {
        subheader: t('support'),
        items: [
          {
            title: t('complaints'),
            path: paths.dashboard.complain.root,
            icon: ICONS.file,
          },
        ],
      },
      {
        subheader: t('config'),
        items: [
          {
            title: t('setting'),
            path: paths.dashboard.setting,
            icon: ICONS.setting,
          },
        ],
      },
    ],
    [t, user?.role],
    )
  ;

  // const adminNavData = useMemo(
  //   () => [
  //     // OVERVIEW
  //     // ----------------------------------------------------------------------
  //     ...navigationData, {
  //       subheader: t('config'),
  //       items: [
  //         // SETTING
  //         {
  //           title: t('setting'),
  //           path: paths.dashboard.setting,
  //           icon: ICONS.setting,
  //         },
  //       ].filter(Boolean),
  //     },
  //   ],
  //   [t], // Include user.role as a dependency
  // );

  // const sidebar_options = {
  //   'Faculty': {
  //     sections: ['visit', 'Student', 'Demo', 'Account', 'Dashboard'],
  //     responsibilities: {
  //       'view_dashboard': true,
  //       'view_account': true,
  //       'create_visit': true,
  //       'read_visit': true,
  //       'update_visit': true,
  //       'delete_visit': true,
  //       'create_inquiry': true,
  //       'read_inquiry': true,
  //       'update_inquiry': true,
  //       'delete_inquiry': true,
  //       'create_demo': true,
  //       'read_demo': true,
  //       'update_demo': true,
  //       'delete_demo': true,
  //       'create_student': true,
  //       'read_student': true,
  //       'update_student': true,
  //       'delete_student': true,
  //       'create_employee': true,
  //       'read_employee': true,
  //       'update_employee': true,
  //       'delete_employee': true,
  //       'create_batch': true,
  //       'read_batch': true,
  //       'update_batch': true,
  //       'delete_batch': true,
  //       'create_attendance': true,
  //       'read_attendance': true,
  //       'update_attendance': true,
  //       'delete_attendance': true,
  //       'create_exam': true,
  //       'read_exam': true,
  //       'update_exam': true,
  //       'delete_exam': true,
  //       'create_expense': true,
  //       'read_expense': true,
  //       'update_expense': true,
  //       'delete_expense': true,
  //       'create_event': true,
  //       'read_event': true,
  //       'update_event': true,
  //       'delete_event': true,
  //       'create_task': true,
  //       'read_task': true,
  //       'update_task': true,
  //       'delete_task': true,
  //       'create_complaint': true,
  //       'read_complaint': true,
  //       'update_complaint': true,
  //       'delete_complaint': true,
  //       'update_configuration': true,
  //       'update_permission': true,
  //       'invite_user': true,
  //       'update_company_details': true,
  //       'print_overdue_detail': true,
  //       'print_visit_detail': true,
  //       'print_inquiry_detail': true,
  //       'print_demo_detail': true,
  //       'print_student_detail': true,
  //       'print_employee_detail': true,
  //       'print_batches_detail': true,
  //       'print_exam_detail': true,
  //       'print_seminar_detail': true,
  //       'print_fees_detail': true,
  //       'print_expense_detail': true,
  //       'print_event_detail': true,
  //       'print_task_detail': true,
  //       'print_complaint_detail': true,
  //     },
  //   },
  // };

  const module = user?.role !== 'Admin' && navigationData?.map((data) => {
    if (!data) return null;
    return {
      subheader: data?.subheader,
      items: data?.items?.filter((item) => {
        return configs?.permissions?.[user?.role]?.sections?.includes(item?.title);
      }),
    };
  }).filter(Boolean);

  const moduleFilter = user?.role !== 'Admin' && module?.filter((data) => data?.items?.length > 0);
  return user?.role === 'Admin' ? navigationData : moduleFilter;
}
