import React, { useEffect, useState } from 'react';
import * as Yup from 'yup';
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Unstable_Grid2';
import CardHeader from '@mui/material/CardHeader';
import Typography from '@mui/material/Typography';
import { DatePicker } from '@mui/x-date-pickers';
import { TextField } from '@mui/material';
import { useRouter } from 'src/routes/hooks';
import { useBoolean } from 'src/hooks/use-boolean';
import { useResponsive } from 'src/hooks/use-responsive';
import { useSnackbar } from 'src/components/snackbar';
import FormProvider, { RHFTextField, RHFAutocomplete } from 'src/components/hook-form';
import axios from 'axios';
import { useAuthContext } from 'src/auth/hooks';
import { useGetStudentsList } from 'src/api/student';
import { useGetFaculty } from 'src/api/faculty';
import { paths } from '../../routes/paths';
import { useGetConfigs } from '../../api/config';
import { useGetBatches } from '../../api/batch';

const ExaminationNewForm = () => {
  const router = useRouter();
  const mdUp = useResponsive('up', 'md');
  const { enqueueSnackbar } = useSnackbar();
  const preview = useBoolean();
  const { user } = useAuthContext();
  const { faculty } = useGetFaculty();
  const { configs } = useGetConfigs();
  const { students } = useGetStudentsList(user?.company_id);
  const { batch } = useGetBatches();
  const [facultyName, setFacultyName] = useState([]);

  useEffect(() => {
    if (faculty) {
      setFacultyName(faculty);
    }
  }, [faculty]);

  const NewBlogSchema = Yup.object().shape({
    title: Yup.object().required('Title is required'),
    desc: Yup.string().required('Description is required'),
    date: Yup.date().required('Date is required'),
    total_marks: Yup.number().required('Total marks is required'),
    conducted_by: Yup.object().required('Faculty is required'),
    batch: Yup.object().required('Batch is required'), // Add validation for batch
  });

  const methods = useForm({
    resolver: yupResolver(NewBlogSchema),
    defaultValues: {
      title: null,
      desc: '',
      date: null,
      total_marks: '',
      conducted_by: null,
      batch: null,
    },
  });

  const {
    setValue,
    handleSubmit,
    control,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = handleSubmit(async (data) => {
    const selectedBatch = data.batch;
    const studentIds = selectedBatch?.value?.batch_members?.map(member => ({ student_id: member._id }));
    try {
      const URL = `${import.meta.env.VITE_AUTH_API}/api/company/exam`;
      await axios.post(URL, {
        ...data,
        students: studentIds,
        title: data?.title.label,
        conducted_by: data?.conducted_by?._id,
        company_id: user?.company_id,
        batch: {
          name: selectedBatch.name,
          members: studentIds,
        },
      });

      enqueueSnackbar('Create success!');
      router.push(paths.dashboard.examination.list);
      preview.onFalse();
    } catch (error) {
      console.error(error);
      enqueueSnackbar('An error occurred. Please try again.', { variant: 'error' });
    }
  });

  const renderDetails = (
    <>
      {mdUp && (
        <Grid md={4}>
          <Typography variant='h6' sx={{ mb: 0.5 }}>
            Details
          </Typography>
          <Typography variant='body2' sx={{ color: 'text.secondary' }}>
            Title, short description, Date...
          </Typography>
        </Grid>
      )}

      <Grid xs={12} md={8}>
        <Card>
          {!mdUp && <CardHeader title='Details' />}
          <Stack spacing={3} sx={{ p: 3 }}>
            <RHFAutocomplete
              name='title'
              label='Title'
              placeholder='Choose a title'
              fullWidth
              options={configs?.courses?.flatMap(course => [
                { label: course.name, value: course.name },
                ...course.subcategories.flatMap(sub => ({ label: sub, value: sub })),
              ])}
              isOptionEqualToValue={(option, value) => option.value === value.value}
              getOptionLabel={(option) => option.label}
            />
            <RHFTextField name='total_marks' label='Total Marks'
                          inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }}
                          onInput={(e) => {
                            e.target.value = e.target.value.replace(/[^0-9]/g, '');
                          }} />
            <Stack spacing={1.5}>
              <Controller
                name='date'
                control={control}
                render={({ field, fieldState: { error } }) => (
                  <DatePicker
                    {...field}
                    value={field.value}
                    onChange={(newDate) => {
                      setValue('date', newDate, { shouldValidate: true });
                      field.onChange(newDate);
                    }}
                    format='dd/MM/yyyy'
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        fullWidth
                        error={!!error}
                        helperText={error?.message}
                      />
                    )}
                  />
                )}
              />
            </Stack>
            <RHFAutocomplete
              name='conducted_by'
              type='faculty'
              label='Faculty Name'
              placeholder='Choose a faculty'
              fullWidth
              options={facultyName.map((option) => option)}
              getOptionLabel={(option) => `${option?.firstName} ${option?.lastName}`}
            />
            <RHFAutocomplete
              name='batch'
              label='Batch'
              placeholder='Choose a batch'
              fullWidth
              options={batch.map((option) => ({ label: option.batch_name, value: option }))}
              isOptionEqualToValue={(option, value) => option.value._id === value.value._id}
              getOptionLabel={(option) => option.label}
            />
            <RHFTextField name='desc' label='Description' multiline rows={3} />
          </Stack>
        </Card>
        <Stack sx={{ my: '30px', alignItems: 'flex-end' }}>
          <Button type='submit' variant='contained'>
            Submit
          </Button>
        </Stack>
      </Grid>
    </>
  );

  return (
    <>
      <FormProvider methods={methods} onSubmit={onSubmit}>
        <Grid container spacing={3}>
          {renderDetails}
        </Grid>
      </FormProvider>
    </>
  );
};

export default ExaminationNewForm;
