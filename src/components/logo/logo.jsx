import PropTypes from 'prop-types';
import { forwardRef, useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import { useGetConfigs } from 'src/api/config';
import defaultLogo from 'src/assets/logo/jbs.png';
// ----------------------------------------------------------------------
const Logo = forwardRef(({ disabledLink = false, navWidth, sx, ...other }, ref) => {
  const { configs } = useGetConfigs();
  const [company, setCompany] = useState({});
  useEffect(() => {
    setCompany(configs);
  }, [configs]);
  const logo1 = company?.company_details?.logo ? `${company?.company_details?.logo}` : defaultLogo;
  const logo = (
    <Box
      ref={ref}
      component="div"
      sx={{
        display: 'inline-flex',
        justifyContent: 'center',
        alignItems: 'center',
        ...sx,
        margin: '30px 0 30px 0',
      }}
      {...other}
    >
      <img
        src={logo1}
        alt={logo1}
        style={{
          borderRadius: '50%',
          width: navWidth ? '75px' : '124px',
          height: navWidth ? '75px' : '124px',
        }}
      />
    </Box>
  );
  if (disabledLink) {
    return logo;
  }
  return <Link sx={{ display: 'contents' }}>{logo}</Link>;
});
Logo.propTypes = {
  disabledLink: PropTypes.bool,
  sx: PropTypes.object,
};
export default Logo;
