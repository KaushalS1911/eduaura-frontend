import { useEffect, useState } from 'react';
import * as Yup from 'yup';
import PropTypes from 'prop-types';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Grid from '@mui/material/Grid';
import LoadingButton from '@mui/lab/LoadingButton';
import { Autocomplete, CardHeader, TextField, Typography } from '@mui/material';
import { useSnackbar } from 'src/components/snackbar';
import FormProvider, {
  RHFMultiSelect,
  RHFRadioGroup,
  RHFTextField,
} from 'src/components/hook-form';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import axios from 'axios';
import { paths } from 'src/routes/paths';
import { useResponsive } from 'src/hooks/use-responsive';
import { useRouter } from 'src/routes/hooks';
import {
  INQUIRY_INTERESTED_IN,
  INQUIRY_REFERENCE_BY,
  INQUIRY_SUGGESTED_IN,
} from 'src/_mock/_inquiry';
import { Box } from '@mui/system';
import { useAuthContext } from 'src/auth/hooks';
import countrystatecity from '../../_mock/map/csc.json';
import { useGetConfigs } from 'src/api/config';

export default function InquiryNewEditForm({ inquiryId }) {
  const { user } = useAuthContext();
  const mdUp = useResponsive('up', 'md');
  const { enqueueSnackbar } = useSnackbar();
  const router = useRouter();
  const [radio, setRadio] = useState('');
  const { configs } = useGetConfigs();

  const NewUserSchema = Yup.object().shape({
    firstName: Yup.string().required('First name is required'),
    lastName: Yup.string().required('Last name is required'),
    contact: Yup.string().required('Phone number is required').max(10).min(10),
  });

  const methods = useForm({
    resolver: yupResolver(NewUserSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      contact: '',
      dob: null,
      occupation: '',
      email: '',
      education: '',
      address: {
        address_line1: '',
        address_line2: '',
        country: '',
        state: '',
        city: '',
        zip_code: '',
      },
      fatherName: '',
      father_contact: '',
      father_occupation: '',
      reference_by: '',
      other_reference_by: '',
      interested_in: [],
      suggested_by: '',
      remark: '',
      status: '',
    },
  });


  const {
    reset,
    handleSubmit,
    control,
    watch,
    getValues,
    formState: { isSubmitting },
  } = methods;
  const handleRadio = (e) => {
    setRadio(e.target.value === 'Other');
  };
  useEffect(() => {
    const fetchInquiryById = async () => {
      try {
        if (inquiryId) {
          const URL = `${import.meta.env.VITE_AUTH_API}/api/company/inquiry/${inquiryId}`;
          const response = await axios.get(URL);
          const { data } = response.data;
          const condition = INQUIRY_REFERENCE_BY.find((item) => item.label == data.reference_by)
            ? data.reference_by
            : 'Other';

          reset({
            firstName: data.firstName,
            lastName: data.lastName,
            contact: data.contact,
            dob: data.dob ? new Date(data.dob) : null,
            occupation: data.occupation,
            email: data.email,
            education: data.education,
            address: {
              address_line1: data.address.address_line1,
              address_line2: data.address.address_line2,
              country: data.address.country,
              state: data.address.state,
              city: data.address.city,
              zip_code: data.address.zip_code,
            },
            fatherName: data.fatherName,
            father_contact: data.father_contact,
            father_occupation: data.father_occupation,
            reference_by: condition,
            other_reference_by: data.reference_by,
            interested_in: data.interested_in,
            suggested_by: data.suggested_by,
            remark: data.remark || '',
            status: data.status || '',
          });

          if (condition == 'Other') {
            setRadio(true);
          }
        }
      } catch (error) {
        console.error('Failed to fetch inquiry:', error);
      }
    };

    fetchInquiryById();
  }, [inquiryId, reset]);

  const postInquiry = async (newInquiry) => {
    const URL = `${import.meta.env.VITE_AUTH_API}/api/company/${user?.company_id}/inquiry`;
    const response = await axios.post(URL, newInquiry);
    return response.data;
  };

  const updateInquiry = async (addInquiry) => {
    try {
      const URL = `${import.meta.env.VITE_AUTH_API}/api/company/inquiry/${inquiryId}`;
      const response = await axios.put(URL, addInquiry);
      return response.data;
    } catch (error) {
      console.error('Error updating inquiry:', error.message);
      throw error;
    }
  };

  const onSubmit = handleSubmit(async (data) => {
    const addInquiry = {
      firstName: (data.firstName || '').toUpperCase(),
      lastName: (data.lastName || '').toUpperCase(),
      contact: data.contact,
      dob: data.dob,
      occupation: data.occupation,
      email: data.email,
      education: data.education,
      address: {
        address_line1: data.address.address_line1,
        address_line2: data.address.address_line2,
        country: data.address.country,
        state: data.address.state,
        city: data.address.city,
        zip_code: data.address.zip_code,
      },
      fatherName: data.fatherName,
      father_contact: data.father_contact,
      father_occupation: data.father_occupation,
      reference_by: data.reference_by === 'Other' ? data.other_reference_by : data.reference_by,
      interested_in: data.interested_in,
      suggested_by: data.suggested_by,
      remark: data.remark,
      status: data.status,
    };
    try {
      let response;

      if (inquiryId) {
        response = await updateInquiry(addInquiry);
        console.log('update', response);
      } else {
        response = await postInquiry(addInquiry);
      }
      enqueueSnackbar(inquiryId ? response.message : response.message, { variant: 'success' });
      router.push(paths.dashboard.inquiry.list);
    } catch (error) {
      console.error(error);
      enqueueSnackbar(error.response.data.message, { variant: 'error' });
    }
  });

  const personalDetails = (
    <>
      {mdUp && (
        <Grid item md={4}>
          <Typography variant='h6' sx={{ mb: 0.5 }}>
            Personal Details
          </Typography>
          <Typography variant='body2' sx={{ color: 'text.secondary' }}>
            Basic info, role, Occupation...
          </Typography>
        </Grid>
      )}
      <Grid item xs={12} md={8}>
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
              <RHFTextField
                name='firstName'
                label='First Name'
                onInput={(e) => {
                  e.target.value = e.target.value.toUpperCase();
                }}
              />
              <RHFTextField
                name='lastName'
                label='Last Name'
                onInput={(e) => {
                  e.target.value = e.target.value.toUpperCase();
                }}
              />
              <RHFTextField name='email' label='Email Address' />
              <RHFTextField
                name='contact'
                label='Contact'
                inputProps={{ inputMode: 'numeric', pattern: '[0-9]*', maxLength: 10 }}
                onInput={(e) => {
                  e.target.value = e.target.value.replace(/[^0-9]/g, '');
                }}
              />
              <RHFTextField name='occupation' label='Occupation' />
              <RHFTextField name='education' label='Education' />
              <Stack spacing={1.5}>
                <Controller
                  name='dob'
                  control={control}
                  render={({ field, fieldState: { error } }) => (
                    <DatePicker
                      {...field}
                      label='Date of Birth'
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
            </Box>
          </Stack>
        </Card>
      </Grid>
    </>
  );

  const addressDetails = (
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
            <Box
              columnGap={2}
              rowGap={3}
              display='grid'
              gridTemplateColumns={{
                xs: 'repeat(1, 1fr)',
                md: 'repeat(2, 1fr)',
              }}
            >
              <RHFTextField name='address.address_line1' label='Address 1' />
              <RHFTextField name='address.address_line2' label='Address 2' />
              <Controller
                name='address.country'
                control={control}
                render={({ field }) => (
                  <Autocomplete
                    {...field}
                    options={countrystatecity.map((country) => country.name)}
                    onChange={(event, value) => field.onChange(value)}
                    renderInput={(params) => (
                      <TextField {...params} label='Country' variant='outlined' />
                    )}
                  />
                )}
              />
              <Controller
                name='address.state'
                control={control}
                render={({ field }) => (
                  <Autocomplete
                    {...field}
                    options={
                      watch('address.country')
                        ? countrystatecity
                        .find((country) => country.name === watch('address.country'))
                        ?.states.map((state) => state.name) || []
                        : []
                    }
                    onChange={(event, value) => field.onChange(value)}
                    renderInput={(params) => (
                      <TextField {...params} label='State' variant='outlined' />
                    )}
                  />
                )}
              />
              <Controller
                name='address.city'
                control={control}
                render={({ field }) => (
                  <Autocomplete
                    {...field}
                    options={
                      watch('address.state')
                        ? countrystatecity
                        .find((country) => country.name === watch('address.country'))
                        ?.states.find((state) => state.name === watch('address.state'))
                        ?.cities.map((city) => city.name) || []
                        : []
                    }
                    onChange={(event, value) => field.onChange(value)}
                    renderInput={(params) => (
                      <TextField {...params} label='City' variant='outlined' />
                    )}
                  />
                )}
              />
              <RHFTextField name='address.zip_code' label='Zip Code'
                            inputProps={{ inputMode: 'numeric', pattern: '[0-9]*', maxLength: 6 }}
                            onInput={(e) => {
                              e.target.value = e.target.value.replace(/[^0-9]/g, '');
                            }} />
            </Box>
          </Stack>
        </Card>
      </Grid>
    </>
  );

  const fatherDetails = (
    <>
      {mdUp && (
        <Grid item md={4}>
          <Typography variant='h6' sx={{ mb: 0.5 }}>
            Father Details
          </Typography>
          <Typography variant='body2' sx={{ color: 'text.secondary' }}>
            Father info, Contact, Occupation...
          </Typography>
        </Grid>
      )}
      <Grid item xs={12} md={8}>
        <Card>
          {!mdUp && <CardHeader title='Father Details' />}
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
              <RHFTextField name='fatherName' label='Father Name'
                            onInput={(e) => {
                              e.target.value = e.target.value.toUpperCase();
                            }} />
              <RHFTextField
                name='father_contact'
                label='Father Phone Number'
                inputProps={{ inputMode: 'numeric', pattern: '[0-9]*', maxLength: 10 }}
                onInput={(e) => {
                  e.target.value = e.target.value.replace(/[^0-9]/g, '');
                }} />
              <RHFTextField name='father_occupation' label='Father Occupation' />
            </Box>
          </Stack>
        </Card>
      </Grid>
    </>
  );

  const otherDetails = (
    <>
      {mdUp && (
        <Grid item md={4}>
          <Typography variant='h6' sx={{ mb: 0.5 }}>
            Other Details
          </Typography>
          <Typography variant='body2' sx={{ color: 'text.secondary' }}>
            How did you come, Suggested By, Interested in...
          </Typography>
        </Grid>
      )}
      <Grid item xs={12} md={8}>
        <Card>
          {!mdUp && <CardHeader title='Other Details' />}
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
              <Stack spacing={1}>
                <Typography variant='subtitle2'>How did you come to know about us?</Typography>
                <RHFRadioGroup
                  row
                  spacing={4}
                  onClick={handleRadio}
                  sx={{ width: '175px' }}
                  name='reference_by'
                  options={INQUIRY_REFERENCE_BY}
                />
              </Stack>
              <Stack spacing={1}>
                <Typography variant='subtitle2'>Why did you choose this Course?</Typography>
                <RHFRadioGroup row spacing={4} name='suggested_by' options={INQUIRY_SUGGESTED_IN} />
              </Stack>
              {radio && (
                <Stack spacing={1}>
                  <Typography variant='subtitle2'>Write other reference name </Typography>
                  <RHFTextField name='other_reference_by' label='Reference By' />
                </Stack>
              )}
              <Stack spacing={1}>
                <Typography variant='subtitle2'>Select Interested Options:</Typography>
                <RHFMultiSelect
                  checkbox
                  name='interested_in'
                  label='Interested In'
                  options={configs?.courses?.map((course) => ({
                    label: course.name,
                    value: course.name,
                  }))}
                />
              </Stack>
              <Stack spacing={1}>
                <Typography variant='subtitle2'>Remark</Typography>
                <RHFTextField name='remark' label='Remark' />
              </Stack>
              <Stack spacing={1}>
                <Typography variant='subtitle2'>Status</Typography>
                <RHFRadioGroup
                  row
                  name='status'
                  options={[
                    { label: 'Active', value: 'Active' },
                    { label: 'In Active', value: 'In Active' },
                  ]}
                />
              </Stack>
            </Box>
          </Stack>
        </Card>
      </Grid>
    </>
  );

  const renderActions = (
    <>
      {mdUp && <Grid item md={4} />}
      <Grid
        item
        xs={12}
        md={8}
        sx={{ display: 'flex', alignItems: 'center', justifyContent: 'end' }}
      >
        <LoadingButton type='submit' variant='contained' loading={isSubmitting}>
          {!inquiryId ? 'Create Inquiry' : 'Save Changes'}
        </LoadingButton>
      </Grid>
    </>
  );

  return (
    <FormProvider methods={methods} onSubmit={onSubmit}>
      <Grid container spacing={4}>
        <Grid item xs={12} md={12} />
        {personalDetails}
        <Grid item xs={12} md={12} />
        {addressDetails}
        <Grid item xs={12} md={12} />
        {fatherDetails}
        <Grid item xs={12} md={12} />
        {otherDetails}
        <Grid item xs={12} md={12} />
        {renderActions}
      </Grid>
    </FormProvider>
  );
}

InquiryNewEditForm.propTypes = {
  inquiryId: PropTypes.string,
};
