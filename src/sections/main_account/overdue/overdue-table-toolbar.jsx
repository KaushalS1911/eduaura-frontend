import PropTypes from 'prop-types';
import { useCallback, useEffect, useState } from 'react';

import Stack from '@mui/material/Stack';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Checkbox from '@mui/material/Checkbox';
import TextField from '@mui/material/TextField';
import InputLabel from '@mui/material/InputLabel';
import IconButton from '@mui/material/IconButton';
import FormControl from '@mui/material/FormControl';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputAdornment from '@mui/material/InputAdornment';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { formHelperTextClasses } from '@mui/material/FormHelperText';

import Iconify from 'src/components/iconify';
import CustomPopover, { usePopover } from 'src/components/custom-popover';
import { MobileDatePicker } from '@mui/x-date-pickers';

export default function OverdueTableToolbar({ filters, onFilters }) {
  const [day, setDay] = useState('');
  const days = ['Today', 'Last 7 Day', 'Last Week', 'Last 15 Day', 'Last Month', 'Last Year'];

  const dayManage = (day) => {
    const currentDate = new Date();
    const sevenDaysAgo = new Date(new Date().setDate(new Date().getDate() - 6));
    const fifteenDaysAgo = new Date(new Date().setDate(new Date().getDate() - 14));
    const monthDaysAgo = new Date(new Date().setDate(new Date().getDate() - 30));
    const yearsDaysAgo = new Date(new Date(new Date().setDate(new Date().getDate() - 360)));

    if (day === 'Today') {
      onFilters('startDay', currentDate);
      onFilters('endDay', currentDate);
    }
    if (day === 'Last 7 Day') {
      onFilters('startDay', sevenDaysAgo);
      onFilters('endDay', currentDate);

    }
    if (day === 'Last Week') {
      onFilters('startDay', sevenDaysAgo);
      onFilters('endDay', currentDate);
    }
    if (day === 'Last 15 Day') {
      onFilters('startDay', fifteenDaysAgo);
      onFilters('endDay', currentDate);
    }
    if (day === 'Last Month') {
      onFilters('startDay', monthDaysAgo);
      onFilters('endDay', currentDate);
    }
    if (day === 'Last Year') {
      onFilters('startDay', yearsDaysAgo);
      onFilters('endDay', currentDate);
    }
  };
  useEffect(() => {
    if (day !== '') {
      dayManage(day);
    }

  },[day])
  const handleFilterDays = useCallback(
    (event) => {
      setDay(event.target.value);
    },
    [onFilters],
  );
  return (
    <>
      <Stack
        alignItems={{ xs: 'flex-end', md: 'center' }}
        direction={{
          xs: 'column',
          md: 'row',
        }}
      >
        <FormControl
          sx={{
            flexShrink: 0,
            width: { xs: 1, md: 200 },
          }}
        >
          <InputLabel>Filter By Day</InputLabel>

          <Select
            value={day}
            onChange={handleFilterDays}
            input={<OutlinedInput label="Filter by Day"/>}
            MenuProps={{
              PaperProps: {
                sx: { maxHeight: 240 },
              },
            }}
            // renderValue={(selected) => selected.join(', ')}
          >
            {days.map((option) => (
              <MenuItem key={option} value={option}>
                {option}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Stack>

      {/*<CustomPopover*/}
      {/*  open={popover.open}*/}
      {/*  onClose={popover.onClose}*/}
      {/*  arrow="right-top"*/}
      {/*  sx={{ width: 140 }}*/}
      {/*>*/}
      {/*  <MenuItem*/}
      {/*    onClick={() => {*/}
      {/*      popover.onClose();*/}
      {/*    }}*/}
      {/*  >*/}
      {/*    <Iconify icon="solar:printer-minimalistic-bold" />*/}
      {/*    Print*/}
      {/*  </MenuItem>*/}

      {/*  <MenuItem*/}
      {/*    onClick={() => {*/}
      {/*      popover.onClose();*/}
      {/*    }}*/}
      {/*  >*/}
      {/*    <Iconify icon="solar:import-bold" />*/}
      {/*    Import*/}
      {/*  </MenuItem>*/}

      {/*  <MenuItem*/}
      {/*    onClick={() => {*/}
      {/*      popover.onClose();*/}
      {/*    }}*/}
      {/*  >*/}
      {/*    <Iconify icon="solar:export-bold" />*/}
      {/*    Export*/}
      {/*  </MenuItem>*/}
      {/*</CustomPopover>*/}
    </>
  );
}

OverdueTableToolbar.propTypes = {
  dateError: PropTypes.bool,
  filters: PropTypes.object,
  onFilters: PropTypes.func,
  serviceOptions: PropTypes.array,
};
