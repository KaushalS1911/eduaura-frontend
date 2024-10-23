import * as Yup from 'yup';
import { useMemo, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useForm, useFieldArray } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import Box from '@mui/material/Box';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import LoadingButton from '@mui/lab/LoadingButton';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';

import { useSnackbar } from 'src/components/snackbar';
import FormProvider, { RHFTextField } from 'src/components/hook-form';
import axios from 'axios';
import { useRouter } from 'src/routes/hooks';

// ----------------------------------------------------------------------

export default function ExaminationQuickEditForm({ currentUser, open, onClose, mutate }) {
  const { enqueueSnackbar } = useSnackbar();
  const router = useRouter();

  const NewUserSchema = Yup.object().shape({
    students: Yup.array().of(
      Yup.object().shape({
        student_id: Yup.string().required('Student ID is required'),
        obtained_marks: Yup.string().required('Marks are required'),
      }),
    ),
  });

  const defaultValues = useMemo(
    () => ({
      students:
        currentUser?.students?.map((student) => ({
          student_id: student?.student_id?._id || '',
          obtained_marks: student?.obtained_marks == '' ? 0 : student?.obtained_marks || '',
        })) || [],
    }),
    [currentUser],
  );

  const methods = useForm({
    resolver: yupResolver(NewUserSchema),
    defaultValues,
  });

  const {
    reset,
    handleSubmit,
    control,
    formState: { isSubmitting },
  } = methods;

  const { fields } = useFieldArray({
    control,
    name: 'students',
  });

  useEffect(() => {
    if (currentUser) {
      reset(defaultValues);
    }
  }, [currentUser, reset, defaultValues]);

  const onSubmit = handleSubmit(async (data) => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));
      const payload = data.students.map((item, index) => ({
        ...item,
        firstName: currentUser.students[index]?.student_id?.firstName,
        lastName: currentUser.students[index]?.student_id?.lastName,
      }));
      if (data) {
        const URL = `${import.meta.env.VITE_AUTH_API}/api/company/exam/${currentUser?._id}`;
        await axios
          .put(URL, { ...currentUser, students: payload })
          .then(() => {
            mutate();
            reset();
          })
          .catch((err) => console.log(err));
      }
      reset();
      onClose();
      enqueueSnackbar('Update success!');
    } catch (error) {
      console.error(error);
    }
  });

  return (
    <Dialog
      fullWidth
      maxWidth={false}
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: { maxWidth: 720 },
      }}
    >
      <FormProvider methods={methods} onSubmit={onSubmit}>
        <DialogTitle sx={{ textAlign: 'center', fontSize: '25px !important' }}>
          Student Marks
        </DialogTitle>

        <DialogContent>
          <Alert variant='outlined' severity='info' sx={{ mb: 3 }}>
            Please send all student marks
          </Alert>
          <Box
            rowGap={3}
            columnGap={2}
            display='grid'
            gridTemplateColumns={{
              xs: 'repeat(1, 1fr)',
              sm: '2fr 1fr',
            }}
          >
            <Box sx={{ textAlign: 'center', fontWeight: 'bold' }}>Student Name</Box>
            <Box sx={{ textAlign: 'center', fontWeight: 'bold' }}>Obtained Marks</Box>
            {fields.map((field, index) => (
              <Box key={field.id} sx={{ display: 'contents' }}>
                <RHFTextField
                  disabled
                  name={`students[${index}].student_id`}
                  value={`${currentUser?.students[index]?.student_id?.firstName} ${currentUser?.students[index]?.student_id?.lastName}`}
                />
                <RHFTextField name={`students[${index}].obtained_marks`} label='Marks'
                              inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }}
                              onInput={(e) => {
                                e.target.value = e.target.value.replace(/[^0-9]/g, '');
                              }} />
              </Box>
            ))}
          </Box>
        </DialogContent>

        <DialogActions>
          <Button variant='outlined' onClick={onClose}>
            Cancel
          </Button>

          <LoadingButton type='submit' variant='contained' loading={isSubmitting}>
            Update
          </LoadingButton>
        </DialogActions>
      </FormProvider>
    </Dialog>
  );
}

ExaminationQuickEditForm.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func,
  currentUser: PropTypes.object,
};
