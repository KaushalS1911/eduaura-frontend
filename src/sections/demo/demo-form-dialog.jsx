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
import { RHFAutocomplete, RHFTextField } from 'src/components/hook-form';
import { TimePicker, LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { Box, Stack } from '@mui/system';
import axios from 'axios';
import { useSnackbar } from 'notistack';
import dayjs from 'dayjs';
import { useAuthContext } from 'src/auth/hooks';
import { useEditDemo } from 'src/api/demo';

export default function DemoFormDialog({ open, setOpen, demosID, demoID, mutate }) {
  const { enqueueSnackbar } = useSnackbar();
  const [options, setOptions] = useState([]);
  const [facultyID, setFacultyID] = useState();

  const NewUserSchema = Yup.object().shape({
    faculty_name: Yup.object()
      .shape({
        label: Yup.string().required('Faculty name is required'),
        id: Yup.string().required('Faculty ID is required'),
      })
      .nullable()
      .required('Faculty name is required'),
    details: Yup.string().required('Details are required'),
    technology: Yup.string().required('Technology are required'),
    date: Yup.date().nullable().required('Date is required'),
    time: Yup.date().nullable().required('Time is required'),
  });

  const methods = useForm({
    resolver: yupResolver(NewUserSchema),
    defaultValues: {
      faculty_name: null,
      details: '',
      technology: '',
      date: null,
      time: null,
    },
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
    control,
    setValue,
  } = methods;

  const fetchDemoDetails = async () => {
    try {
      const URL = `https://admin-panel-dmawv.ondigitalocean.app/api/v2/demo/${demoID}`;
      const response = await axios.get(URL);
      if (response) {
        const { faculty, detail, date, time, technology } = response.data.data;
        const faculty_name = { label: `${faculty.firstName} ${faculty.lastName}`, id: faculty._id };
        setValue('faculty_name', faculty_name);
        setValue('details', detail);
        setValue('date', dayjs(date));
        setValue('time', dayjs(time));
        setValue('technology', technology);
        setFacultyID(faculty._id);
      } else {
        enqueueSnackbar('Demo not found', {
          variant: 'error',
        });
      }
    } catch (error) {
      console.error('Error fetching demo details:', error);
      enqueueSnackbar('Failed to fetch demo details', {
        variant: 'error',
      });
    }
  };

  const { user } = useAuthContext();
  const { company_id } = user;

  const fetchFacultyNames = async () => {
    try {
      const URL = `https://admin-panel-dmawv.ondigitalocean.app/api/company/${company_id}/faculty`;
      const response = await axios.get(URL);
      if (response.status === 200) {
        const fetchedOptions = response.data.data.map((e) => ({
          label: `${e.firstName} ${e.lastName}`,
          id: e._id,
        }));
        setOptions(fetchedOptions);
      } else {
        console.error('Failed to fetch faculty data:', response);
        enqueueSnackbar('Failed to fetch faculty data', { variant: 'error' });
      }
    } catch (error) {
      console.error('Error fetching faculty data:', error);
      enqueueSnackbar('Failed to fetch faculty data', { variant: 'error' });
    }
  };

  useEffect(() => {
    if (open) {
      fetchFacultyNames();
      fetchDemoDetails();
    }
  }, [open]);

  const onSubmit = async (data) => {
    try {
      const payload = {
        faculty_id: data.faculty_name.id,
        detail: data.details,
        technology: data.technology,
        date: dayjs(data.date).format('YYYY-MM-DDTHH:mm:ss.SSS[Z]'),
        time: dayjs(data.time).format('YYYY-MM-DDTHH:mm:ss.SSS[Z]'),
        status: 'pending',
      };
      const response = await useEditDemo(payload, demoID);
      mutate();
      enqueueSnackbar(response.message, {
        variant: 'success',
      });
      setOpen(false);
    } catch (error) {
      console.error('Error submitting demo:', error);
      enqueueSnackbar('Failed to create demo', {
        variant: 'error',
      });
    }
  };

  const handleFacultyChange = (event, newValue) => {
    if (newValue) {
      setValue('faculty_name', newValue);
      setFacultyID(newValue.id);
    } else {
      setValue('faculty_name', null);
      setFacultyID(null);
    }
  };

  return (
    <div>
      <Dialog open={open} onClose={() => setOpen(false)} fullWidth={true} maxWidth={'sm'}>
        <DialogTitle>Demo Edit Form</DialogTitle>
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
                  <RHFAutocomplete
                    name="faculty_name"
                    label="Faculty Name"
                    placeholder="Faculty Name"
                    fullWidth
                    options={options}
                    getOptionLabel={(option) => option.label}
                    onChange={handleFacultyChange}
                    value={methods.watch('faculty_name')}
                  />
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <Controller
                      name="date"
                      control={control}
                      render={({ field: { onChange, value }, fieldState: { error } }) => (
                        <DatePicker
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
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <Controller
                      name="time"
                      control={control}
                      render={({ field: { onChange, value }, fieldState: { error } }) => (
                        <TimePicker
                          label="Time"
                          value={value}
                          onChange={(time) => onChange(time)}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              error={!!error}
                              helperText={error ? error.message : null}
                              fullWidth
                            />
                          )}
                        />
                      )}
                    />
                  </LocalizationProvider>
                  <RHFTextField name="technology" label="Technology" />
                  <Controller
                    name="details"
                    control={control}
                    render={({ field, fieldState: { error } }) => (
                      <TextField
                        {...field}
                        label="Details"
                        multiline
                        rows={4}
                        placeholder="Details"
                        variant="outlined"
                        fullWidth
                        error={!!error}
                        helperText={error ? error.message : null}
                      />
                    )}
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
