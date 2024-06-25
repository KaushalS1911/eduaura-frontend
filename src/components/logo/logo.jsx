import PropTypes from 'prop-types';
import { forwardRef, useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import { useGetConfigs } from 'src/api/config';
// ----------------------------------------------------------------------
const Logo = forwardRef(({ disabledLink = false,navWidth, sx, ...other }, ref) => {
  const { configs } = useGetConfigs();
  const [company, setCompany] = useState({});
  useEffect(() => {
    setCompany(configs);
  }, [configs]);
  const logo1 = company?.company_details?.logo
    ? `${company?.company_details?.logo}`
    : '../../../public/logo/jbs.png';
  const logo = (
    <Box
      ref={ref}
      component="div"
      sx={{
        display: 'inline-flex',
        ...sx,
      }}
      {...other}
    >
      <img
        src={logo1}
        alt={logo1}
        style={{
          borderRadius: '50%',
          width: navWidth ? '75px' : '96px',
          height: navWidth ? '75px' : '96px',
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
