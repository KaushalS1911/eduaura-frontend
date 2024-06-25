import PropTypes from 'prop-types';

import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import CardHeader from '@mui/material/CardHeader';
import Typography from '@mui/material/Typography';
import LinearProgress from '@mui/material/LinearProgress';

import { fPercent, fCurrency } from 'src/utils/format-number';

// ----------------------------------------------------------------------

export default function AccountSalesOverview({ title, subheader, data, ...other }) {
  return (
    <Card {...other}>
      <CardHeader title={title} subheader={subheader} />

      <Stack spacing={4} sx={{ px: 3, pt: 3, pb: 5 }}>
        {data.map(
          (progress) => (
            (<ProgressItem key={progress.label} progress={progress} />)
          )
        )}
      </Stack>
    </Card>
  );
}

AccountSalesOverview.propTypes = {
  data: PropTypes.array,
  subheader: PropTypes.string,
  title: PropTypes.string,
};

// ----------------------------------------------------------------------

function ProgressItem({ progress }) {
  const isIncome = progress.label === 'Total Income';
  const totalAmount = isIncome ? progress.totalAmount1 : progress.totalAmount;
  const value = isIncome ? progress.value1 : progress.value;

  return (
    <>
      <Stack spacing={1}>
        <Stack direction="row" alignItems="center">
          <Typography variant="subtitle2" sx={{ flexGrow: 1 }}>
            {progress.label}
          </Typography>

          <Typography variant="subtitle2">{fCurrency(totalAmount)}</Typography>

          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            &nbsp;({fPercent(value)})
          </Typography>
        </Stack>

        <LinearProgress
          variant="determinate"
          value={value}
          color={
            (progress.label === 'Total Income' && 'success') ||
            (progress.label === 'Total Expenses' && 'error') ||
            'primary'
          }
        />
      </Stack>
    </>
  );
}

ProgressItem.propTypes = {
  progress: PropTypes.shape({
    label: PropTypes.string.isRequired,
    totalAmount: PropTypes.number,
    totalAmount1: PropTypes.number,
    value: PropTypes.number,
    value1: PropTypes.number,
  }).isRequired,
};
