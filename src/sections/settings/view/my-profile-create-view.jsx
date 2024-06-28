import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { TextField, Button, Grid, Box, Card, Typography } from '@mui/material';
import { useGetConfigs } from 'src/api/config';
import axios from 'axios';
import { useAuthContext } from 'src/auth/hooks';
import { useSnackbar } from 'src/components/snackbar';
import { Stack } from '@mui/system';
import { LoadingButton } from '@mui/lab';
import { RHFTextField, RHFUploadAvatar } from 'src/components/hook-form';
import FormProvider from 'src/components/hook-form/form-provider';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import { number } from 'prop-types';

export default function MyProfile() {
  const { user, initialize } = useAuthContext();
  console.log(user,"user");

  const { configs, mutate } = useGetConfigs();
  const { enqueueSnackbar } = useSnackbar();
  const [disable, setDisable] = useState(true);
  const defaultValues = useMemo(
    () => ({
      avatar_url: user?.avatar_url || '',
      firstName: user?.firstName || '',
      lastName: user?.lastName || '',
      email: user?.email || '',
      contact: user?.contact || '',
    }),
    [user],
  );

  const NewUserSchema = Yup.object().shape({
    firstName: Yup.string().required('First Name is required'),
    lastName: Yup.string().required('Last Name is required'),
    email: Yup.string().required('Email is required').email('Email must be a valid email address'),
    contact: Yup.string().required('Phone Number is required').min(10).max(10),
  });
  const methods = useForm({
    resolver: yupResolver(NewUserSchema),
    defaultValues,
  });

  const {
    setValue,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const handleDisable = (e) => {
      setDisable(false);
  };
  const onSubmit = async (data) => {
    const payload = {
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      contact: data.contact,
    };


    const URL = `${import.meta.env.VITE_AUTH_API}/api/users/${user?._id}`;

    try {
      const res = await axios.put(URL, payload);
      if (res.status === 200) {
        initialize();
        enqueueSnackbar('Personal details updated successfully', {
          variant: 'success',
        });
        mutate();
      }
    } catch (err) {
      console.error('Update error:', err);
      enqueueSnackbar(err.response?.data?.message || 'An error occurred', {
        variant: 'error',
      });
    }

  };

  const handleDrop = useCallback(
    (acceptedFiles) => {
      const file = acceptedFiles[0];
      if (!file) return;

      const newFile = Object.assign(file, {
        preview: URL.createObjectURL(file),
      });


      setValue('avatar_url', newFile.preview);

      const formData = new FormData();
      formData.append('profile-pic', file);

      axios.put(`${import.meta.env.VITE_AUTH_API}/api/users/${user?._id}/profile-pic`, formData)
        .then((res) => {
          enqueueSnackbar('Profile image updated successfully');
          initialize(); mutate();

        })
        .catch((err) => enqueueSnackbar('Something went wrong'));
    },
    [setValue, enqueueSnackbar, user?._id],
  );


  const formData = (
    <>
      <Grid item md={4} xs={12}>
        <Typography variant='h6' sx={{ mb: 0.5 }}>
          Personal Details
        </Typography>
        <Typography variant='body2' sx={{ color: 'text.secondary' }}>
          Personal info, profile pic, Name...
        </Typography>
        <Card sx={{ pt: 5, px: 3, mt: 5 }}>
          <Box sx={{ mb: 5 }}>
            <RHFUploadAvatar name='avatar_url' onDrop={handleDrop} />
          </Box>
        </Card>
      </Grid>
      <Grid item xs={12} md={8}>
        <Card>
          <Stack spacing={3} sx={{ p: 3 }}>
            <Box
              columnGap={2}
              rowGap={3}
              display='grid'
              gridTemplateColumns={{
                xs: 'repeat(1, 1fr)',
                md: 'repeat(2, 1fr)',
              }}
            >
              <RHFTextField label='First Name' name='firstName' onClick={handleDisable} />
              <RHFTextField label='Last Name' name='lastName' onClick={handleDisable} />
              <RHFTextField label='Email' name='email' onClick={handleDisable} />
              <RHFTextField label='Contact' name='contact' onClick={handleDisable} />
            </Box>
            <Grid item display={'flex'} justifyContent='end'>
              <Stack>
                <LoadingButton type='submit' variant='contained' disabled={disable} loading={isSubmitting}>
                  Submit
                </LoadingButton>
              </Stack>
            </Grid>
          </Stack>
        </Card>
      </Grid>
    </>
  );

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Grid container spacing={5}>
        {formData}
      </Grid>
    </FormProvider>
  );
}
