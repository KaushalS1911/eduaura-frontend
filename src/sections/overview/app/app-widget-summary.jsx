import PropTypes from 'prop-types';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Iconify from 'src/components/iconify';

// ----------------------------------------------------------------------

export default function AppWidgetSummary({ title, total, color = 'primary',sx, icon, ...other }) {
  return (
    <Card sx={{ display: 'flex', alignItems: 'center', p: 3, ...sx,  bgcolor: `${color}.dark`, }} {...other}>
      <Box sx={{ flexGrow: 1 }}>
        <Typography variant="h4">{title}</Typography>

        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          sx={{ mt: 2, mb: 1 }}
        >
          <Typography variant="h5">{total}</Typography>
        </Stack>
      </Box>
      <Box>
        <Iconify
          icon={icon}
          sx={{
            width: 112,
            right: 0,
            top:20,
            height: 112,
            opacity: 0.08,
            position: 'absolute',
          }}
        />
      </Box>
    </Card>
  );
}

AppWidgetSummary.propTypes = {
  sx: PropTypes.object,
  color: PropTypes.string,
  title: PropTypes.string,
  total: PropTypes.number,
  icon: PropTypes.number,
};
