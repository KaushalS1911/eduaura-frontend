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
import FormProvider from 'src/components/hook-form/form-provider';
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
export default function GuardianAddForm({ open, onClose, currentStudent, mutate, updateGuardian }) {
  const [allGuardian, setAllGuardian] = useState([]);
  const NewAddressSchema = Yup.object().shape({
    firstName: Yup.string()
      .required('First Name is required')
      .transform((value) => value.toUpperCase()),
    lastName: Yup.string()
      .required('Last Name is required')
      .transform((value) => value.toUpperCase()),
    contact: Yup.string().max(10).min(10).required('Contact number is required'),
    relation_type: Yup.string().required('Guardian Type is required'),
  });
  const defaultValues = {
    firstName: '',
    lastName: '',
    contact: '',
    relation_type: '',
  };
  const methods = useForm({
    resolver: yupResolver(NewAddressSchema),
    defaultValues,
  });
  const {
    reset,
    handleSubmit,
    formState: { isSubmitting, errors },
  } = methods;
  useEffect(() => {
    setAllGuardian(currentStudent?.guardian_detail || []);
  }, [currentStudent]);
  useEffect(() => {
    if (updateGuardian) {
      reset({
        firstName: updateGuardian.firstName?.toUpperCase() || '',
        lastName: updateGuardian.lastName?.toUpperCase() || '',
        contact: updateGuardian.contact || '',
        relation_type: updateGuardian.relation_type || '',
      });
    } else {
      reset(defaultValues);
    }
  }, [updateGuardian, reset]);
  const onSubmit = handleSubmit(async (data) => {
    const updatedGuardians = [...allGuardian, data];
    try {
      if (updateGuardian) {
        const URL = `https://admin-panel-dmawv.ondigitalocean.app/api/v2/student/${currentStudent?._id}/guardian/${updateGuardian?._id}`;
        await axios
          .put(URL, data)
          .then((res) => mutate())
          .catch((err) => console.log(err));
        setAllGuardian(updatedGuardians);
        onClose();
      } else {
        const URL = `https://admin-panel-dmawv.ondigitalocean.app/api/v2/student/${currentStudent?._id}`;
        await axios
          .put(URL, { guardian_detail: updatedGuardians })
          .then((res) => mutate())
          .catch((err) => console.log(err));
        setAllGuardian(updatedGuardians);
        onClose();
      }
      reset();
    } catch (error) {
      console.error('Error while submitting form:', error);
    }
  });
  return (
    <Dialog fullWidth maxWidth="sm" open={open} onClose={onClose}>
      <FormProvider methods={methods} onSubmit={onSubmit}>
        <DialogTitle>New Guardian Add</DialogTitle>
        <DialogContent dividers>
          <Stack spacing={3}>
            <Box mt={2}>
              <RHFAutocomplete
                name="relation_type"
                label="Guardian Type"
                placeholder="Choose a guardian type"
                options={guardianTypes}
              />
            </Box>
            <RHFTextField name="firstName" label="First Name" />
            <RHFTextField name="lastName" label="Last Name" />
            <RHFTextField name="contact" label="Phone Number" />
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
      </FormProvider>
    </Dialog>
  );
}
GuardianAddForm.propTypes = {
  onClose: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
  currentStudent: PropTypes.object,
  updateGuardian: PropTypes.object,
  mutate: PropTypes.func.isRequired,
};
