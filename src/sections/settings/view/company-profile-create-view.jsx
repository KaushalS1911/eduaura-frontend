// import React, { useState, useEffect, useMemo, useCallback } from 'react';
// import { TextField, Button, Grid, Box, Card, Avatar, Typography, CardHeader } from '@mui/material';
// import { useGetConfigs } from 'src/api/config';
// import axios from 'axios';
// import { useAuthContext } from 'src/auth/hooks';
// import { useSnackbar } from 'src/components/snackbar';
// import { Stack } from '@mui/system';
// import { LoadingButton } from '@mui/lab';
// import { RHFTextField, RHFUploadAvatar } from 'src/components/hook-form';
// import FormProvider from 'src/components/hook-form/form-provider';
// import { useForm } from 'react-hook-form';

// export default function CompanyProfile() {
//   const { user } = useAuthContext();
//   const [profilePic, setProfilePic] = useState(null);
//   const { configs, mutate } = useGetConfigs();
//   const { enqueueSnackbar } = useSnackbar();
//   const [values, setValues] = useState({
//     name: '',
//     logo: null,
//   });
//   const [loading, setLoading] = useState(false);

//   useEffect(() => {
//     if (configs && configs.company_details) {
//       setValues((prevValues) => ({
//         ...prevValues,
//         name: configs.company_details.name || '',
//       }));
//     }
//   }, [configs]);

//   console.log(configs);

//   // const handleChange = (event) => {
//   //   setValues({
//   //     ...values,
//   //     [event.target.name]: event.target.value,
//   //   });
//   // };

//   // const handleFileChange = async (event) => {
//   //   const file = event.target.files[0];
//   //   setProfilePic(file);
//   //   const apiEndpoint = `${import.meta.env.VITE_AUTH_API}/api/company/${user?.company_id}/company-logo`;

//   //   const formData = new FormData();
//   //   formData.append('logo_url', file, file.name);

//   //   try {
//   //     const response = await axios.put(apiEndpoint, formData, {
//   //       headers: {
//   //         'Content-Type': 'multipart/form-data',
//   //       },
//   //     });
//   //     if (response.status === 200) {
//   //       enqueueSnackbar(response.data.data.message, {
//   //         variant: 'success',
//   //       });
//   //       mutate();
//   //     }
//   //   } catch (error) {
//   //     console.error('Upload error:', error);
//   //     enqueueSnackbar(error.response?.data?.message || 'An error occurred', {
//   //       variant: 'error',
//   //     });
//   //   }
//   // };

//   const defaultValues = useMemo(
//     () => ({
//       logo_url: configs?.company_details?.logo || '',
//       name: configs?.company_details?.name || '',
//     }),
//     [configs]
//   );
//   const methods = useForm({
//     // resolver: yupResolver(NewUserSchema),
//     defaultValues,
//   });
//   const {
//     reset,
//     watch,
//     control,
//     setValue,
//     handleSubmit,
//     formState: { isSubmitting },
//   } = methods;
//   const onSubmit = () =>
//     handleSubmit(async(event) => {
//       console.log(event,":ddsgfdghdfgsghdfghdfghdfhsgfdhdfhsgdfsdfdghdf");
//       // event.preventDefault();
//       // setLoading(true);
//       // const URL = `${import.meta.env.VITE_AUTH_API}/api/company/${user.company_id}/configs/${configs._id}`;
//       // const payload = { ...configs, company_details: { ...configs.company_details, ...values } };
//       // console.log(payload);
//       // try {
//       //   const res = await axios.put(URL, payload);
//       //   if (res.status === 200) {
//       //     enqueueSnackbar('Company name updated successfully', {
//       //       variant: 'success',
//       //     });
//       //     mutate();
//       //   }
//       // } catch (err) {
//       //   console.error('Update error:', err);
//       //   enqueueSnackbar(err.response?.data?.message || 'An error occurred', {
//       //     variant: 'error',
//       //   });
//       // } finally {
//       //   setLoading(false);
//       // }
       
//       //  const apiEndpoint = `${import.meta.env.VITE_AUTH_API}/api/company/${user?.company_id}/company-logo`;

//       //  const formData = new FormData();
//       //  formData.append('logo_url', profilePic, profilePic.name);

//       //  try {
//       //    const response = await axios.put(apiEndpoint, formData, {
//       //      headers: {
//       //        'Content-Type': 'multipart/form-data',
//       //      },
//       //    });
//       //    if (response.status === 200) {
//       //      enqueueSnackbar(response.data.data.message, {
//       //        variant: 'success',
//       //      });
//       //      mutate();
//       //    }
//       //  } catch (error) {
//       //    console.error('Upload error:', error);
//       //    enqueueSnackbar(error.response?.data?.message || 'An error occurred', {
//       //      variant: 'error',
//       //    });
//       //  }
//     });
//   const handleDrop = useCallback(
//     (acceptedFiles) => {
//       const file = acceptedFiles[0];

//       const newFile = Object.assign(file, {
//         preview: URL.createObjectURL(file),
//       });

