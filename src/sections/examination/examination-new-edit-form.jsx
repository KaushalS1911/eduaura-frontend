import React, { useState, useEffect, useCallback, useMemo } from 'react';
import * as Yup from 'yup';
import PropTypes from 'prop-types';
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
import { useAuthContext } from 'src/auth/hooks';
import { useGetStudentsList } from 'src/api/student';
import RHFAutocomplete1 from 'src/components/hook-form/batch-autocomplete';
import { useGetFaculty } from 'src/api/faculty';
import { mutate } from 'swr';

// ----------------------------------------------------------------------

export default function ExaminationNewEditForm({ examinationId }) {
  const router = useRouter();
  const mdUp = useResponsive('up', 'md');
  const { enqueueSnackbar } = useSnackbar();
  const preview = useBoolean();
  const { user } = useAuthContext();

  const { faculty } = useGetFaculty();
  const { students } = useGetStudentsList(user?.company_id);
  const [studentName, setStudentName] = useState([]);
  const [facultyName, setFacultyName] = useState([]);
  const [exam, setExam] = useState([]);
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
    total_marks: Yup.string().required('Total marks is required'),
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

  useEffect(() => {
    const fetchExpenseById = async () => {
      try {
        if (examinationId) {
          const URL = `${import.meta.env.VITE_AUTH_API}/api/company/exam/${examinationId}`;
          const response = await axios.get(URL);
          setExam(response?.data?.data?.exam);
          const { exam } = response?.data?.data;
          const stu = exam.students.map((data) => data?.student_id);
          reset({
            title: exam?.title,
            total_marks: exam?.total_marks,
            desc: exam?.desc,
            conducted_by: exam?.conducted_by,
            students: stu,
            date: exam.date ? new Date(exam.date) : null,
            // amount: data.amount,
          });
        }
      } catch (error) {
        console.error('Failed to fetch examination:', error);
      }
    };
    fetchExpenseById();
  }, [examinationId, reset]);

  const onSubmit = handleSubmit(async (data) => {
    const payload = data.students.map((student) => {
      return {
        obtained_marks: null,
        student_id: student,
      };
    });
    // const payload = data.students.map((student) =>  student_id: student,);
    try {
      if (data) {
        const URL = `${import.meta.env.VITE_AUTH_API}/api/company/exam/${examinationId}`;
        await axios
          .put(URL, { ...data, students: payload })
          .then((res) => router.push(paths.dashboard.examination.list))
          .catch((err) => console.log(err));
        mutate()
      }
      preview.onFalse();
      enqueueSnackbar(examinationId ? 'Update success!' : 'Create success!');
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
            <RHFAutocomplete1
              labelName="Select student"
              name="students"
              control={control}
              studentName={studentName}
            />
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
    <FormProvider methods={methods} onSubmit={onSubmit}>
      <Grid container spacing={3}>
        {renderDetails}
      </Grid>
    </FormProvider>
  );
}

ExaminationNewEditForm.propTypes = {
  examinationId: PropTypes.string,
};
