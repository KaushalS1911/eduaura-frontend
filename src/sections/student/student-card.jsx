import PropTypes from 'prop-types';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Avatar from '@mui/material/Avatar';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
import ListItemText from '@mui/material/ListItemText';
import { alpha, useTheme } from '@mui/material/styles';
import { AvatarShape } from 'src/assets/illustrations';

import Image from 'src/components/image';
import Grid from '@mui/material/Grid';

// ----------------------------------------------------------------------

export default function StudentCard({ user }) {
  const theme = useTheme();

  return (
    <Card sx={{ textAlign: 'center' }}>
      <Box sx={{ position: 'relative' }}>
        <AvatarShape
          sx={{
            left: 0,
            right: 0,
            zIndex: 10,
            mx: 'auto',
            bottom: -26,
            position: 'absolute',
          }}
        />

        <Avatar
          alt="image"
          src={user.profile_pic}
          sx={{
            width: 64,
            height: 64,
            zIndex: 11,
            left: 0,
            right: 0,
            bottom: -32,
            mx: 'auto',
            position: 'absolute',
          }}
        />

        <Image
          src="https://api-dev-minimal-v510.vercel.app/assets/images/cover/cover_1.jpg"
          alt="cover_image"
          ratio="16/9"
          overlay={alpha(theme.palette.grey[900], 0.48)}
        />
      </Box>

      <ListItemText
        sx={{ mt: 7, mb: 1 }}
        primary={`${user.firstName} ${user.lastName}`}
        secondary={user.course}
        primaryTypographyProps={{ typography: 'subtitle1' }}
        secondaryTypographyProps={{ component: 'span', mt: 0.5 }}
      />

      <Divider sx={{ borderStyle: 'dashed' }} />

      <Box sx={{ p: 3, typography: 'subtitle1' }}>
        <Box
          columnGap={2}
          rowGap={2}
          display="grid"
          gridTemplateColumns={{
            xs: 'repeat(1, 1fr)',
            lg: 'repeat(2, 2fr)',
          }}
        >
          <Grid>
            <Typography variant="h5" component="div" sx={{ mb: 0.5, color: 'text.secondary' }}>
              Email
            </Typography>
            <Typography variant="caption" component="div">
              {user.email}
            </Typography>
          </Grid>

          <Grid>
            <Typography variant="h5" component="div" sx={{ mb: 0.5, color: 'text.secondary' }}>
              Contact
            </Typography>
            <Typography variant="caption" component="div">
              {user.contact}
            </Typography>
          </Grid>
        </Box>
      </Box>
    </Card>
  );
}

StudentCard.propTypes = {
  user: PropTypes.object.isRequired,
};
