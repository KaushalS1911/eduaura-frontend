import React, { useEffect, useState } from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import TextField from '@mui/material/TextField';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import * as Yup from 'yup';
import { FormProvider, useForm, Controller } from 'react-hook-form';
import { LoadingButton } from '@mui/lab';
import { yupResolver } from '@hookform/resolvers/yup';
import { RHFAutocomplete } from 'src/components/hook-form';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { Box, Stack } from '@mui/system';
import { useSnackbar } from 'notistack';
import dayjs from 'dayjs';
import { useEditDemo } from 'src/api/demo';
import { useGetConfigs } from 'src/api/config';
import { useAttendanceEdit, useGetAllAttendance } from 'src/api/attendance';

export default function AttendanceFormDialog({ open, setOpen, mutate, singleAttendanceID }) {
  const { enqueueSnackbar } = useSnackbar();
  const { configs } = useGetConfigs();

  const NewUserSchema = Yup.object().shape({
    date: Yup.date().nullable().required('Date is required'),
    status: Yup.string().required('Status is required'),
  });

  const methods = useForm({
    resolver: yupResolver(NewUserSchema),
    defaultValues: {
      date: null,
      status: null,
    },
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
    control,
    setValue,
  } = methods;

  const { attendance } = useGetAllAttendance();
  const singleData = attendance.find((data) => data._id === singleAttendanceID);

  useEffect(() => {
    if (singleData) {
      setValue('date', singleData?.date ? dayjs(singleData.date) : null);
      setValue('status', singleData?.status);
    }
  }, [singleData, setValue]);

  const onSubmit = async (data) => {
    try {
      const payload = {
        ...singleData,
        status: data.status,
      };
      const response = await useAttendanceEdit(payload, singleAttendanceID);
      mutate();

      if (response && typeof response.message === 'string') {
        enqueueSnackbar(response.message, {
          variant: 'success',
        });
      } else {
        enqueueSnackbar('Attendance updated successfully', {
          variant: 'success',
        });
      }

      setOpen(false);
    } catch (error) {
      console.error('Error submitting demo:', error);

      enqueueSnackbar('Failed to update attendance', {
        variant: 'error',
      });
    }
  };

  const status = ['present', 'absent', 'late'];

  return (
    <div>
      <Dialog open={open} onClose={() => setOpen(false)} fullWidth={true} maxWidth={'sm'}>
        <DialogTitle>Edit Attendance</DialogTitle>
        <DialogContent>
          <FormProvider {...methods}>
            <form onSubmit={handleSubmit(onSubmit)}>
              <Stack spacing={2} sx={{ p: 1 }}>
                <Box
                  columnGap={2}
                  rowGap={3}
                  display="grid"
                  gridTemplateColumns={{
                    xs: 'repeat(1, 1fr)',
                    md: 'repeat(1, 1fr)',
                  }}
                >
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <Controller
                      name="date"
                      control={control}
                      render={({ field: { onChange, value }, fieldState: { error } }) => (
                        <DatePicker
                          readOnly
                          label="Date"
                          value={value}
                          onChange={(date) => onChange(date)}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              error={!!error}
                              fullWidth
                              helperText={error ? error.message : null}
                            />
                          )}
                        />
                      )}
                    />
                  </LocalizationProvider>
                  <RHFAutocomplete
                    name="status"
                    label="Choose a status"
                    placeholder="Choose a status"
                    fullWidth
                    options={status}
                    getOptionLabel={(option) => option}
                  />
                </Box>
                <DialogActions sx={{ p: 0, my: 1 }}>
                  <Button onClick={() => setOpen(false)} variant="outlined" color="inherit">
                    Cancel
                  </Button>
                  <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
                    Save
                  </LoadingButton>
                </DialogActions>
              </Stack>
            </form>
          </FormProvider>
        </DialogContent>
      </Dialog>
    </div>
  );
}
