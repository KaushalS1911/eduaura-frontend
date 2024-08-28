import React, { useState, useEffect } from 'react';
import * as Yup from 'yup';
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { Card, Stack, Button, Grid, CardHeader, Typography } from '@mui/material';
import { MobileTimePicker } from '@mui/x-date-pickers/MobileTimePicker';
import { useRouter } from 'src/routes/hooks';
import { useBoolean } from 'src/hooks/use-boolean';
import { useResponsive } from 'src/hooks/use-responsive';
import { useSnackbar } from 'src/components/snackbar';
import FormProvider, { RHFAutocomplete, RHFTextField } from 'src/components/hook-form';
import axios from 'axios';
import { paths } from 'src/routes/paths';
import { useGetStudents, useGetStudentsList } from 'src/api/student';
import { useAuthContext } from 'src/auth/hooks';
import RHFAutocomplete1 from 'src/components/hook-form/batch-autocomplete';
import { useGetFaculty } from 'src/api/faculty';
import { useGetConfigs } from '../../api/config';

const BatchNewForm = () => {
  const router = useRouter();
  const mdUp = useResponsive('up', 'md');
  const { enqueueSnackbar } = useSnackbar();
  const { user } = useAuthContext();
  const { faculty } = useGetFaculty();
  const preview = useBoolean();
  const { students } = useGetStudentsList(user?.company_id);
  const [studentName, setStudentName] = useState([]);
  const [facultyName, setFacultyName] = useState([]);
  const { configs } = useGetConfigs();
  useEffect(() => {
    if (students) {
      setStudentName(students);
    }
    if (faculty) {
      setFacultyName(faculty);
    }
  }, [students, faculty]);

  const NewBlogSchema = Yup.object().shape({
    technology: Yup.string().required('Technology is required'),
    batch_time: Yup.string().required('Time is required'),
    batch_name: Yup.string().required('Batch Name is required'),
    faculty: Yup.object().shape({
      _id: Yup.string().required('Faculty Name is required'),
    }),
    batch_members: Yup.array()
      .of(
        Yup.object().shape({
          _id: Yup.string().required('Batch Member is required'),
        })
      )
      .required('At least one Batch Member is required')
      .min(1, 'At least one Batch Member is required'),
  });
  const methods = useForm({
    resolver: yupResolver(NewBlogSchema),
    defaultValues: {
      technology: '',
      faculty: null,
      batch_time: null,
      batch_name: '',
      batch_members: [],
    },
  });

  const {
    handleSubmit,
    control,
    formState: { errors },
  } = methods;

  const onSubmit = handleSubmit(async (data) => {
    const batchMemberIds = data.batch_members?.map((member) => member._id);

    try {
      const URL = `${import.meta.env.VITE_AUTH_API}/api/company/${user?.company_id}/batch`;
      await axios.post(URL, {
        ...data,
        batch_members: batchMemberIds,
        faculty: data?.faculty?._id,
      });
      enqueueSnackbar('Create success!');
      router.push(paths.dashboard.batches.root);
      preview.onFalse();
    } catch (error) {
      console.log('Error:', error);
    }
  });
  const renderDetails = (
    <>
      {mdUp && (
        <Grid md={4}>
          <Typography variant="h6" sx={{ mb: 0.5 }}>
            Details
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            Technology, Time...
          </Typography>
        </Grid>
      )}

      <Grid xs={12} md={8}>
        <Card>
          {!mdUp && <CardHeader title="Details" />}
          <Stack spacing={3} sx={{ p: 3 }}>
            <RHFAutocomplete
              name="technology"
              type="technology"
              label="Technology"
              placeholder="Choose a technology"
              fullWidth
              options={configs?.courses?.flatMap(course => course.subcategories)}
              isOptionEqualToValue={(option, value) => option === value}
            />
            <RHFTextField name="batch_name" label="Batch Name" />
            <Controller
              name="batch_time"
              control={control}
              render={({ field }) => (
                <>
                  <MobileTimePicker
                    orientation="portrait"
                    label="Batch Time"
                    value={field.value}
                    onChange={(newValue) => field.onChange(newValue)}
                    slotProps={{
                      textField: {
                        fullWidth: true,
                        margin: 'normal',
                        error: !!errors.batch_time,
                        helperText: errors.batch_time?.message,
                      },
                    }}
                  />
                </>
              )}
            />

            <RHFAutocomplete
              name="faculty"
              type="faculty"
              label="Facult Name"
              placeholder="Choose a faculty"
              fullWidth
              options={facultyName.map((option) => option)}
              getOptionLabel={(option) => `${option?.firstName} ${option?.lastName}`}
            />
            <RHFAutocomplete1
              name={'batch_members'}
              labelName="Batch Members"
              control={control}
              studentName={studentName}
              renderError={({ message }) => (
                <Typography variant="body2" color="error">
                  {message}
                </Typography>
              )}
            />
          </Stack>
        </Card>
        <Stack sx={{ my: '30px', alignItems: 'flex-end' }}>
          <Button type="submit" variant="contained">
            Submit
          </Button>
        </Stack>
      </Grid>
    </>
  );

  return (
    <FormProvider methods={methods} onSubmit={onSubmit}>
      <Grid container>{renderDetails}</Grid>
    </FormProvider>
  );
};

export default BatchNewForm;
