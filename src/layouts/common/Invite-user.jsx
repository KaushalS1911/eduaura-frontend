import * as Yup from 'yup';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import axios from 'axios';

import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';
import InputAdornment from '@mui/material/InputAdornment';

import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';

import { PATH_AFTER_LOGIN } from 'src/config-global';
import { useSnackbar } from 'src/components/snackbar';

import Iconify from 'src/components/iconify';
import FormProvider, { RHFAutocomplete, RHFTextField } from 'src/components/hook-form';
import { useRouter, useSearchParams } from 'src/routes/hooks';
import Logo from '../../components/logo';
import { useAuthContext } from '../../auth/hooks';

const RegisterSchema = Yup.object().shape({
  firstName: Yup.string().required('First name is required'),
  lastName: Yup.string().required('Last name is required'),
  email: Yup.string().required('Email is required').email('Must be a valid email'),
  password: Yup.string().required('Password is required'),
  contact: Yup.string().notRequired(),
  role: Yup.string().notRequired(),
});

const defaultValues = {
  firstName: '',
  lastName: '',
  email: '',
  contact: '',
  role: '',
  password: '',
};
export default function InviteUserView() {
  const { enqueueSnackbar } = useSnackbar();
  const router = useRouter();
  const { user } = useAuthContext();
  const [showPassword, setShowPassword] = useState(false);
  const [confiugData, setConfiugData] = useState([]);
  const methods = useForm({
    resolver: yupResolver(RegisterSchema),
    defaultValues,
  });
  const getConfiug = () => {
    axios.get(`https://admin-panel-dmawv.ondigitalocean.app/api/company/${user?.company_id}/configs`)
      .then((res) => setConfiugData(res?.data?.data?.data[0]))
      .catch((err) => console.log(err));
  };
  useEffect(() =>{
    getConfiug()

  },[])
  const searchParams = useSearchParams();
  const returnTo = searchParams.get('returnTo');

  const {
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = async (data) => {
    console.log(data,"data");
    try {
      const URL = `${import.meta.env.VITE_AUTH_API}/api/invite-user`;
      const response = await axios.post(URL, { ...data,company_id:user?.company_id });
      if (response.status === 200) {
        enqueueSnackbar(response.data.data.message, { variant: 'success' });
        // const result = response.data.data.tokens;
        // localStorage.setItem('jwt', result.jwt);
        // localStorage.setItem('jwtRefresh', result.jwtRefresh);
        // reset();
        router.push(returnTo || PATH_AFTER_LOGIN);
      }else {
        enqueueSnackbar('Something want wrong', { variant: 'error' });

      }
    } catch (error) {
        enqueueSnackbar('Something want wrong', { variant: 'error' });
      console.error('Registration failed:', error);
    }
  };

  const handleClickShowPassword = () => {
    setShowPassword((prev) => !prev);
  };
const roles = ["admin","user"]
  return (
    <>

      <Stack spacing={2} sx={{ mb: 1 }}>
        <Typography sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}><Logo /></Typography>
      </Stack>

      <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
        <Stack spacing={2.5}>
          <RHFTextField name='firstName' label='First name' />
          <RHFTextField name='lastName' label='Last name' />
          <RHFTextField name='email' label='Email address' />
          <RHFTextField name='contact' label='Contact' />
          <RHFAutocomplete
            name='role'
            label='Role'
            placeholder='Choose a role'
            fullWidth
            options={confiugData.roles || []}
            getOptionLabel={(option) => option}
          />
          <RHFTextField
            name='password'
            label='Password'
            type={showPassword ? 'text' : 'password'}
            InputProps={{
              endAdornment: (
                <InputAdornment position='end'>
                  <IconButton onClick={handleClickShowPassword} edge='end'>
                    <Iconify icon={showPassword ? 'solar:eye-bold' : 'solar:eye-closed-bold'} />
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          <LoadingButton
            fullWidth
            color='inherit'
            size='large'
            type='submit'
            variant='contained'
            loading={isSubmitting}
          >
            Invite User
          </LoadingButton>
        </Stack>
      </FormProvider>


    </>
  );
}
