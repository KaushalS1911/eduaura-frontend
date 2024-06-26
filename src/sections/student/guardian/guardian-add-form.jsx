import * as Yup from 'yup';
import PropTypes from 'prop-types';
import { useForm, FormProvider as RHFProvider } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import LoadingButton from '@mui/lab/LoadingButton';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import { Box } from '@mui/material';

import { useEffect, useState } from 'react';
import axios from 'axios';
import { RHFAutocomplete, RHFTextField } from 'src/components/hook-form';

const guardianTypes = [
  'Mother',
  'Father',
  'Aunt',
  'Uncle',
  'Brother',
  'Grandfather',
  'Grandmother',
  'Sister',
  'Guardian',
  'Family friend',
  'Other',
  'Cousin',
];

export default function GuardianAddForm({ open, onClose, currentStudent, mutate }) {
  const NewAddressSchema = Yup.object().shape({
    firstName: Yup.string().required('First Name is required'),
    lastName: Yup.string().required('Last Name is required'),
    contact: Yup.string().required('Phone Number is required').max(10).min(10),
    relation_type: Yup.string().required('Guardian Type is required'),
  });

  const [allGuardian, setAllGuardian] = useState([]);

  useEffect(() => {
    setAllGuardian(currentStudent?.guardian_detail || []);
  }, [currentStudent]);

  const methods = useForm({
    resolver: yupResolver(NewAddressSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      contact: '',
      relation_type: '',
    },
  });

  const {
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = async (data) => {
    const updatedGuardians = [...allGuardian, data];
    const URL = `https://admin-panel-dmawv.ondigitalocean.app/api/v2/student/${currentStudent?._id}`;

    try {
      await axios
        .put(URL, { ...currentStudent, guardian_detail: updatedGuardians })
        .then((res) => mutate())
        .catch((err) => console.log(err));
      setAllGuardian(updatedGuardians);
      onClose();
      reset();
    } catch (error) {
      console.error('Error while submitting form:', error);
    }
  };

  return (
    <Dialog fullWidth maxWidth="sm" open={open} onClose={onClose}>
      <RHFProvider {...methods}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogTitle>New Guardian Add</DialogTitle>
          <DialogContent dividers>
            <Stack spacing={3}>
              <Box mt={2}>
                <RHFTextField name="firstName" label="First Name" />
              </Box>
              <RHFTextField name="lastName" label="Last Name" />
              <RHFTextField name="contact" label="Phone Number" />
              <RHFAutocomplete
                name="relation_type"
                label="Guardian Type"
                placeholder="Choose a guardian type"
                options={guardianTypes}
              />
            </Stack>
          </DialogContent>
          <DialogActions>
            <Button color="inherit" variant="outlined" onClick={onClose}>
              Cancel
            </Button>
            <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
              Save
            </LoadingButton>
          </DialogActions>
        </form>
      </RHFProvider>
    </Dialog>
  );
}

GuardianAddForm.propTypes = {
  onClose: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
  currentStudent: PropTypes.object,
};
