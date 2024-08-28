import React, { useEffect, useState } from 'react';
import * as Yup from 'yup';
import PropTypes from 'prop-types';
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
import RHFAutocomplete1 from 'src/components/hook-form/batch-autocomplete';
import moment from 'moment';
import { useGetStudentsList } from 'src/api/student';
import { useAuthContext } from 'src/auth/hooks';
import { useGetFaculty } from 'src/api/faculty';
import { useGetConfigs } from '../../api/config';

export default function BatchNewEditForm({ batchId }) {
  const router = useRouter();
  const mdUp = useResponsive('up', 'md');
  const { enqueueSnackbar } = useSnackbar();
  const preview = useBoolean();
  const { user } = useAuthContext();
  const { students } = useGetStudentsList(user?.company_id);
  const { faculty } = useGetFaculty();
  const { configs } = useGetConfigs();

  const [studentName, setStudentName] = useState([]);
  const [facultyName, setFacultyName] = useState([]);
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
    batch_members: Yup.array().required('Batch Member is required'),
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
    reset,
    setValue,
    handleSubmit,
    control,
    formState: { isSubmitting },
  } = methods;

  useEffect(() => {
    const fetchBatchesById = async () => {
      try {
        if (batchId) {
          const URL = `${import.meta.env.VITE_AUTH_API}/api/company/batch/${batchId}`;
          const response = await axios.get(URL);
          const { data } = response.data;
          reset({
            technology: data?.batch?.technology,
            batch_name: data?.batch?.batch_name,
            batch_time: new Date(data?.batch?.batch_time),
            faculty: data?.batch?.faculty,
            batch_members: data?.batch?.batch_members,
            // batch_members: [{name:"ramesh"},{name:"heet"}],
          });
        }
      } catch (error) {
        console.error('Failed to fetch batch:', error);
      }
    };
    fetchBatchesById();
  }, [batchId, reset]);

  const onSubmit = handleSubmit(async (data) => {
    try {
      const formattedData = {
        ...data,
        batch_members: data.batch_members?.map((member) => member._id),
        faculty: data?.faculty?._id,
      };
      const URL = `${import.meta.env.VITE_AUTH_API}/api/company/batch/${batchId}`;
      await axios
        .put(URL, formattedData)
        .then((res) => enqueueSnackbar('Update success!'))
        .catch((err) => console.log(err));

      router.push(paths.dashboard.batches.root);
      preview.onFalse();
    } catch (error) {
      console.log('Error:', error);
    }
  });
  const technology = [
    'Full-Stack',
    'Flutter',
    'Game',
    'Ui/Ux',
    'C++ programing',
    'C programing',
    'CCC language',
    'HTML',
    'CSS',
  ];

  const renderDetails = (
    <>
      {mdUp && (
        <Grid md={4}>
          <Typography variant='h6' sx={{ mb: 0.5 }}>
            Details
          </Typography>
          <Typography variant='body2' sx={{ color: 'text.secondary' }}>
            Technology, Time...
          </Typography>
        </Grid>
      )}

      <Grid xs={12} md={8}>
        <Card>
          {!mdUp && <CardHeader title='Details' />}
          <Stack spacing={3} sx={{ p: 3 }}>
            {/* <RHFTextField name="technology" label="Technology" /> */}
            <RHFAutocomplete
              name='technology'
              type='technology'
              label='Technology'
              placeholder='Choose a technology'
              fullWidth
              options={configs?.courses?.flatMap(course => course.subcategories)}
              isOptionEqualToValue={(option, value) => option === value}
            />
            <RHFTextField name='batch_name' label='Batch Name' />
            <Controller
              name='batch_time'
              control={control}
              render={({ field }) => (
                <MobileTimePicker
                  orientation='portrait'
                  label='Batch Time'
                  value={field.value}
                  onChange={(newValue) => field.onChange(newValue)}
                  slotProps={{
                    textField: {
                      fullWidth: true,
                      margin: 'normal',
                    },
                  }}
                />
              )}
            />
            <RHFAutocomplete
              name='faculty'
              type='faculty'
              label='Facult Name'
              placeholder='Choose a faculty'
              fullWidth
              options={facultyName.map((option) => option)}
              getOptionLabel={(option) => `${option?.firstName} ${option?.lastName}`}
            />
            <RHFAutocomplete1
              name='batch_members'
              labelName='Batch Members'
              control={control}
              studentName={studentName}
            />
          </Stack>
        </Card>
        <Stack sx={{ my: '30px', alignItems: 'flex-end' }}>
          <Button type='submit' variant='contained' disabled={isSubmitting}>
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
}

BatchNewEditForm.propTypes = {
  batchId: PropTypes.string,
};
