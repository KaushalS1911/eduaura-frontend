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

export default function AttendanceTableToolbar({ filters, onFilters, dateError, serviceOptions }) {
  const popover = usePopover();
  const [day, setDay] = useState('Today');
  const days = ['Today', 'Last 7 Day', 'Last Week', 'Last 15 Day', 'Last Month', 'Last Year'];
  const handleFilterName = useCallback(
    (event) => {
      onFilters('name', event.target.value);
    },
    [onFilters]
  );

  // const handleFilterService = useCallback(
  //   (event) => {
  //     onFilters(
  //       'service',
  //       typeof event.target.value === 'string' ? event.target.value.split(',') : event.target.value
  //     );
  //   },
  //   [onFilters]
  // );
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
  const handleFilterStartDate = useCallback(
    (newValue) => {
      onFilters('startDate', newValue);
    },
    [onFilters]
  );

  const handleFilterEndDate = useCallback(
    (newValue) => {
      onFilters('endDate', newValue);
    },
    [onFilters]
  );
  const handleFilterDays = useCallback(
    (event) => {
      setDay(event.target.value);
    },
    [onFilters],
  );
  return (
    <>
      <Stack
        spacing={2}
        alignItems={{ xs: 'flex-end', md: 'center' }}
        direction={{
          xs: 'column',
          md: 'row',
        }}
        sx={{
          p: 2.5,
        }}
      >
        {/* <FormControl */}
        {/*   sx={{ */}
        {/*     flexShrink: 0, */}
        {/*     width: { xs: 1, md: 180 }, */}
        {/*   }} */}
        {/* > */}
        {/*   <InputLabel>Service</InputLabel> */}
        {/*   <Select */}
        {/*     multiple */}
        {/*     value={filters.service} */}
        {/*     onChange={handleFilterService} */}
        {/*     input={<OutlinedInput label="Service" />} */}
        {/*     renderValue={(selected) => selected.map((value) => value).join(', ')} */}
        {/*     sx={{ textTransform: 'capitalize' }} */}
        {/*   > */}
        {/*     {serviceOptions.map((option) => ( */}
        {/*       <MenuItem key={option} value={option}> */}
        {/*         <Checkbox disableRipple size="small" checked={filters.service.includes(option)} /> */}
        {/*         {option} */}
        {/*       </MenuItem> */}
        {/*     ))} */}
        {/*   </Select> */}
        {/* </FormControl> */}

        <Stack
          direction="row"
          alignItems="center"
          spacing={2}
          flexGrow={1}
          sx={{ width: 1, pr: 1.5 }}
        >
          <TextField
            fullWidth
            value={filters.name}
            onChange={handleFilterName}
            placeholder="Search student..."
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Iconify icon="eva:search-fill" sx={{ color: 'text.disabled' }} />
                </InputAdornment>
              ),
            }}
          />

          {/* <IconButton onClick={popover.onOpen}> */}
          {/*   <Iconify icon="eva:more-vertical-fill" /> */}
          {/* </IconButton> */}

        </Stack>

        <MobileDatePicker
          label="Start date"
          value={filters.startDate}
          onChange={handleFilterStartDate}
          slotProps={{ textField: { fullWidth: true } }}
          sx={{
            maxWidth: { md: 180 },
          }}
        />

        <MobileDatePicker
          label="End date"
          value={filters.endDate}
          onChange={handleFilterEndDate}
          slotProps={{
            textField: {
              fullWidth: true,
              error: dateError,
              helperText: dateError && 'End date must be later than start date',
            },
          }}
          sx={{
            maxWidth: { md: 180 },
            [`& .${formHelperTextClasses.root}`]: {
              position: { md: 'absolute' },
              bottom: { md: -40 },
            },
          }}
        />
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
                {/*<Checkbox*/}
                {/*  disableRipple*/}
                {/*  size="small"*/}
                {/*  checked={branch.includes(option)}*/}
                {/*/>*/}
                {option}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Stack>

      <CustomPopover
        open={popover.open}
        onClose={popover.onClose}
        arrow="right-top"
        sx={{ width: 140 }}
      >
        <MenuItem
          onClick={() => {
            popover.onClose();
          }}
        >
          <Iconify icon="solar:printer-minimalistic-bold" />
          Print
        </MenuItem>

        <MenuItem
          onClick={() => {
            popover.onClose();
          }}
        >
          <Iconify icon="solar:import-bold" />
          Import
        </MenuItem>

        <MenuItem
          onClick={() => {
            popover.onClose();
          }}
        >
          <Iconify icon="solar:export-bold" />
          Export
        </MenuItem>
      </CustomPopover>
    </>
  );
}

AttendanceTableToolbar.propTypes = {
  dateError: PropTypes.bool,
  filters: PropTypes.object,
  onFilters: PropTypes.func,
  serviceOptions: PropTypes.array,
};
