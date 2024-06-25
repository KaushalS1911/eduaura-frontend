import PropTypes from 'prop-types';
import { useState, useCallback } from 'react';

import Stack from '@mui/material/Stack';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Unstable_Grid2';

import { paths } from 'src/routes/paths';

import { _orders, ORDER_STATUS_OPTIONS } from 'src/_mock';

import { useSettingsContext } from 'src/components/settings';

import StudentProgressDetailsToolbar from './student-progress-details-toolbar';

import StudentProgressDetailsHistory from '../student-progrss-details-history';

// ----------------------------------------------------------------------

export default function StudentDetailsView({ currentStudent }) {
  const settings = useSettingsContext();

  const currentOrder = _orders.filter((order) => order.id === currentStudent._id)[0];

  const [status, setStatus] = useState();

  const handleChangeStatus = useCallback((newValue) => {
    setStatus(newValue);
  }, []);

  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      {/* <StudentProgressDetailsToolbar
        backLink={paths.dashboard.order.root}
        orderNumber={currentOrder.orderNumber}
        createdAt={currentOrder.createdAt}
        status={status}
        onChangeStatus={handleChangeStatus}
        statusOptions={ORDER_STATUS_OPTIONS}
      /> */}
      <Grid container spacing={3}>
        <Grid xs={12} md={12}>
          <Stack spacing={3} direction={{ xs: 'column-reverse', md: 'column' }}>
            <StudentProgressDetailsHistory  />
          </Stack>
        </Grid>
      </Grid>
    </Container>
  );
}

StudentDetailsView.propTypes = {
  id: PropTypes.string.isRequired,
};
