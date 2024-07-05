import PropTypes from 'prop-types';

import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';

import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';

import { useResponsive } from 'src/hooks/use-responsive';

import { bgGradient } from 'src/theme/css';
import { useAuthContext } from 'src/auth/hooks';

import Logo from 'src/components/logo';
import { Grid } from '@mui/material';
import loginImage from 'src/assets/login-back/login.jpg'
import { position } from 'stylis';
import { useRouter } from '../../routes/hooks';
import { PATH_AFTER_LOGIN } from '../../config-global';
import Iconify from '../../components/iconify';
// ----------------------------------------------------------------------

const METHODS = [
  {
    id: 'jwt',
    label: 'Jwt',
    path: paths.auth.jwt.login,
    icon: '/assets/icons/auth/ic_jwt.svg',
  },
  {
    id: 'firebase',
    label: 'Firebase',
    path: paths.auth.firebase.login,
    icon: '/assets/icons/auth/ic_firebase.svg',
  },
  {
    id: 'amplify',
    label: 'Amplify',
    path: paths.auth.amplify.login,
    icon: '/assets/icons/auth/ic_amplify.svg',
  },
  {
    id: 'auth0',
    label: 'Auth0',
    path: paths.auth.auth0.login,
    icon: '/assets/icons/auth/ic_auth0.svg',
  },
  {
    id: 'supabase',
    label: 'Supabase',
    path: paths.auth.supabase.login,
    icon: '/assets/icons/auth/ic_supabase.svg',
  },
];

export default function AuthClassicLayout({ children, register ,invite}) {
const router = useRouter()
  const renderContent = (
    <>
      <Box
        sx={{
          width: '100%',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '100vh',
          backgroundColor: '#F6F7F9',
          position: invite ? 'relative' : 'unset',
        }}
      >
        {invite && <Box sx={{ position: 'absolute',top:'3%',left:"5%",cursor:"pointer" ,display:"flex",justifyContent:"center",alignItems:"center"}} onClick={() =>
          router.push(PATH_AFTER_LOGIN)}>
          <Iconify icon="material-symbols-light:keyboard-backspace"  sx={{height:"25px" ,width:"25px",marginRight:"3px"}} /> Back</Box>}
        <Grid
          container
          sx={{
            borderRadius: '20px',
            overflow: 'hidden',
            boxShadow: '1px 1px 20px #e1e1e1',
            maxWidth: { md: '85rem !important', xs: 'unset' },
            width: { xs: '430px', md: '100%' },
            mx: '20px',
            justifyContent: { xs: 'center', md: 'unset' },
          }}
        >
          <Grid item xs={12} md={5} lg={4} sx={{ backgroundColor: 'white' }}>
            <Stack
              sx={{
                px: { xs: 6, md: 8 },
                pt: register ? { xs: 2, md: 2 } : { xs: 8, md: 8 },
                pb: register ? { xs: 6, md: 6 } : { xs: 8, md: 10 },
              }}
            >
              {children}
            </Stack>
          </Grid>
          <Grid
            item
            md={7}
            lg={8}
            sx={{
              background: `linear-gradient(rgba(0, 0, 0, 0.35), rgba(0, 0, 0, 0.35)),url(${loginImage})`,
              backgroundRepeat: 'no-repeat',
              backgroundSize: 'cover',
              color: '#ffffffd1',
              justifyContent: 'center',
              alignItems: 'center',
              display: { md: 'flex', xs: 'none' },
            }}
          >
            <Box sx={{ width: '355px' }}>
              <Typography sx={{ fontSize: '45px', fontWeight: '700', lineHeight: '1.2', paddingRight: '44px' }}>
                Hello and Wel-come to Eduaura
              </Typography>
              <Typography sx={{ mt: '30px' }}>
                One Place for your all monthly activities and requirements. sign up and get in to know more...
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </Box>

    </>
  );



  return (
    <Stack
      component='main'
      direction='row'

    >

      {renderContent}
    </Stack>
  );
}

AuthClassicLayout.propTypes = {
  children: PropTypes.node,
  image: PropTypes.string,
  title: PropTypes.string,
};
