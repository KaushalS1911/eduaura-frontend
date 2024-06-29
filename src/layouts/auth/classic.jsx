import PropTypes from 'prop-types';

import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import { alpha, useTheme } from '@mui/material/styles';

import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';

import { useResponsive } from 'src/hooks/use-responsive';

import { bgGradient } from 'src/theme/css';
import { useAuthContext } from 'src/auth/hooks';

import Logo from 'src/components/logo';
import { Grid } from '@mui/material';

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

export default function AuthClassicLayout({ children, image, title ,register}) {
  const { method } = useAuthContext();

  const theme = useTheme();

  const mdUp = useResponsive('up', 'md');

  // const renderLogo = (
  //   <Logo
  //     sx={{
  //       zIndex: 9,
  //       position: 'absolute',
  //       m: { xs: 2, md: 5 },
  //     }}
  //   />
  // );

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
        }}
      >
        <Grid
          container
          sx={{
            borderRadius: '20px',
            overflow: 'hidden',
            boxShadow: '1px 1px 15px #0005',
            maxWidth: {md:"85rem !important",xs:"unset"},
            width:{xs:"430px",md:"100%"},
            mx:"20px",
            justifyContent:{xs:"center",md:"unset"}
          }}
        >
          <Grid item xs={12} md={5} lg={4} sx={{ backgroundColor: 'white' }}>
            <Stack
              sx={{
                // width: 1,
                // mx: 'auto',
                // maxWidth: 480,
                px: { xs: 6, md: 8 },
                pt: register ? { xs: 2, md: 2 } : { xs: 8, md: 8 } ,
                pb: register ? { xs: 6, md: 6 }:{ xs: 8, md: 10 },
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
              background: "linear-gradient(rgba(0, 0, 0, 0.35), rgba(0, 0, 0, 0.35)),url('https://media.istockphoto.com/id/1756562035/photo/university-campus.webp?b=1&s=170667a&w=0&k=20&c=y1T0bSXoIjeaDaazxJfr6WmtBRv_GDHg4Vw1Pn3E4q4=')",
              // background:
              //   linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)),
              // url('https://media.istockphoto.com/id/1756562035/photo/university-campus.webp?b=1&s=170667a&w=0&k=20&c=y1T0bSXoIjeaDaazxJfr6WmtBRv_GDHg4Vw1Pn3E4q4=')
              backgroundRepeat:"no-repeat",
              backgroundSize:"cover",
              color: 'white',
              justifyContent: 'center',
              alignItems: 'center',
              display:{md:"flex",xs:"none"}
            }}
          >
            <Box sx={{ width: '355px' }}>
              <Typography sx={{ fontSize: '45px', fontWeight: '700', lineHeight: '1.2',paddingRight:"44px" }}>
                Hello and Wel-come to Eduaura
              </Typography>
              <Typography sx={{mt:"30px"}}>
                One Place for your all monthly activities and requirements. sign up and get in to know more...
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </Box>
      {/* // <Stack
    //   sx={{
    //     width: 1,
    //     mx: 'auto',
    //     maxWidth: 480,
    //     px: { xs: 2, md: 8 },
    //     pt: { xs: 15, md: 20 },
    //     pb: { xs: 15, md: 0 },
    //   }}
    // >
    //   {children}
    // </Stack> */}
    </>
  );

  // const renderSection = (
  //   <Stack
  //     flexGrow={1}
  //     spacing={10}
  //     alignItems="center"
  //     justifyContent="center"
  //     sx={{
  //       ...bgGradient({
  //         color: alpha(
  //           theme.palette.background.default,
  //           theme.palette.mode === 'light' ? 0.6 : 0.6
  //         ),
  //         imgUrl: 'https://i.postimg.cc/02nW72yj/TPPS0009-min.jpg',
  //       }),
  //     }}
  //   >
  //     {/* <Typography variant="h3" sx={{ maxWidth: 480, textAlign: 'center' }}>
  //       {title || 'Hi, Welcome back'}
  //     </Typography> */}

  //     {/* <Box
  //       component="img"
  //       alt="auth"
  //       src={image || '/assets/illustrations/illustration_dashboard.png'}
  //       sx={{
  //         maxWidth: {
  //           xs: 480,
  //           lg: 560,
  //           xl: 720,
  //         },
  //       }}
  //     /> */}

  //     {/* <Stack direction="row" spacing={2}>
  //       {METHODS.map((option) => (
  //         <Tooltip key={option.label} title={option.label}>
  //           <Link component={RouterLink} href={option.path}>
  //             <Box
  //               component="img"
  //               alt={option.label}
  //               src={option.icon}
  //               sx={{
  //                 width: 32,
  //                 height: 32,
  //                 ...(method !== option.id && {
  //                   filter: 'grayscale(100%)',
  //                 }),
  //               }}
  //             />
  //           </Link>
  //         </Tooltip>
  //       ))}
  //     </Stack> */}
  //   </Stack>
  // );

  return (
    <Stack
      component="main"
      direction="row"

    >
      {/* {renderLogo} */}

      {/* {mdUp && renderSection} */}

      {renderContent}
    </Stack>
  );
}

AuthClassicLayout.propTypes = {
  children: PropTypes.node,
  image: PropTypes.string,
  title: PropTypes.string,
};
