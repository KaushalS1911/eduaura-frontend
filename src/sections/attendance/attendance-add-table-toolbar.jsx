import PropTypes from 'prop-types';
import { useCallback, useEffect, useRef, useState } from 'react'; // Import useState
import Stack from '@mui/material/Stack';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import OutlinedInput from '@mui/material/OutlinedInput';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { usePopover } from 'src/components/custom-popover';

export default function AttendanceAddTableToolbar({
  filters,
  onFilters,
  dateError,
  serviceOptions,
  setSingleBatchID,
  setTodayDate,
}) {
  const popover = usePopover();
  const selectRef = useRef(null);

  const handleFilterService = useCallback(
    (event) => {
      const selectedId = event.target.value;
      setSingleBatchID(selectedId);
      onFilters('service', selectedId);
    },
    [onFilters, setSingleBatchID]
  );

  const handleFilterCurrent = useCallback(
    (newValue) => {
      setTodayDate(newValue);
      onFilters('Current', newValue);
    },
    [onFilters]
  );

  const handleClickOutsideSelect = useCallback(
    (event) => {
      if (selectRef.current && !selectRef.current.contains(event.target)) {
        popover.onClose();
      }
    },
    [popover]
  );

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutsideSelect);
    return () => {
      document.removeEventListener('mousedown', handleClickOutsideSelect);
    };
  }, [handleClickOutsideSelect]);

  useEffect(() => {
    if (!filters.Current) {
      const today = new Date();
      handleFilterCurrent(today);
    }
  }, [filters.Current, handleFilterCurrent]);

  return (
    <Stack
      spacing={2}
      alignItems={{ xs: 'flex-end', md: 'center' }}
      direction={{ xs: 'column', md: 'row' }}
      sx={{ p: 2.5, pr: { xs: 2.5, md: 1 } }}
    >
      <FormControl
        sx={{
          flexShrink: 0,
          width: { xs: 1, md: 400 },
        }}
      >
        <InputLabel>Select Batch</InputLabel>
        <Select
          ref={selectRef}
          value={filters.service || ''}
          onChange={handleFilterService}
          input={<OutlinedInput label="Select Batch" />}
          renderValue={(selected) => {
            const selectedOption = serviceOptions.find((option) => option._id === selected);
            return selectedOption ? selectedOption.batch_name : '';
          }}
          sx={{ textTransform: 'capitalize' }}
        >
          {serviceOptions.map((option) => (
            <MenuItem key={option._id} value={option._id}>
              {option.batch_name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <DatePicker
        label="Enter Date"
        value={filters.Current || null}
        onChange={handleFilterCurrent}
        slotProps={{ textField: { fullWidth: true } }}
        sx={{ maxWidth: { md: 400 } }}
      />
    </Stack>
  );
}

AttendanceAddTableToolbar.propTypes = {
  dateError: PropTypes.bool,
  filters: PropTypes.object,
  onFilters: PropTypes.func,
  serviceOptions: PropTypes.array,
  setSingleBatchID: PropTypes.func,
  setTodayDate: PropTypes.func,
};
