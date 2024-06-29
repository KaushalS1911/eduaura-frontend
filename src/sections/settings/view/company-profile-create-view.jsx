import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { TextField, Button, Grid, Box, Card, Typography, CardHeader, Autocomplete } from '@mui/material';
import { useGetConfigs } from 'src/api/config';
import axios from 'axios';
import { useAuthContext } from 'src/auth/hooks';
import { useSnackbar } from 'src/components/snackbar';
import { Stack } from '@mui/system';
import { LoadingButton } from '@mui/lab';
import { RHFAutocomplete, RHFTextField, RHFUploadAvatar } from 'src/components/hook-form';
import FormProvider from 'src/components/hook-form/form-provider';
import { Controller, useForm } from 'react-hook-form';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import countrystatecity from '../../../_mock/map/csc.json';
import { useResponsive } from '../../../hooks/use-responsive';

export default function CompanyProfile() {
  const { user } = useAuthContext();
  const [profilePic, setProfilePic] = useState(null);
  const { configs, mutate } = useGetConfigs();
  const { enqueueSnackbar } = useSnackbar();
  const mdUp = useResponsive('up', 'md');
  const [loading, setLoading] = useState(false);

  // useEffect(() => {
  //   if (configs && configs.company_details) {
  //     setValues((prevValues) => ({
  //       ...prevValues,
  //       name: configs.company_details.name || '',
  //     }));
  //   }
  // }, [configs]);

  const defaultValues = useMemo(
    () => ({
      logo_url: configs?.company_details?.logo || '',
      name: configs?.company_details?.name || '',
      email: configs?.company_details?.email || '',
      contact: configs?.company_details?.contact || '',
      address_1: configs?.company_details?.address_1 || '',
      country: configs?.company_details?.country || '',
      state: configs?.company_details?.state || '',
      city: configs?.company_details?.city || '',
      zipcode: configs?.company_details?.zipcode || '',
    }),
    [configs],
  );

  const methods = useForm({
    defaultValues,
  });

  const {
    reset,
    watch,
    control,
    setValue,
    handleSubmit,
    formState: { isSubmitting },
  } = methods
  const onSubmit = async (data) => {
    console.log(data, ': submitted data');

    setLoading(true);
    const URL = `${import.meta.env.VITE_AUTH_API}/api/company/${user?.company_id}/configs/${configs._id}`;
    const payload = { ...configs, company_details: { ...configs.company_details, ...data } };
    console.log(payload);
    try {
      const res = await axios.put(URL, payload);
      if (res.status === 200) {
        enqueueSnackbar('Company details updated successfully', {
          variant: 'success',
        });
        mutate();
      }
    } catch (err) {
      console.error('Update error:', err);
      enqueueSnackbar(err.response?.data?.message || 'An error occurred', {
        variant: 'error',
      });
    } finally {
      setLoading(false);
    }

    if (profilePic) {
      const apiEndpoint = `${import.meta.env.VITE_AUTH_API}/api/company/${user?.company_id}/company-logo`;
      const formData = new FormData();
      formData.append('logo_url', profilePic, profilePic.name);

      try {
        const response = await axios.put(apiEndpoint, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
          mutate();
      } catch (error) {
        console.error('Upload error:', error);
      }
    }
  };

  const handleDrop = useCallback(
    (acceptedFiles) => {
      const file = acceptedFiles[0];

      const newFile = Object.assign(file, {
        preview: URL.createObjectURL(file),
      });

      if (file) {
        setProfilePic(file);
        setValue('logo_url', newFile, { shouldValidate: true });
      }
    },
    [setValue],
  );


  const renderProperties = (
    <>
      <Grid item md={4} xs={12}>
        <Typography variant='h6' sx={{ mb: 0.5 }}>
          Personal Details
        </Typography>
        <Typography variant='body2' sx={{ color: 'text.secondary' }}>
          Basic info, profile pic, role, qualification...
        </Typography>

        <Card sx={{ pt: 5, px: 3, mt: 5 }}>
          <Box sx={{ mb: 5 }}>
            <RHFUploadAvatar name='logo_url' onDrop={handleDrop} />
          </Box>
        </Card>
      </Grid>

      <Grid item sx={{ my: 'auto' }} xs={12} md={8}>
        <Card>
          {!mdUp && <CardHeader title='Personal Details' />}

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
              <RHFTextField name='name' label='Company Name' />
              <RHFTextField name='email' label='Email Address' />
              <RHFTextField name='contact' label='Phone Number' />
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
          <Typography variant='h6' sx={{ mb: 0.5 }}>
            Address Details
          </Typography>
          <Typography variant='body2' sx={{ color: 'text.secondary' }}>
            Address info, country, state, city...
          </Typography>
        </Grid>
      )}

      <Grid item xs={12} md={8}>
        <Card>
          {!mdUp && <CardHeader title='Address Details' />}

          <Stack spacing={3} sx={{ p: 3 }}>
            <RHFTextField name='address_1' label='Address line 1' />

            <Box
              columnGap={2}
              rowGap={3}
              display='grid'
              gridTemplateColumns={{
                xs: 'repeat(1, 1fr)',
                md: 'repeat(2, 1fr)',
              }}
            >
              <Controller
                name='country'
                control={control}
                render={({ field, fieldState: { error } }) => (
                  <Autocomplete
                    {...field}
                    options={countrystatecity.map((country) => country.name)}
                    onChange={(event, value) => field.onChange(value)}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label='Country'
                        variant='outlined'
                        error={!!error}
                        helperText={error?.message}
                      />
                    )}
                  />
                )}
              />
              <Controller
                name='state'
                control={control}
                render={({ field, fieldState: { error } }) => (
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
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label='State'
                        variant='outlined'
                        error={!!error}
                        helperText={error?.message}
                      />
                    )}
                  />
                )}
              />

              <Controller
                name='city'
                control={control}
                render={({ field, fieldState: { error } }) => (
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
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label='City'
                        variant='outlined'
                        error={!!error}
                        helperText={error?.message}
                      />
                    )}
                  />
                )}
              />
              <RHFTextField name='zipcode' label='Zip code' />
            </Box>
          </Stack>
        </Card>
      </Grid>
    </>
  );

  return (
    <>
      <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
        <Grid container spacing={3}>
          {renderProperties}
          {renderAddress}
        </Grid>
        <Box sx={{ display: 'flex', justifyContent: 'end', mt: '20px' }}>
          <LoadingButton type='submit' variant='contained' loading={loading}>
            Save Changes
          </LoadingButton>
        </Box>
      </FormProvider>
    </>
  );
}
  // <Box
  //   sx={{
  //     width: '100%',
  //     marginBottom: '10px',
  //     padding: '10px',
  //   }}
  // >
  //   <Grid container spacing={3}>
  //     <Grid item md={4} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
  //       <Box>
  //         <Typography variant="h6" sx={{ mb: 0.5 }}>
  //           Company Details
  //         </Typography>
  //         <Typography variant="body2" sx={{ color: 'text.secondary' }}>
  //           Company name, Logo...
  //         </Typography>
  //       </Box>
  //     </Grid>
  //     <Grid
  //       item
  //       xs={12}
  //       md={8}
  //       sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}
  //     >
  //       <Grid item xs={12} md={8}>
  //         <Card>
  //           <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
  //             <Stack spacing={3} sx={{ p: 3 }}>
  //               <Box sx={{ mb: 5 }}>
  //                 <RHFUploadAvatar
  //                   sx={{
  //                     height: '250px',
  //                     width: '250px',
  //                     '& > svg': { borderRadius: '0px !important' },
  //                   }}
  //                   name="logo_url"
  //                   onDrop={handleDrop}
  //                 />
  //               </Box>
  //
  //               <RHFTextField label="Company Name" name="name" />
  //               <Box sx={{ display: 'flex', justifyContent: 'end', mt: '20px' }}>
  //                 <LoadingButton type="submit" variant="contained" loading={loading}>
  //                   Save Changes
  //                 </LoadingButton>
  //               </Box>
  //             </Stack>
  //           </FormProvider>
  //         </Card>
  //       </Grid>
  //     </Grid>
  //   </Grid>
  // </Box>




