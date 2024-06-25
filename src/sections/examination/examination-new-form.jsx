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
import { paths } from 'src/routes/paths';
import moment from 'moment';
import { useAuthContext } from 'src/auth/hooks';
import RHFAutocomplete1 from 'src/components/hook-form/batch-autocomplete';
import { useGetStudentsList } from 'src/api/student';
import { useGetFaculty } from 'src/api/faculty';

const types = [
  'Rent',
  'Electricity Bill',
  'Salary',
  'Stationary',
  'Maintenance',
  'New Asset Purchase',
  'Office Expense',
];

const ExaminationNewForm = () => {
  const router = useRouter();
  const mdUp = useResponsive('up', 'md');
  const { enqueueSnackbar } = useSnackbar();
  const preview = useBoolean();
  const { user } = useAuthContext();
  const { faculty } = useGetFaculty();
  const { students } = useGetStudentsList(user?.company_id);
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
    title: Yup.string().required('Title is required'),
    desc: Yup.string().required('Description is required'),
    date: Yup.date().required('Date is required'),
    total_marks: Yup.number().required('Total marks is required'),
  });

  const methods = useForm({
    resolver: yupResolver(NewBlogSchema),
    defaultValues: {
      title: '',
      desc: '',
      date: null,
      total_marks: '',
      conducted_by: null,
      students: [],
    },
  });

  const {
    reset,
    setValue,
    handleSubmit,
    control,
    formState: { isSubmitting },
  } = methods;
  const onSubmit = handleSubmit(async (data) => {
    const studentId = [];
    data?.students.map((member) => studentId.push({ student_id: member._id }));
    console.log({
      ...data,
      students: studentId,
      conducted_by: data?.conducted_by?._id,
      company_id: user?.company_id,
    },"payload");
    try {

      const URL = `${import.meta.env.VITE_AUTH_API}/api/company/exam`;
      await axios
        .post(URL, { ...data, students: studentId, conducted_by :data?.conducted_by?._id,company_id:user?.company_id})
        .then((res) => {
          enqueueSnackbar('Create success!');
        })
        .catch((err) => console.log(err));
        
        router.push(paths.dashboard.examination.list);
      preview.onFalse();
    } catch (error) {
      console.error(error);
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
            Title, short description, Date...
          </Typography>
        </Grid>
      )}

      <Grid xs={12} md={8}>
        <Card>
          {!mdUp && <CardHeader title="Details" />}

          <Stack spacing={3} sx={{ p: 3 }}>
           
            <RHFTextField name="title" label="Title" />
            <RHFTextField name="total_marks" label="Total Marks" />
          
            <Stack spacing={1.5}>
              <Controller
                name="date"
                control={control}
                render={({ field, fieldState: { error } }) => (
                  <DatePicker
                    {...field}
                    value={field.value}
                    onChange={(newDate) => {
                      setValue('date', newDate);
                      field.onChange(newDate);
                    }}
                    format="dd/MM/yyyy"
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
              name="conducted_by"
              type="faculty"
              label="Facult Name"
              placeholder="Choose a faculty"
              fullWidth
              options={facultyName.map((option) => option)}
              getOptionLabel={(option) => `${option?.firstName} ${option?.lastName}`}
            />
            <RHFAutocomplete1 name="students" control={control} studentName={studentName} labelName="Select students"/>
            <RHFTextField name="desc" label="Description" multiline rows={3} />
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
