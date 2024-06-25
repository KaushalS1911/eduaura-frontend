import React from 'react';
import * as Yup from 'yup';
import dayjs from 'dayjs';
import PropTypes from 'prop-types';
import { Dialog, DialogContent, DialogTitle, TextField } from '@mui/material';
import { FormProvider, useForm, Controller } from 'react-hook-form';
import { LoadingButton } from '@mui/lab';
import { yupResolver } from '@hookform/resolvers/yup';
import { RHFAutocomplete } from 'src/components/hook-form';
import { DEMO_FACULTY } from 'src/_mock/_inquiry';
import { DatePicker, TimePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { Box, Stack } from '@mui/system';
import axios from 'axios';
import { useSnackbar } from 'notistack';

export default function DemoEditPop({ open, onClose, currentId }) {
  const { enqueueSnackbar } = useSnackbar();
  const NewUserSchema = Yup.object().shape({
    faculty_name: Yup.string().required('Faculty name is required'),
    note: Yup.string().required('Note is required'),
    date: Yup.date().required('Date is required'),
    time: Yup.date().required('Time is required'),
  });
  function formatDate(inputDate) {
    const originalDate = new Date(inputDate);
    const day = originalDate.getDate();
    const month = originalDate.getMonth() + 1;
    const year = originalDate.getFullYear();
    const formattedDay = day < 10 ? `0${day}` : day;
    const formattedMonth = month < 10 ? `0${month}` : month;
    return `${year}-${formattedMonth}-${formattedDay}`;
  }
  function formatTime(inputTime) {
    const originalTime = new Date(inputTime);
    const hours = originalTime.getHours();
    const minutes = originalTime.getMinutes();
    const amPM = hours >= 12 ? 'PM' : 'AM';
    const formattedHours = hours % 12 === 0 ? 12 : hours % 12;
    const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
    return `${formattedHours}:${formattedMinutes} ${amPM}`;
  }
  const methods = useForm({
    resolver: yupResolver(NewUserSchema),
    defaultValues: {
      faculty_name: '',
      note: '',
      date: null,
      time: null,
    },
  });
  const {
    handleSubmit,
    formState: { isSubmitting },
    control,
  } = methods;
  // Create Demo
  const createDemo = async (newDemo) => {
    try {
      const URL = `https://admin-panel-dmawv.ondigitalocean.app/api/company/664ec7b3671bf9a7f5366599/demo`;
      const response = await axios.post(URL, newDemo);
      return response.data;
    } catch (error) {
      console.error('Error creating demo:', error);
      throw error;
    }
  };
  const onSubmit = async (data) => {
    try {
      const payload = {
        entries: [
          {
            faculty_name: data.faculty_name,
            note: data.note,
            date: formatDate(data.date),
            time: formatTime(data.time),
            status: 'pending',
          },
        ],
        inquiry_id: currentId?._id,
      };
      const response = await createDemo(payload);
      enqueueSnackbar(response.message, {
        variant: 'success',
      });
      onClose();
    } catch (error) {
      console.error('Error submitting demo:', error);
      enqueueSnackbar('Failed to create demo', {
        variant: 'error',
      });
    }
  };
  return (
    <Dialog
      fullWidth
      maxWidth="sm"
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: { maxWidth: 420 },
      }}
    >
      <DialogTitle sx={{ textAlign: 'center' }}>Demo Add</DialogTitle>
      <DialogContent>
        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Stack spacing={2} sx={{ p: 2 }}>
              <Box
                columnGap={2}
                rowGap={3}
                display="grid"
                gridTemplateColumns={{
                  xs: 'repeat(1, 1fr)',
                  md: 'repeat(1, 1fr)',
                }}
              >
                <Controller
                  name="faculty_name"
                  control={control}
                  render={({ field, fieldState: { error } }) => (
                    <RHFAutocomplete
                      {...field}
                      options={DEMO_FACULTY}
                      getOptionLabel={(option) => option}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="Faculty Name"
                          placeholder="Faculty Name"
                          error={!!error}
                          helperText={error ? error.message : null}
                          fullWidth
                        />
                      )}
                      onChange={(event, value) => field.onChange(value)}
                    />
                  )}
                />
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <Controller
                    name="date"
                    control={control}
                    render={({ field: { onChange, value }, fieldState: { error } }) => (
                      <DatePicker
                        label="Date"
                        value={value}
                        onChange={onChange}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            error={!!error}
                            helperText={error ? error.message : null}
                          />
                        )}
                      />
                    )}
                  />
                </LocalizationProvider>

                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <Controller
                    name="time"
                    control={control}
                    render={({ field: { onChange, value }, fieldState: { error } }) => (
                      <TimePicker
                        label="Time"
                        value={value}
                        onChange={onChange}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            error={!!error}
                            helperText={error ? error.message : null}
                          />
                        )}
                      />
                    )}
                  />
                </LocalizationProvider>
                <Controller
                  name="note"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Notes"
                      multiline
                      rows={4}
                      cols={10}
                      placeholder="Notes"
                      variant="outlined"
                      fullWidth
                    />
                  )}
                />
              </Box>
              <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
                Add Demo
              </LoadingButton>
            </Stack>
          </form>
        </FormProvider>
      </DialogContent>
    </Dialog>
  );
}
DemoEditPop.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  currentId: PropTypes.object.isRequired,
};
