import React, { useState, useCallback, useEffect } from 'react';
import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import axios from 'axios';
import { useForm } from 'react-hook-form';
import { useSnackbar } from 'src/components/snackbar';
import { useAuthContext } from 'src/auth/hooks';
import { Card, CardHeader, Typography, Stack, Grid } from '@mui/material';
import LoadingButton from '@mui/lab/LoadingButton';
import { useResponsive } from 'src/hooks/use-responsive';
import FormProvider, { RHFUploadAvatar, RHFTextField } from 'src/components/hook-form';
import { Box } from '@mui/system';

export default function ProfileEditForm() {
  const { user } = useAuthContext();
  console.log(user);
  const [profilePic, setProfilePic] = useState('');
  const { enqueueSnackbar } = useSnackbar();
  const mdUp = useResponsive('up', 'md');
  const NewEmployeeSchema = Yup.object().shape({
    firstName: Yup.string().required('First name is required'),
    lastName: Yup.string().required('Last name is required'),
    contact: Yup.string().required('Phone number is required'),
    email: Yup.string().required('Email is required').email('Email must be a valid email address'),
  });
  const methods = useForm({
    resolver: yupResolver(NewEmployeeSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      contact: '',
      email: '',
      avatar_url: null,
    },
  });
  const {
    reset,
    handleSubmit,
    control,
    setValue,
    formState: { isSubmitting },
  } = methods;
  useEffect(() => {
    reset({
      firstName: user.firstName,
      lastName: user.lastName,
      contact: user.contact,
      email: user.email,
      avatar_url: user.avatar_url || '',
    });
  }, []);
  const onSubmit = async (data) => {
    const addemployee = {
      firstName: data.firstName,
      lastName: data.lastName,
      contact: data.contact,
      email: data.email,
    };
    console.log(addemployee);
    try {
      const URL = `${import.meta.env.VITE_AUTH_API}/api/users/${user?._id}`;
      const response = await axios.put(URL, addemployee);
      console.log(response);
    } catch (error) {
      enqueueSnackbar('Failed to add Admin', { variant: 'error' });
    }
  };
  const handleDrop = useCallback(
    async (acceptedFiles) => {
      const file = acceptedFiles[0];
      const formData = new FormData();
      formData.append('profile-pic', file);
      try {
        const URL = `${import.meta.env.VITE_AUTH_API}/api/users/${user?._id}/profile-pic`;
        const response = await axios.put(formData);
        console.log(response.data);
      } catch (error) {
        console.error('Error uploading profile picture:', error);
      }
    },
    [user]
  );
  const renderProperties = (
    <>
      {mdUp && (
        <Grid item md={4}>
          <Typography variant="h6" sx={{ mb: 0.5 }}>
            Personal Details
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            Basic info, profile pic, Conatct, email...
          </Typography>
          <Card sx={{ pt: 5, px: 3, mt: 5 }}>
            <Box sx={{ mb: 5 }}>
              <RHFUploadAvatar name="profile-pic" onDrop={handleDrop} />
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
                md: 'repeat(1, 1fr)',
              }}
            >
              <RHFTextField name="firstName" label="First Name" />
              <RHFTextField name="lastName" label="Last Name" />
              <RHFTextField name="email" label="Email Address" />
              <RHFTextField name="contact" label="Phone Number" />
            </Box>
          </Stack>
        </Card>
      </Grid>
    </>
  );
  const renderActions = (
    <>
      {mdUp && <Grid item md={4} />}
      <Grid item xs={12} md={8} sx={{ display: 'flex', justifyContent: 'end' }}>
        <LoadingButton type="submit" variant="contained" size="large" loading={isSubmitting}>
          Save Changes
        </LoadingButton>
      </Grid>
    </>
  );
  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Grid container spacing={4}>
        <Grid item xs={12} md={12} />
        {renderProperties}
        <Grid item xs={12} md={12} />
        {renderActions}
      </Grid>
    </FormProvider>
  );
}
