import Stack from '@mui/material/Stack';
import { useTheme } from '@mui/material/styles';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Unstable_Grid2';

import { useSettingsContext } from 'src/components/settings';

import DashboardAttendenceChart from '../dashboard-attendence-chart';
import DashboardCount from '../dashboard-compony-count';
import { Typography } from '@mui/material';
import DashboardDemoInquiryChart from '../dashboard-demo-inquiry-chart';
import DashboardUpcomingDemo from '../dashboard-upcoming-demo';
import DashboardCourseChart from '../dashboard-course-chart';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { useAuthContext } from 'src/auth/hooks';
import {
  useGetAttendance,
  useGetCourses,
  useGetDashboardData,
  useGetDemos,
} from '../../../api/dashboard';
import { useGetConfigs } from 'src/api/config';

// ----------------------------------------------------------------------

export default function DashboardView() {
  const theme = useTheme();
  const { user } = useAuthContext();
  const [demo, setDemo] = useState([]);
  const [attendence, setAttendence] = useState({});
  const [course, setCourse] = useState({});
  const [dashboardData, setDashboardData] = useState([]);
  const [labs, setLabs] = useState(0); // Added state for labs

  const { demos } = useGetDemos();
  const { dashboard } = useGetDashboardData();
  const { courses } = useGetCourses();
  const { attendance } = useGetAttendance();
  const { configs } = useGetConfigs();

  useEffect(() => {
    if (demos) {
      setDemo(demos);
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
    if (configs && configs.classrooms) {
      // Extract labs from configs
      setLabs(configs.classrooms.length);
    }
  }, [demos, dashboard, courses, attendance, configs]);

  const output = [];

  for (const [key, value] of Object.entries(course)) {
    output.push({ label: key, value: value });
  }
  console.log(output);
  const settings = useSettingsContext();

  return (
    <Container maxWidth={settings.themeStretch ? false : 'xl'}>
      <Grid container spacing={3}>
        <Grid xs={12} sm={6} md={3}>
          <DashboardCount
            title="Students"
            total={dashboardData?.students}
            icon={<img alt="icon" src="/assets/icons/glass/ic_glass_bag.png" />}
          />
        </Grid>
        <Grid xs={12} sm={6} md={3}>
          <DashboardCount
            title="Developers"
            total={dashboardData?.developers}
            color="info"
            icon={<img alt="icon" src="/assets/icons/glass/ic_glass_users.png" />}
          />
        </Grid>

        <Grid xs={12} sm={6} md={3}>
          <DashboardCount
            title="Faculties"
            total={dashboardData?.faculties}
            color="warning"
            icon={<img alt="icon" src="/assets/icons/glass/ic_glass_buy.png" />}
          />
        </Grid>

        <Grid xs={12} sm={6} md={3}>
          <DashboardCount
            title="Labs"
            total={labs}
            color="error"
            icon={<img alt="icon" src="/assets/icons/glass/ic_glass_message.png" />}
          />
        </Grid>
        <Grid xs={12} md={8}>
          <Stack spacing={3}>
            <DashboardDemoInquiryChart
              title="Visits & Inquiry"
              // subheader="(+43% Income | +12% Expense) than last year"
              chart={{
                categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep'],
                series: [
                  {
                    type: 'Week',
                    data: [
                      {
                        name: 'Inquiry',
                        data: [10, 41, 35, 151, 49, 62, 69, 91, 48],
                      },
                      {
                        name: 'Visits',
                        data: [10, 34, 13, 56, 77, 88, 99, 77, 45],
                      },
                    ],
                  },
                  {
                    type: 'Month',
                    data: [
                      {
                        name: 'Inquiry',
                        data: [148, 91, 69, 62, 49, 51, 35, 41, 10],
                      },
                      {
                        name: 'Visits',
                        data: [45, 77, 99, 88, 77, 56, 13, 34, 10],
                      },
                    ],
                  },
                  {
                    type: 'Year',
                    data: [
                      {
                        name: 'Inquiry',
                        data: [76, 42, 29, 41, 27, 138, 117, 86, 63],
                      },
                      {
                        name: 'Visits',
                        data: [80, 55, 34, 114, 80, 130, 15, 28, 55],
                      },
                    ],
                  },
                ],
              }}
            />
          </Stack>
        </Grid>
        <Grid xs={12} md={4}>
          <Stack spacing={3}>
            <DashboardAttendenceChart
              title="Today's Attendance"
              total={parseInt(dashboardData?.students)}
              chart={{
                series: [
                  {
                    label: 'Present',
                    value: attendence?.present == 0 ? 0 : attendence?.present || 0,
                  },
                  { label: 'Late', value: attendence?.late == 0 ? 0 : attendence?.late || 0 },
                  { label: 'Absent', value: attendence?.absent == 0 ? 0 : attendence?.absent || 0 },
                ],
              }}
            />
          </Stack>
        </Grid>

        <Grid xs={12} md={4}>
          <Stack spacing={3}>
            <DashboardUpcomingDemo
              title="Upcoming Demos"
              subheader={`You have ${demo.length} demos`}
              list={demo.slice(-5)}
            />
          </Stack>
        </Grid>
        <Grid xs={12} md={8}>
          <Stack spacing={3}>
            <DashboardCourseChart
              title="Courses analytics"
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
        </Grid>
      </Grid>
    </Container>
  );
}
