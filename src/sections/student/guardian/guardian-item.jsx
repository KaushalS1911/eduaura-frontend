import PropTypes from 'prop-types';

import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import Label from 'src/components/label';

// ----------------------------------------------------------------------

export default function GuardianItem({ guardian, action, sx, ...other }) {
  const { firstName, lastName, contact, relation_type } = guardian;
  
  let currentUrl = window.location.href;

  return (
    <>
      {currentUrl === 'http://localhost:3030/dashboard/student/account' ? (
        <Stack
          component={Paper}
          spacing={2}
          alignItems={{ md: 'flex-end' }}
          direction={{ xs: 'column', md: 'row' }}
          sx={{
            position: 'relative',
            ...sx,
          }}
          {...other}
        >
          <Stack flexGrow={1} spacing={1}>
            <Stack direction="row" alignItems="center">
              <Typography variant="subtitle2">
                {firstName} {lastName}
                <Box
                  component="span"
                  sx={{ ml: 0.5, typography: 'body2', color: 'text.secondary' }}
                >
                  {relation_type}
                </Box>
              </Typography>
            </Stack>

            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              {contact}
            </Typography>
          </Stack>
        </Stack>
      ) : (
        <Stack
          component={Paper}
          spacing={2}
          alignItems={{ md: 'flex-end' }}
          direction={{ xs: 'column', md: 'row' }}
          sx={{
            position: 'relative',
            ...sx,
          }}
          {...other}
        >
          <Stack flexGrow={1} spacing={1}>
            <Stack direction="row" alignItems="center">
              <Typography variant="subtitle2">
                {firstName} {lastName}
                <Box
                  component="span"
                  sx={{ ml: 0.5, typography: 'body2', color: 'text.secondary' }}
                >
                  {relation_type}
                </Box>
              </Typography>
            </Stack>

            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              {contact}
            </Typography>
          </Stack>
          {action && action}
        </Stack>
      )}
    </>
  );
}

GuardianItem.propTypes = {
  action: PropTypes.node,
  address: PropTypes.object,
  sx: PropTypes.object,
};
