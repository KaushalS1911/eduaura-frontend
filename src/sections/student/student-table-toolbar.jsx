import PropTypes from 'prop-types';
import { useCallback } from 'react';

import Stack from '@mui/material/Stack';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';

import Iconify from 'src/components/iconify';
import CustomPopover, { usePopover } from 'src/components/custom-popover';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import OutlinedInput from '@mui/material/OutlinedInput';
import Checkbox from '@mui/material/Checkbox';
import { MobileDatePicker } from '@mui/x-date-pickers';
import { formHelperTextClasses } from '@mui/material/FormHelperText';

// ----------------------------------------------------------------------

export default function StudentTableToolbar({ filters, onFilters, dateError, batch }) {
  console.log(batch);
  const popover = usePopover();
  const handleFilterName = useCallback(
    (event) => {
      onFilters('name', event.target.value);
    },
    [onFilters],
  );

  const handleFilterGender = useCallback(
    (event) => {
      onFilters(
        'gender',
        typeof event.target.value === 'string' ? event.target.value.split(',') : event.target.value,
      );
    },
    [onFilters],
  );
  const handleFilterBatch = useCallback(
    (event) => {
      onFilters(
        'Batch',
        typeof event.target.value === 'string' ? event.target.value.split(',') : event.target.value,
      );
    },
    [onFilters],
  );

  const handleFilterStartDate = useCallback(
    (newValue) => {
      onFilters('startDate', newValue);
    },
    [onFilters],
  );

  const handleFilterEndDate = useCallback(
    (newValue) => {
      onFilters('endDate', newValue);
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
          pr: { xs: 2.5, md: 2.5 },
        }}
      >
        <FormControl
          sx={{
            flexShrink: 0,
            width: { xs: 1, md: 200 },
          }}
        >
          <InputLabel>Gender</InputLabel>
          <Select
            multiple
            value={filters.gender}
            onChange={handleFilterGender}
            input={<OutlinedInput label='Gender' />}
            renderValue={(selected) => selected.map((value) => value).join(', ')}
            MenuProps={{
              PaperProps: {
                sx: { maxHeight: 240 },
              },
            }}
          >
            {['male', 'female', 'other'].map((option) => (
              <MenuItem key={option} value={option}>
                <Checkbox disableRipple size='small' checked={filters.gender.includes(option)} />
                {option}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        {/*<FormControl*/}
        {/*  sx={{*/}
        {/*    flexShrink: 0,*/}
        {/*    width: { xs: 1, md: 200 },*/}
        {/*  }}*/}
        {/*>*/}
        {/*  <InputLabel>Batch</InputLabel>*/}
        {/*  <Select*/}
        {/*    multiple*/}
        {/*    value={filters.gender}*/}
        {/*    onChange={handleFilterBatch}*/}
        {/*    input={<OutlinedInput label='Batch' />}*/}
        {/*    renderValue={(selected) => selected.map((value) => value).join(', ')}*/}
        {/*    MenuProps={{*/}
        {/*      PaperProps: {*/}
        {/*        sx: { maxHeight: 240 },*/}
        {/*      },*/}
        {/*    }}*/}
        {/*  >*/}
        {/*    {batch?.map((option) => (*/}
        {/*      <MenuItem key={option.batch_name} value={option.batch_name}>*/}
        {/*        <Checkbox disableRipple size='small' checked={filters.gender.includes(option.batch_name)} />*/}
        {/*        {option.batch_name}*/}
        {/*      </MenuItem>*/}
        {/*    ))}*/}
        {/*  </Select>*/}
        {/*</FormControl>*/}
        <MobileDatePicker
          label='Start date'
          value={filters.startDate}
          onChange={handleFilterStartDate}
          slotProps={{
            textField: {
              fullWidth: true,
            },
          }}
          sx={{
            maxWidth: { md: 200 },
          }}
        />

        <MobileDatePicker
          label='End date'
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
            maxWidth: { md: 200 },
            [`& .${formHelperTextClasses.root}`]: {
              position: { md: 'absolute' },
              bottom: { md: -40 },
            },
          }}
        />

        <Stack direction='row' alignItems='center' spacing={2} flexGrow={1} sx={{ width: 1 }}>
          <TextField
            fullWidth
            value={filters.name}
            onChange={handleFilterName}
            placeholder='Search...'
            InputProps={{
              startAdornment: (
                <InputAdornment position='start'>
                  <Iconify icon='eva:search-fill' sx={{ color: 'text.disabled' }} />
                </InputAdornment>
              ),
            }}
          />
        </Stack>
      </Stack>

      <CustomPopover
        open={popover.open}
        onClose={popover.onClose}
        arrow='right-top'
        sx={{ width: 140 }}
      >
        <MenuItem
          onClick={() => {
            popover.onClose();
          }}
        >
          <Iconify icon='solar:printer-minimalistic-bold' />
          Print
        </MenuItem>

        <MenuItem
          onClick={() => {
            popover.onClose();
          }}
        >
          <Iconify icon='solar:import-bold' />
          Import
        </MenuItem>

        <MenuItem
          onClick={() => {
            popover.onClose();
          }}
        >
          <Iconify icon='solar:export-bold' />
          Export
        </MenuItem>
      </CustomPopover>
    </>
  );
}

StudentTableToolbar.propTypes = {
  filters: PropTypes.object,
  onFilters: PropTypes.func,
  roleOptions: PropTypes.array,
};
