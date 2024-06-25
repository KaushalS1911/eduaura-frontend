import { useEffect } from 'react';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import { useTheme } from '@mui/material/styles';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Unstable_Grid2';

import { useMockedUser } from 'src/hooks/use-mocked-user';

import { SeoIllustration } from 'src/assets/illustrations';
import { _appAuthors, _appRelated, _appFeatured, _appInvoices, _appInstalled } from 'src/_mock';

import { useSettingsContext } from 'src/components/settings';

import { useGetInquiry } from 'src/api/inquiry';
import { Link } from 'react-router-dom';
import { useGetEmployees } from 'src/api/employee';
import { useGetStudents } from 'src/api/student';
import AppWidget from '../app-widget';
import AppWelcome from '../app-welcome';
import AppFeatured from '../app-featured';
import AppNewInvoice from '../app-new-invoice';
import AppTopAuthors from '../app-top-authors';
import AppTopRelated from '../app-top-related';
import AppAreaInstalled from '../app-area-installed';
import AppWidgetSummary from '../app-widget-summary';
import AppCurrentDownload from '../app-current-download';
import AppTopInstalledCountries from '../app-top-installed-countries';

// ----------------------------------------------------------------------

export default function OverviewAppView() {
  const { user } = useMockedUser();
  const { inquiry } = useGetInquiry();
  const { employees } = useGetEmployees();
  const { students } = useGetStudents();
  const TotalCards = {
    TotalInquiries: inquiry.length,
    TotalEmployees: employees.length,
    TotalStudents: students.length,
  };  



  const settings = useSettingsContext();

  return (
    <Container maxWidth={settings.themeStretch ? false : 'xl'}>
      <Grid container spacing={3}>
        <Grid xs={12} md={8}>
          <AppWelcome
            title={`Welcome back 👋 \n Jbs It Institute`}
            description="Think It and Think JBS"
            img={<SeoIllustration />}
            action={
              <Button variant="contained" color="primary">
                <Link
                  to="https://www.jbsitinstitute.com"
                  target="_blank"
                  style={{
                    textDecoration: 'none',
                    color: 'white',
                  }}
                >
                  Go Now
                </Link>
              </Button>
            }
          />
        </Grid>

        <Grid xs={12} md={4}>
          <AppFeatured list={_appFeatured} />
        </Grid>

        <Grid xs={12} md={4}>
          <AppWidgetSummary
            title="Total Inquiry"
            total={TotalCards.TotalInquiries}
            icon="solar:user-rounded-bold"
          />
        </Grid>

        <Grid xs={12} md={4}>
          <AppWidgetSummary
            title="Total Employees"
            total={TotalCards.TotalEmployees}
            icon="solar:user-rounded-bold"
            color="info"
          />
        </Grid>

        <Grid xs={12} md={4}>
          <AppWidgetSummary
            title="Total Students"
            total={TotalCards.TotalStudents}
            icon="solar:user-rounded-bold"
            color="warning"
          />
        </Grid>

        <Grid xs={12} md={6} lg={4}>
          <AppCurrentDownload
            title="Current Download"
            chart={{
              series: [
                { label: 'Mac', value: 12244 },
                { label: 'Window', value: 53345 },
                { label: 'iOS', value: 44313 },
                { label: 'Android', value: 78343 },
              ],
            }}
          />
        </Grid>

        <Grid xs={12} md={6} lg={8}>
          <AppAreaInstalled
            title="Total Visited Student"
            inquiry={inquiry}
          />
        </Grid>

        <Grid xs={12} lg={8}>
          <AppNewInvoice
            title="Upcomming Demos"
            tableData={_appInvoices}
            tableLabels={[
              { id: 'id', label: 'Invoice ID' },
              { id: 'category', label: 'Category' },
              { id: 'price', label: 'Price' },
              { id: 'status', label: 'Status' },
              { id: '' },
            ]}
          />
        </Grid>

        <Grid xs={12} md={6} lg={4}>
          <AppTopRelated title="Top Related Applications" list={_appRelated} />
        </Grid>

        <Grid xs={12} md={6} lg={4}>
          <AppTopInstalledCountries title="Top Installed Countries" list={_appInstalled} />
        </Grid>

        <Grid xs={12} md={6} lg={4}>
          <AppTopAuthors title="Top Authors" list={_appAuthors} />
        </Grid>

        <Grid xs={12} md={6} lg={4}>
          <Stack spacing={3}>
            <AppWidget
              title="Conversion"
              total={38566}
              icon="solar:user-rounded-bold"
              chart={{
                series: 48,
              }}
            />

            <AppWidget
              title="Applications"
              total={55566}
              icon="fluent:mail-24-filled"
              color="info"
              chart={{
                series: 75,
              }}
            />
          </Stack>
        </Grid>
      </Grid>
    </Container>
  );
}
