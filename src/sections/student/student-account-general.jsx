import React, { useCallback, useEffect, useState } from 'react';
import * as Yup from 'yup';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import axios from 'axios';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Grid from '@mui/material/Grid';
import LoadingButton from '@mui/lab/LoadingButton';
import { DatePicker } from '@mui/x-date-pickers';
import { Autocomplete, CardHeader, TextField, Typography } from '@mui/material';
import { useSnackbar } from 'notistack';
import { useAuthContext } from 'src/auth/hooks';
import { useResponsive } from 'src/hooks/use-responsive';
import { useRouter } from 'src/routes/hooks';
import { paths } from 'src/routes/paths';
import FormProvider, {
  RHFTextField,
  RHFUploadAvatar,
  RHFAutocomplete,
} from 'src/components/hook-form';
import { STUDENT_GENDER, courses } from 'src/_mock/_student';
import countrystatecity from '../../_mock/map/csc.json';

export default function StudentAccountGeneral({ id }) {
  const { user } = useAuthContext();
  const router = useRouter();
  const [profilePic, setProfilePic] = useState(null);
  const { enqueueSnackbar } = useSnackbar();
  const mdUp = useResponsive('up', 'md');

  const UpdateUserSchema = Yup.object().shape({
    firstName: Yup.string().required('First Name is required'),
    lastName: Yup.string().required('Last Name is required'),
    email: Yup.string().required('Email is required').email('Email must be a valid email address'),
    contact: Yup.string().required('Phone number is required'),
    gender: Yup.string().required('Gender is required'),
    dob: Yup.date().required('Date of Birth is required'),
    joining_date: Yup.date().required('Joining Date is required'),
    education: Yup.string().required('Education is required'),
    school_college: Yup.string().required('School/College is required'),
    course: Yup.string().required('Course is required'),
    blood_group: Yup.string().required('Blood Group is required'),
  });

  const methods = useForm({
    resolver: yupResolver(UpdateUserSchema),
    defaultValues: {
      profile_pic: null,
      firstName: '',
      lastName: '',
      contact: '',
      email: '',
      gender: '',
      course: '',
      education: '',
      school_college: '',
      dob: null,
      joining_date: null,
      blood_group: '',
      address_1: '',
      address_2: '',
      country: '',
      state: '',
      city: '',
      zipcode: '',
      enrollment_no: 0,
      total_amount: 0,
      amount_paid: 0,
      discount: 0,
    },
  });

  const {
    setValue,
    watch,
    reset,
    control,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  useEffect(() => {
    const fetchSingleStudent = async () => {
      try {
        if (id) {
          const URL = `${import.meta.env.VITE_AUTH_API}/api/v2/student/${id}`;
          const response = await axios.get(URL);
          const { student } = response?.data;
          console.log('get', student);
          reset({
            firstName: student.firstName,
            lastName: student.lastName,
            contact: student.contact,
            email: student.email,
            gender: student.gender,
            course: student.course,
            education: student.education,
            school_college: student.school_college,
            dob: student.dob ? new Date(student.dob) : null,
            joining_date: student.joining_date ? new Date(student.joining_date) : null,
            blood_group: student.blood_group,
            address_1: student.address_detail.address_1,
            address_2: student.address_detail.address_2,
            country: student.address_detail.country,
            state: student.address_detail.state,
            city: student.address_detail.city,
            zipcode: student.address_detail.zipcode,
            enrollment_no: Number(student.enrollment_no),
            total_amount: Number(student.fee_detail.total_amount),
            amount_paid: Number(student.fee_detail.amount_paid),
            discount: Number(student.fee_detail.discount),
          });
          setProfilePic(student.profile_pic)
        }
      } catch (err) {
        console.log('ERROR : ', err);
      }
    };
    fetchSingleStudent();
  }, [id, reset]);

  const postStudent = async (addStudent) => {
    try {
      const formData = new FormData();
      Object.keys(addStudent).forEach((key) => {
        formData.append(key, addStudent[key]);
      });

      if (profilePic) {
        formData.append('profile-pic', profilePic);
      }

      const response = await axios.post(
        `${import.meta.env.VITE_AUTH_API}/api/v2/${user.company_id}/student`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      return response.data;
    } catch (error) {
      throw new Error('Update failed. Please try again.');
    }
  };
  const updateStudent = async (addStudent) => {
    try {
      const formData = new FormData();
      Object.keys(addStudent).forEach((key) => {
        formData.append(key, addStudent[key]);
      });

      if (profilePic) {
        formData.append('profile-pic', profilePic);
      }

      const response = await axios.put(
        `${import.meta.env.VITE_AUTH_API}/api/v2/student/${id}`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      return response.data;
    } catch (error) {
      throw new Error('Update failed. Please try again.');
    }
  };

  const onSubmit = async (data) => {
    const addStudent = {
      firstName: data.firstName,
      lastName: data.lastName,
      contact: data.contact,
      email: data.email,
      gender: data.gender,
      course: data.course,
      education: data.education,
      school_college: data.school_college,
      dob: data.dob,
      joining_date: data.joining_date,
      blood_group: data.blood_group,
      address_1: data.address_1,
      address_2: data.address_2,
      country: data.country,
      state: data.state,
      city: data.city,
      zipcode: data.zipcode,
      enrollment_no: Number(data.enrollment_no),
      total_amount: Number(data.total_amount),
      amount_paid: Number(data.amount_paid),
      discount: Number(data.discount),
    };

    try {
      if (id) {
        const response = await updateStudent(addStudent);
        enqueueSnackbar(response.message, { variant: 'success' });
        reset();
      }
      else {
        const response = await postStudent(addStudent);
        enqueueSnackbar(response.message, { variant: 'success' });
        reset();
      }
      router.push(paths.dashboard.student.list);
    } catch (error) {
      console.error(error);
    }
  }

  const handleDrop = useCallback(
    (acceptedFiles) => {
      const file = acceptedFiles[0];

      const newFile = Object.assign(file, {
        preview: URL.createObjectURL(file),
      });

      if (file) {
        setValue('photoURL', newFile, { shouldValidate: true });
      }
    },
    [setValue]
  );

  const uploadStudentImage = (
    <>
      {mdUp && (
        <Grid item md={4}>
          <Typography variant="h6" sx={{ mb: 0.5 }}>
            Personal Details
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            Basic info, profile pic, Name, Course, Enrollment no...
          </Typography>

          <Card sx={{ pt: 5, px: 3, mt: 5 }}>
            <Box sx={{ mb: 5 }}>
              <RHFUploadAvatar name="profile_pic" onDrop={handleDrop} />
            </Box>
          </Card>
        </Grid>
      )}

      <Grid item xs={12} md={8}>
        <Card>
          {!mdUp && <CardHeader title="Personal Details" />}

          <Stack spacing={3} sx={{ p: 3 }}>
            <Box
              columnGap={2}
              rowGap={3}
              display="grid"
              gridTemplateColumns={{
                xs: 'repeat(1, 1fr)',
                md: 'repeat(2, 1fr)',
              }}
            >
              <RHFTextField name="firstName" label="First Name" />
              <RHFTextField name="lastName" label="Last Name" />
              <RHFTextField name="email" label="Email Address" />
              <RHFTextField name="contact" label="Phone Number" />
              <RHFAutocomplete
                name="gender"
                label="Gender"
                placeholder="Choose a gender"
                options={STUDENT_GENDER}
                getOptionLabel={(option) => option}
                isOptionEqualToValue={(option, value) => option === value}
              />
              <Stack spacing={1.5}>
                <Controller
                  name="dob"
                  control={control}
                  render={({ field, fieldState: { error } }) => (
                    <DatePicker
                      {...field}
                      label="Date of Birth"
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          fullWidth
                          error={!!error}
                          helperText={error ? error.message : ''}
                        />
                      )}
                    />
                  )}
                />
              </Stack>
              <RHFTextField name="education" label="Education" />
              <RHFTextField name="school_college" label="School/College" />
              <RHFAutocomplete
                name="course"
                label="Course"
                placeholder="Choose a course"
                options={courses.map((course) => course.label)}
                isOptionEqualToValue={(option, value) => option === value}
              />
              <Stack spacing={1.5}>
                <Controller
                  name="joining_date"
                  control={control}
                  render={({ field, fieldState: { error } }) => (
                    <DatePicker
                      {...field}
                      label="Joining Date"
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          fullWidth
                          error={!!error}
                          helperText={error ? error.message : ''}
                        />
                      )}
                    />
                  )}
                />
              </Stack>
              <RHFTextField name="blood_group" label="Blood Group" />
              <RHFTextField name="enrollment_no" label="Enrollment No" />
            </Box>
          </Stack>
        </Card>
      </Grid>
    </>
  );

  const renderAddress = (
    <>
      {mdUp && (
        <Grid item md={4}>
          <Typography variant="h6" sx={{ mb: 0.5 }}>
            Address Details
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            Address info, country, state, city...
          </Typography>
        </Grid>
      )}

      <Grid item xs={12} md={8}>
        <Card>
          {!mdUp && <CardHeader title="Address Details" />}
          <Stack spacing={3} sx={{ p: 3, mt: 4 }}>
            <Box
              rowGap={3}
              columnGap={2}
              display="grid"
              gridTemplateColumns={{
                xs: 'repeat(1, 1fr)',
                sm: 'repeat(2, 1fr)',
              }}
            >
              <RHFTextField name="address_1" label="Address 1" />
              <RHFTextField name="address_2" label="Address 2" />
              <Controller
                name="country"
                control={control}
                render={({ field }) => (
                  <Autocomplete
                    {...field}
                    options={countrystatecity.map((country) => country.name)}
                    onChange={(event, value) => field.onChange(value)}
                    isOptionEqualToValue={(option, value) => option === value}
                    renderInput={(params) => (
                      <TextField {...params} label="Country" variant="outlined" />
                    )}
                  />
                )}
              />
              <Controller
                name="state"
                control={control}
                render={({ field }) => (
                  <Autocomplete
                    {...field}
                    options={
                      watch('country')
                        ? countrystatecity
                            .find((country) => country.name === watch('country'))
                            ?.states.map((state) => state.name) || []
                        : []
                    }
                    onChange={(event, value) => field.onChange(value)}
                    isOptionEqualToValue={(option, value) => option === value}
                    renderInput={(params) => (
                      <TextField {...params} label="State" variant="outlined" />
                    )}
                  />
                )}
              />
              <Controller
                name="city"
                control={control}
                render={({ field }) => (
                  <Autocomplete
                    {...field}
                    options={
                      watch('state')
                        ? countrystatecity
                            .find((country) => country.name === watch('country'))
                            ?.states.find((state) => state.name === watch('state'))
                            ?.cities.map((city) => city.name) || []
                        : []
                    }
                    onChange={(event, value) => field.onChange(value)}
                    isOptionEqualToValue={(option, value) => option === value}
                    renderInput={(params) => (
                      <TextField {...params} label="City" variant="outlined" />
                    )}
                  />
                )}
              />
              <RHFTextField name="zipcode" label="Zip Code" />
            </Box>
          </Stack>
        </Card>
      </Grid>
    </>
  );

  const FeesDetails = (
    <>
      {mdUp && (
        <Grid item md={4}>
          <Typography variant="h6" sx={{ mb: 0.5 }}>
            Fees Details
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            Fees Total Amount, Amount Paid, Discount...
          </Typography>
        </Grid>
      )}

      <Grid item xs={12} md={8}>
        <Card>
          {!mdUp && <CardHeader title="Fees Details" />}
          <Stack spacing={3} sx={{ p: 3 }}>
            <Box
              columnGap={2}
              rowGap={3}
              display="grid"
              gridTemplateColumns={{
                xs: 'repeat(1, 1fr)',
                md: 'repeat(2, 1fr)',
              }}
            >
              <RHFTextField name="total_amount" label="Total Amount" />
              <RHFTextField name="amount_paid" label="Amount Paid" />
              <RHFTextField name="discount" label="Discount" />
            </Box>
          </Stack>
        </Card>
      </Grid>
    </>
  );

  const renderAction = (
    <>
      {mdUp && <Grid item md={4} />}
      <Grid item xs={12} md={8} sx={{ display: 'flex', justifyContent: 'end' }}>
        <LoadingButton type="submit" variant="contained" size="large" loading={isSubmitting}>
          {id ? "Update Student" : "Add Student"}
        </LoadingButton>
      </Grid>
    </>
  );

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Grid container spacing={3}>
        {uploadStudentImage}
        {renderAddress}
        {FeesDetails}
        {renderAction}
      </Grid>
    </FormProvider>
  );
}
