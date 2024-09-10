import PropTypes from 'prop-types';
import { useCallback } from 'react';

import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import Iconify from 'src/components/iconify';
import { Grid } from '@mui/material';
import { formHelperTextClasses } from '@mui/material/FormHelperText';
import { MobileDatePicker } from '@mui/x-date-pickers';

// ----------------------------------------------------------------------

export default function InquiryTableToolbar({ filters, onFilters, roleOptions, dateError }) {
  const handleFilterName = useCallback(
    (event) => {
      onFilters('name', event.target.value);
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
          pr: { xs: 2.5, md: 1 },
        }}
      >
        <Stack
          direction='row'
          alignItems='center'
          spacing={2}
          flexGrow={1}
          sx={{ width: 1, pr: 1.5 }}
        >
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
        </Stack>
      </Stack>
    </>
  );
}

InquiryTableToolbar.propTypes = {
  filters: PropTypes.object,
  onFilters: PropTypes.func,
  roleOptions: PropTypes.array,
};
