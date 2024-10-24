import Stack from '@mui/material/Stack';
import { useTheme } from '@mui/material/styles';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Unstable_Grid2';
import { useSettingsContext } from 'src/components/settings';
import DashboardAttendenceChart from '../dashboard-attendence-chart';
import DashboardCount from '../dashboard-compony-count';
import DashboardDemoInquiryChart from '../dashboard-demo-inquiry-chart';
import DashboardUpcomingDemo from '../dashboard-upcoming-demo';
import DashboardCourseChart from '../dashboard-course-chart';
import { useEffect, useState } from 'react';
import { useAuthContext } from 'src/auth/hooks';
import {
  useGetAttendance,
  useGetCourses,
  useGetDashboardData,
  useGetDemos,
} from '../../../api/dashboard';
import { useGetConfigs } from 'src/api/config';
import { useGetVisitsOverview } from '../../../api/visit_overview';
import { useGetInquiryOverview } from '../../../api/inquiry_overview';
import { useGetInquiry } from '../../../api/inquiry';
import DashboardUpcomingInquiry from '../dashboard-upcoming-inquiry';
import { getResponsibilityValue } from '../../../permission/permission';
import { useGetStudents } from '../../../api/student';

export default function DashboardView() {
  const theme = useTheme();
  const { user } = useAuthContext();
  const [seriesData, setSeriesData] = useState('Month');
  const [demo, setDemo] = useState([]);
  const [inquiryList, setInquiryList] = useState([]);
  const [attendence, setAttendence] = useState({});
  const [course, setCourse] = useState({});
  const [dashboardData, setDashboardData] = useState([]);
  const [labs, setLabs] = useState(0);
  const { demos } = useGetDemos();
  const { dashboard } = useGetDashboardData();
  const { students } = useGetStudents();
  const { courses } = useGetCourses();
  const { attendance } = useGetAttendance();
  const { configs } = useGetConfigs();
  const { visit } = useGetVisitsOverview();
  const { inquiryOverview } = useGetInquiryOverview();
  const { inquiry } = useGetInquiry();

  useEffect(() => {
    if (demos) {
      setDemo(demos);
    }
    if (inquiry) {
      setInquiryList(inquiry);
    }
    if (dashboard) {
      setDashboardData(dashboard);
    }
    if (courses) {
      setCourse(courses);
    }
    if (attendance) {
      setAttendence(attendance);
    }
    if (attendance) {
      setAttendence(attendance);
    }
    if (configs && configs.classrooms) {
      setLabs(configs.classrooms.length);
    }
  }, [demos, dashboard, courses, attendance, configs]);

  const output = [];
  for (const [key, value] of Object.entries(course)) {
    output.push({ label: key, value: value });
  }
  const settings = useSettingsContext();
  const currentYear = new Date().getFullYear();

  const categories =
    seriesData === 'Year'
      ? Array.from({ length: currentYear - 2020 + 1 }, (_, i) => (2020 + i).toString())
      : seriesData === 'Month'
      ? ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
      : seriesData === 'Week'
        ? ['week-1', 'week-2', 'week-3', 'week-4', 'week-5']
        : [];

  return (
    <Container maxWidth={settings.themeStretch ? false : 'xl'}>
      <Grid container spacing={3}>
        <Grid xs={12} sm={6} md={3}>
          {getResponsibilityValue('view_attendance', configs, user) && <DashboardCount
            title='Present Students'
            color={'success'}
            total={attendence?.present == 0 ? 0 : attendence?.present || 0}
          />}
        </Grid><Grid xs={12} sm={6} md={3}>
        {getResponsibilityValue('view_attendance', configs, user) && <DashboardCount
          title='Absent Students'
          color={'error'}
          total={attendence?.absent == 0 ? 0 : attendence?.absent || 0}
        />}
      </Grid>
        <Grid xs={12} sm={6} md={3}>
          {getResponsibilityValue('view_attendance', configs, user) && <DashboardCount
            title='Late Students'
            color={'warning'}
            total={attendence?.late == 0 ? 0 : attendence?.late || 0}
          />}
        </Grid>
        <Grid xs={12} sm={6} md={3}>
          {getResponsibilityValue('view_developers', configs, user) && <DashboardCount
            title='Developers'
            total={dashboardData?.developers}
            color='info'
          />}
        </Grid>
        <Grid xs={12} sm={6} md={3}>
          {getResponsibilityValue('view_faculties', configs, user) && <DashboardCount
            title='Faculties'
            total={dashboardData?.faculties}
            color='secondary'
          />}
        </Grid>
        <Grid xs={12} sm={6} md={3}>
          {getResponsibilityValue('view_labs', configs, user) && <DashboardCount
            title='Labs'
            total={labs}
            color='info2'
          />}
        </Grid>
        {getResponsibilityValue('view_visit-inquiry', configs, user) && <Grid xs={12} md={8}>
          <Stack spacing={3}>
            <DashboardDemoInquiryChart
              title='Visits & Inquiry'
              setSeriesData={setSeriesData}
              seriesData={seriesData}
              chart={{
                categories,
                series: [
                  {
                    type: 'Week',
                    data: [
                      {
                        name: 'Inquiry',
                        data: inquiryOverview.weekWiseInquiries,
                      },
                      {
                        name: 'Visits',
                        data: visit.weekWiseVisits,
                      },
                    ],
                  },
                  {
                    type: 'Month',
                    data: [
                      {
                        name: 'Inquiry',
                        data: inquiryOverview.monthWiseInquiries,
                      },
                      {
                        name: 'Visits',
                        data: visit?.monthWiseVisits,
                      },
                    ],
                  },
                  {
                    type: 'Year',
                    data: [
                      {
                        name: 'Inquiry',
                        data: inquiryOverview.yearWiseInquiries,
                      },
                      {
                        name: 'Visits',
                        data: visit.yearWiseVisits,
                      },
                    ],
                  },
                ],
              }}
            />
          </Stack>
        </Grid>}
        {getResponsibilityValue('view_student', configs, user) && <Grid xs={12} md={4}>
          <Stack spacing={3}>
            <DashboardAttendenceChart
              title="Student's Status "
              total={parseInt(dashboardData?.students)}
              chart={{
                series: [
                  {
                    label: 'completed',
                    value: students.some(student => student.status === 'completed') ? students.filter(student => student.status === 'completed').length : 0,
                  }, {
                    label: 'Running',
                    value: students.some(student => student.status === 'running') ? students.filter(student => student.status === 'running').length : 0,
                  },
                  {
                    label: 'training',
                    value: students.some(student => student.status === 'training') ? students.filter(student => student.status === 'training').length : 0,
                  },
                  {
                    label: 'leaved',
                    value: students.some(student => student.status === 'leaved') ? students.filter(student => student.status === 'leaved').length : 0,
                  },
                ],
              }}
            />
          </Stack>
        </Grid>}
        {getResponsibilityValue('view_course', configs, user) && <Grid xs={12} md={8}>
          <Stack spacing={3}>
            <DashboardCourseChart
              title='Courses analytics'
              chart={{
                series: output,
                colors: [
                  theme.palette.primary.main,
                  theme.palette.warning.dark,
                  theme.palette.success.darker,
                  theme.palette.error.main,
                  theme.palette.info.dark,
                  theme.palette.info.darker,
                  theme.palette.success.main,
                  theme.palette.warning.main,
                  theme.palette.info.main,
                ],
              }}
            />
          </Stack>
        </Grid>}
        {getResponsibilityValue('view_demos', configs, user) && <Grid xs={12} md={4}>
          <Stack spacing={3}>
            <DashboardUpcomingDemo
              title='Upcoming Demos'
              subheader={`You have ${demo.length} demos`}
              list={demo.slice(-5)}
            />
          </Stack>
        </Grid>}
        {getResponsibilityValue('view_inquirys', configs, user) && <Grid xs={12} md={4}>
          <Stack spacing={3}>
            <DashboardUpcomingInquiry
              title='Upcoming Inquiry'
              subheader={`You have ${inquiryList.length} Inquiry`}
              list={inquiryList.slice(-5)}
            />
          </Stack>
        </Grid>}
      </Grid>
    </Container>
  );
}
