import * as Yup from 'yup';
import PropTypes from 'prop-types';
import { Controller, useForm } from 'react-hook-form';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import LoadingButton from '@mui/lab/LoadingButton';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import { Box } from '@mui/material';
import FormProvider, { RHFTextField } from 'src/components/hook-form';
import { DatePicker } from '@mui/x-date-pickers';
import axios from 'axios';
import { useEffect, useState } from 'react';

// ----------------------------------------------------------------------

export default function AddRemarkForm({ open, onClose, currentStudent }) {
  const [allRemark, setAllRemark] = useState();

  const NewAddressSchema = Yup.object().shape({
    title: Yup.string().required('title is required'),
    date: Yup.string().required('date require'),
  });

  const defaultValues = {
    title: '',
    date: '',
  };

  const methods = useForm({
    // resolver: yupResolver(NewAddressSchema),
    defaultValues,
  });

  useEffect(() => {
    setAllRemark(currentStudent?.remarks);
  }, [currentStudent]);

  const {
    handleSubmit,
    reset,
    control,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = handleSubmit(async (data) => {
    allRemark.push(data);
    const URL = `https://server-eduaura-pyjuy.ondigitalocean.app/api/v2/student/${currentStudent?._id}`;
    try {
      axios
        .put(URL, { remarks: allRemark })
        .then((res) => console.log(res))
        .catch((err) => console.log(err));
      onClose();
      reset();
    } catch (error) {
      console.error(error);
    }
  });

  return (
    <Dialog fullWidth maxWidth='sm' open={open} onClose={onClose}>
      <FormProvider methods={methods} onSubmit={onSubmit}>
        <DialogTitle>New Remark Add</DialogTitle>
        <DialogContent dividers>
          <Stack spacing={3}>
            <Box mt={2}>
              <RHFTextField name='title' label='Title' />
            </Box>
            <Stack spacing={1.5}>
              <Controller
                name='date'
                control={control}
                render={({ field, fieldState: { error } }) => (
                  <DatePicker
                    {...field}
                    label='Choose Date'
                    format='dd/MM/yyyy'
                    slotProps={{
                      textField: {
                        fullWidth: true,
                        error: !!error,
                        helperText: error?.message,
                      },
                    }}
                  />
                )}
              />
            </Stack>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button color='inherit' variant='outlined' onClick={onClose}>
            Cancel
          </Button>
          <LoadingButton type='submit' variant='contained' loading={isSubmitting}>
            Save
          </LoadingButton>
        </DialogActions>
      </FormProvider>
    </Dialog>
  );
}

AddRemarkForm.propTypes = {
  onClose: PropTypes.func,
  onCreate: PropTypes.func,
  open: PropTypes.bool,
};
