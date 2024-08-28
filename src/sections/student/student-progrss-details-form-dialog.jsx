import React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import Stack from '@mui/material/Stack';
import * as Yup from 'yup';
import { FormProvider, useForm, Controller } from 'react-hook-form';
import { LoadingButton } from '@mui/lab';
import { yupResolver } from '@hookform/resolvers/yup';
import { RHFAutocomplete } from 'src/components/hook-form';
import axios from 'axios';
import { useSnackbar } from 'notistack'; // Assuming you use notistack for snackbar notifications

const statusOptions = ['running', 'completed', 'leaved', 'training'];

const schema = Yup.object().shape({
  status: Yup.string().required('Status is required'),
});

export default function StudentProgrssDetailsFormDialog({ open, setOpen, currentStudent, mutate }) {
  const methods = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      status: currentStudent?.status || '',
    },
  });

  const { handleSubmit, formState: { isSubmitting } } = methods;
  const { enqueueSnackbar } = useSnackbar(); // Initialize the snackbar hook

  const onSubmit = async (data) => {
    const URL = `https://admin-panel-dmawv.ondigitalocean.app/api/v2/student/${currentStudent?._id}`;
    try {
      const response = await axios.put(URL, data);
      enqueueSnackbar(response?.data?.message || 'Status updated successfully', {
        variant: 'success',
      });
      setOpen(false);
      mutate(); // Trigger any updates needed
    } catch (error) {
      console.error('Failed to update student:', error);
      enqueueSnackbar('Failed to update student', { variant: 'error' });
    }
  };

  return (
    <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth='sm'>
      <DialogTitle>Status Update</DialogTitle>
      <DialogContent>
        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Stack spacing={2} sx={{ p: 1 }}>
              <Controller
                name='status'
                control={methods.control}
                render={({ field }) => (
                  <RHFAutocomplete
                    {...field}
                    label='Choose a status'
                    placeholder='Choose a status'
                    fullWidth
                    options={statusOptions}
                    getOptionLabel={(option) => option}
                    onChange={(event, value) => field.onChange(value)} // Handle changes
                    value={field.value} // Set the default value
                  />
                )}
              />
              <DialogActions sx={{ p: 0, my: 1 }}>
                <Button onClick={() => setOpen(false)} variant='outlined' color='inherit'>
                  Cancel
                </Button>
                <LoadingButton type='submit' variant='contained' loading={isSubmitting}>
                  Save
                </LoadingButton>
              </DialogActions>
            </Stack>
          </form>
        </FormProvider>
      </DialogContent>
    </Dialog>
  );
}