//       if (file) {
//         setProfilePic(file);
//         setValue('logo_url', newFile, { shouldValidate: true });
//       }
//     },
//     [setValue]
//   );
//   console.log(configs, 'configs');
//   return (
//     <Box
//       sx={{
//         width: '100%',
//         marginBottom: '10px',
//         padding: '10px',
//       }}
//     >
//       <Grid container spacing={3} >
//         {/* <Grid item xs={12}>
//           <CardHeader title="Company Info" />
//         </Grid> */}
//         <Grid item md={4} >
//           <Box>
//             <Typography variant="h6" sx={{ mb: 0.5 }}>
//               Companey Details
//             </Typography>
//             <Typography variant="body2" sx={{ color: 'text.secondary' }}>
//               Compant name , Logo...
//             </Typography>
//           </Box>
//         </Grid>
//         <Grid item xs={12} md={8}>
//           <Grid item xs={12} md={8}>
//             <Card>
//               <FormProvider methods={methods} onSubmit={onSubmit}>
//                 <Stack spacing={3} sx={{ p: 3 }}>
//                   {/* <Box sx={{ marginBottom: '20px' }}>
//                   <input
//                     id="file-input"
//                     type="file"
//                     style={{ display: 'none' }}
//                     onChange={handleFileChange}
//                   />
//                   <Avatar
//                     alt="Avatar"
//                     src={configs?.company_details?.logo || ''}
//                     onClick={() => document.getElementById('file-input').click()}
//                     style={{
//                       cursor: 'pointer',
//                       width: 96,
//                       height: 100,
//                       margin: 'auto',
//                       fontSize: '10px',
//                     }}
//                   >
//                     Upload Logo
//                   </Avatar>
//                 </Box> */}
//                   <Box sx={{ mb: 5 }}>
//                     <RHFUploadAvatar name="logo_url" onDrop={handleDrop} />
//                   </Box>

//                   <RHFTextField label="Company Name" name="name" />
//                   <Box sx={{ display: 'flex', justifyContent: 'end', mt: '20px' }}>
//                     <LoadingButton type="submit" variant="contained" loading={loading}>
//                       Save Changes
//                     </LoadingButton>
//                   </Box>
//                 </Stack>
//               </FormProvider>
//             </Card>
//           </Grid>
//         </Grid>
//       </Grid>
//     </Box>
//   );
// }

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { TextField, Button, Grid, Box, Card, Avatar, Typography, CardHeader } from '@mui/material';
import { useGetConfigs } from 'src/api/config';
import axios from 'axios';
import { useAuthContext } from 'src/auth/hooks';
import { useSnackbar } from 'src/components/snackbar';
import { Stack } from '@mui/system';
import { LoadingButton } from '@mui/lab';
import { RHFTextField, RHFUploadAvatar } from 'src/components/hook-form';
import FormProvider from 'src/components/hook-form/form-provider';
import { useForm } from 'react-hook-form';

export default function CompanyProfile() {
  const { user } = useAuthContext();
  const [profilePic, setProfilePic] = useState(null);
  const { configs, mutate } = useGetConfigs();
  const { enqueueSnackbar } = useSnackbar();
  const [values, setValues] = useState({
    name: '',
    logo: null,
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (configs && configs.company_details) {
      setValues((prevValues) => ({
        ...prevValues,
        name: configs.company_details.name || '',
      }));
    }
  }, [configs]);

  const defaultValues = useMemo(
    () => ({
      logo_url: configs?.company_details?.logo || '',
      name: configs?.company_details?.name || '',
    }),
    [configs]
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
  } = methods;

  const onSubmit = async (data) => {
    console.log(data, ": submitted data");
    // event.preventDefault();
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
    [setValue]
  );

  return (
    <Box
      sx={{
        width: '100%',
        marginBottom: '10px',
        padding: '10px',
      }}
    >
      <Grid container spacing={3}>
        <Grid item md={4} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <Box>
            <Typography variant="h6" sx={{ mb: 0.5 }}>
              Company Details
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              Company name, Logo...
            </Typography>
          </Box>
        </Grid>
        <Grid
          item
          xs={12}
          md={8}
          sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}
        >
          <Grid item xs={12} md={8}>
            <Card>
              <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
                <Stack spacing={3} sx={{ p: 3 }}>
                  <Box sx={{ mb: 5 }}>
                    <RHFUploadAvatar
                      sx={{
                        height: '250px',
                        width: '250px',
                        '& > svg': { borderRadius: '0px !important' },
                      }}
                      name="logo_url"
                      onDrop={handleDrop}
                    />
                  </Box>

                  <RHFTextField label="Company Name" name="name" />
                  <Box sx={{ display: 'flex', justifyContent: 'end', mt: '20px' }}>
                    <LoadingButton type="submit" variant="contained" loading={loading}>
                      Save Changes
                    </LoadingButton>
                  </Box>
                </Stack>
              </FormProvider>
            </Card>
          </Grid>
        </Grid>
      </Grid>
    </Box>
  );
}



