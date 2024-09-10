import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';

import Stack from '@mui/material/Stack';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import { useTheme } from '@mui/material/styles';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';

import { useOffSetTop } from 'src/hooks/use-off-set-top';
import { useResponsive } from 'src/hooks/use-responsive';

import { bgBlur } from 'src/theme/css';

import Logo from 'src/components/logo';
import SvgColor from 'src/components/svg-color';
import { useSettingsContext } from 'src/components/settings';

import Searchbar from '../common/searchbar';
import { NAV, HEADER } from '../config-layout';
import SettingsButton from '../common/settings-button';
import AccountPopover from '../common/account-popover';
import { useGetConfigs } from '../../api/config';

// ----------------------------------------------------------------------

export default function Header({ onOpenNav }) {
  const theme = useTheme();

  const settings = useSettingsContext();

  const isNavHorizontal = settings.themeLayout === 'horizontal';

  const isNavMini = settings.themeLayout === 'mini';

  const lgUp = useResponsive('up', 'lg');

  const offset = useOffSetTop(HEADER.H_DESKTOP);

  const offsetTop = offset && !isNavHorizontal;

  const [remainingTime, setRemainingTime] = useState(null);

  const { configs } = useGetConfigs();

  useEffect(() => {
    if (configs && configs?.company_details?.createdAt) {
      const companyCreatedDate = new Date(configs?.company_details.createdAt);
      const totalDays = 30;
      const endDate = new Date(companyCreatedDate);
      endDate.setDate(endDate.getDate() + totalDays);

      const updateRemainingTime = () => {
        const now = new Date();
        const diffTime = endDate - now;
        if (diffTime > 0) {
          const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
          const diffHours = Math.floor((diffTime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
          const diffMinutes = Math.floor((diffTime % (1000 * 60 * 60)) / (1000 * 60));
          const diffSeconds = Math.floor((diffTime % (1000 * 60)) / 1000);

          setRemainingTime({ days: diffDays, hours: diffHours, minutes: diffMinutes, seconds: diffSeconds });
        } else {
          setRemainingTime({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        }
      };

      updateRemainingTime();
      const timerId = setInterval(updateRemainingTime, 1000);
      return () => clearInterval(timerId);
    }
  }, [configs]);

  const formatTime = (time) => {
    if (!time) return 'Calculating...';
    const { days, hours, minutes, seconds } = time;
    return `${days}d ${hours}h ${minutes}m ${seconds}s`;
  };

  const renderContent = (
    <>
      {lgUp && isNavHorizontal && <Logo sx={{ mr: 2.5 }} />}
      {!lgUp && (
        <IconButton onClick={onOpenNav}>
          <SvgColor src='/assets/icons/navbar/ic_menu_item.svg' />
        </IconButton>
      )}

      <Searchbar />

      <Stack
        flexGrow={1}
        direction='row'
        alignItems='center'
        justifyContent='flex-end'
        spacing={{ xs: 0.5, sm: 1 }}
      >
        {configs?.company_details?.createdAt && (
          <Typography
            variant='subtitle2'
            color='default'
            bgcolor='#EDEFF1'
            sx={{ borderRadius: '10px', padding: '5px' }}
          >
            {remainingTime?.days > 0 || remainingTime?.hours > 0 || remainingTime?.minutes > 0 || remainingTime?.seconds > 0
              ? `Your free trial expires in (${formatTime(remainingTime)})`
              : ''}
          </Typography>
        )}

        <SettingsButton />

        <AccountPopover />
      </Stack>
    </>
  );

  return (
    <AppBar
      sx={{
        height: HEADER.H_MOBILE,
        zIndex: theme.zIndex.appBar + 1,
        ...bgBlur({
          color: theme.palette.background.default,
        }),
        transition: theme.transitions.create(['height'], {
          duration: theme.transitions.duration.shorter,
        }),
        ...(lgUp && {
          width: `calc(100% - ${NAV.W_VERTICAL + 1}px)`,
          height: HEADER.H_DESKTOP,
          ...(offsetTop && {
            height: HEADER.H_DESKTOP_OFFSET,
          }),
          ...(isNavHorizontal && {
            width: 1,
            bgcolor: 'background.default',
            height: HEADER.H_DESKTOP_OFFSET,
            borderBottom: `dashed 1px ${theme.palette.divider}`,
          }),
          ...(isNavMini && {
            width: `calc(100% - ${NAV.W_MINI + 1}px)`,
          }),
        }),
      }}
    >
      <Toolbar
        sx={{
          height: 1,
          px: { lg: 5 },
        }}
      >
        {renderContent}
      </Toolbar>
    </AppBar>
  );
}

Header.propTypes = {
  onOpenNav: PropTypes.func,
};
