import * as Yup from 'yup';
import { useMemo } from 'react';
import PropTypes from 'prop-types';
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import LoadingButton from '@mui/lab/LoadingButton';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { useSnackbar } from 'src/components/snackbar';
import FormProvider, { RHFTextField } from 'src/components/hook-form';
import Stack from '@mui/system/Stack';
import axios from 'axios';
import { useGetEmployees } from 'src/api/employee';
import { TextField } from '@mui/material';

// ----------------------------------------------------------------------

export default function EmployeeQuickEditForm({ currentEmployee, open, onClose }) {
  const { mutate } = useGetEmployees();

  const { enqueueSnackbar } = useSnackbar();
  const NewUserSchema = Yup.object().shape({
    firstName: Yup.string().required('Firstname is required'),
    lastName: Yup.string().required('Lastname is required'),
    contact: Yup.string().required('Phone number is required'),
    email: Yup.string().required('Email is required').email('Email must be a valid email address'),
  });

  const defaultValues = useMemo(
    () => ({
      firstName: currentEmployee?.firstName || '',
      lastName: currentEmployee?.lastName || '',
      email: currentEmployee?.email || '',
      contact: currentEmployee?.contact || '',
      technology: currentEmployee?.technology || '',
      role: currentEmployee?.role || '',
      dob: currentEmployee?.dob ? new Date(currentEmployee?.dob) : null,
      joining_date: currentEmployee?.joining_date ? new Date(currentEmployee?.joining_date) : null,
    }),
    [currentEmployee]
  );

  const methods = useForm({
    resolver: yupResolver(NewUserSchema),
    defaultValues,
  });

  const {
    reset,
    control,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = async (data) => {
    try {
      const URL = `https://admin-panel-dmawv.ondigitalocean.app/api/company/664ec61d671bf9a7f53664b5/${currentEmployee._id}/updateEmployee`;
      const response = axios.put(URL, data);
      reset();
      onClose();
      mutate();
      enqueueSnackbar('Employee Edit Successfully', { variant: 'success' });
    } catch (error) {
      console.error('error', error);
      enqueueSnackbar(error.response?.data?.message, { variant: 'error' });
    }
  };

  return (
    <Dialog
      fullWidth
      maxWidth="md"
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: { maxWidth: 720 },
      }}
    >
      <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
        <DialogTitle sx={{ textAlign: 'center' }}>Quick Update</DialogTitle>

        <DialogContent>
          <Stack spacing={3} sx={{ p: 3 }}>
            <Box
              columnGap={2}
              rowGap={3}
              display="grid"
              gridTemplateColumns={{
                xs: 'repeat(1, 1fr)',
                md: 'repeat(2, 1fr)',
              }}
            >
              <RHFTextField name="firstName" label="First Name" />
              <RHFTextField name="lastName" label="Last Name" />
              <RHFTextField name="email" label="Email Address" />
              <RHFTextField name="contact" label="Phone Number" />
              <RHFTextField name="technology" label="Technology" />
              <RHFTextField name="role" label="Role" />
              <Stack spacing={1.5}>
                <Controller
                  name="dob"
                  control={control}
                  render={({ field, fieldState: { error } }) => (
                    <DatePicker
                      {...field}
                      label="Date of Birth"
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          fullWidth
                          error={!!error}
                          helperText={error ? error.message : ''}
                        />
                      )}
                    />
                  )}
                />
              </Stack>

              <Stack spacing={1.5}>
                <Controller
                  name="joining_date"
                  control={control}
                  render={({ field, fieldState: { error } }) => (
                    <DatePicker
                      {...field}
                      label="Joining Date"
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          fullWidth
                          error={!!error}
                          helperText={error ? error.message : ''}
                        />
                      )}
                    />
                  )}
                />
              </Stack>
            </Box>
          </Stack>
        </DialogContent>

        <DialogActions>
          <Button variant="outlined" onClick={onClose}>
            Cancel
          </Button>

          <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
            Update
          </LoadingButton>
        </DialogActions>
      </FormProvider>
    </Dialog>
  );
}

EmployeeQuickEditForm.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func,
  currentEmployee: PropTypes.object,
};
