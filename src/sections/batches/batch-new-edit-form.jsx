// import React, { useEffect, useState } from 'react';
// import * as Yup from 'yup';
// import { Controller, useForm } from 'react-hook-form';
// import { yupResolver } from '@hookform/resolvers/yup';
// import Card from '@mui/material/Card';
// import Stack from '@mui/material/Stack';
// import Button from '@mui/material/Button';
// import Grid from '@mui/material/Unstable_Grid2';
// import CardHeader from '@mui/material/CardHeader';
// import Typography from '@mui/material/Typography';
// import { MobileTimePicker } from '@mui/x-date-pickers/MobileTimePicker';
// import { useRouter } from 'src/routes/hooks';
// import { useBoolean } from 'src/hooks/use-boolean';
// import { useResponsive } from 'src/hooks/use-responsive';
// import { useSnackbar } from 'src/components/snackbar';
// import FormProvider, { RHFTextField, RHFAutocomplete } from 'src/components/hook-form';
// import { Autocomplete, Checkbox, TextField } from '@mui/material';
// import axios from 'axios';
// import { paths } from 'src/routes/paths';
// import moment from 'moment';
// import { useGetStudents } from 'src/api/student';
// import { useAuthContext } from 'src/auth/hooks';

// export default function BatchNewEditForm({ batchId }) {
//   const [studentIds, setStudentIds] = useState([]);
//   const router = useRouter();
//   const mdUp = useResponsive('up', 'md');
//   const { enqueueSnackbar } = useSnackbar();
//   const preview = useBoolean();
//   const { students } = useGetStudents();
//   const { user } = useAuthContext();
//   const NewBlogSchema = Yup.object().shape({
//     technology: Yup.string().required('Technology is required'),
//     batch_time: Yup.string().required('Time is required'),
//     batch_name: Yup.string().required('Batch Name is required'),
//     batch_members: Yup.string().required('Batch Mamber is required'),
//   });

//   const methods = useForm({
//     resolver: yupResolver(NewBlogSchema),
//     defaultValues: {
//       technology: '',
//       batch_time: null,
//       batch_name: '',
//       batch_members: [],
//     },
//   });

//   const handleStudentId = (event, newValue) => {
//     const selectedIds = newValue.map((student) => student.student_user_id);
//     setStudentIds(selectedIds);
//   };
//   const {
//     reset,
//     setValue,
//     handleSubmit,
//     control,
//     getValues,
//     formState: { isSubmitting },
//   } = methods;

//   useEffect(() => {
//     const fetchBatchesById = async () => {
//       try {
//         if (batchId) {
//           const URL = `https://admin-panel-dmawv.ondigitalocean.app/api/company/batch/${batchId}`;
//           const response = await axios.get(URL);
//           const { data } = response.data;


//           reset({
//             technology: data?.batch?.technology,
//             batch_name: data?.batch?.batch_name,
//             batch_time: moment(data?.batch?.batch_time, 'hh:mm').toDate(),
//             batch_members: data?.batch?.batch_members,
//           });
//         }
//       } catch (error) {
//         console.error('Failed to fetch batch:', error);
//       }
//     };
//     fetchBatchesById();
//   }, [batchId, reset]);
//   const onSubmit = async (data) => {
//     console.log(data);
//     const formattedData = { ...data, batch_members: studentIds };
//     // try {
//     //   if (data) {
//     //     const URL = `https://admin-panel-dmawv.ondigitalocean.app/api/company/batch/${batchId}`;
//     //     await axios
//     //       .put(URL, formattedData)
//     //       .then((res) => router.push(paths.dashboard.batches.list))
//     //       .catch((err) => console.log(err));
//     //   }
//     //   preview.onFalse();
//     //   enqueueSnackbar('Update success!');
//     // } catch (error) {
//     //   console.error(error);
//     // }
//   };

//   const renderDetails = (
//     <>
//       {mdUp && (
//         <Grid md={4}>
//           <Typography variant="h6" sx={{ mb: 0.5 }}>
//             Details
//           </Typography>
//           <Typography variant="body2" sx={{ color: 'text.secondary' }}>
//             Technology, Time...
//           </Typography>
//         </Grid>
//       )}

//       <Grid xs={12} md={8}>
//         <Card>
//           {!mdUp && <CardHeader title="Details" />}

//           <Stack spacing={3} sx={{ p: 3 }}>
//             <RHFTextField name="technology" label="Technology" />
//             <RHFTextField name="batch_name" label="Batch Name" />
//             <Controller
//               name="batch_time"
//               control={control}
//               render={({ field }) => (
//                 <MobileTimePicker
//                   orientation="portrait"
//                   label="Batch Time"
//                   value={field.value}
//                   onChange={(newValue) => field.onChange(newValue)}
//                   slotProps={{
//                     textField: {
//                       fullWidth: true,
//                       margin: 'normal',
//                     },
//                   }}
//                 />
//               )}
//             />
//             <Controller
//               name="batch_members"
//               control={control}
//               render={({ field }) => (
//                 <Autocomplete
//                   multiple
//                   options={students}
//                   getOptionLabel={(option) =>
//                     `${option?.personal_info?.firstName} ${option?.personal_info?.lastName}`
//                   }
//                   onChange={handleStudentId}
//                   renderOption={(props, option, { selected }) => (
//                     <li {...props}>
//                       <Checkbox style={{ marginRight: 8 }} checked={selected} />
//                       {`${option?.personal_info?.firstName} ${option?.personal_info?.lastName}`}
//                     </li>
//                   )}
//                   renderInput={(params) => (
//                     <TextField
//                       {...params}
//                       label="Batch Members"
//                       placeholder="Select batch members"
//                     />
//                   )}
//                 />
//               )}
//             />
//           </Stack>
//         </Card>
//       </Grid>
//     </>
//   );

//   return (
//     <>
//       <FormProvider onSubmit={handleSubmit(onSubmit)} methods={methods}>
//         <Grid container spacing={3}>
//           {renderDetails}
//         </Grid>
//         <Stack sx={{ my: '30px', alignItems: 'flex-end' }}>
//           <Button type="submit" variant="contained" disabled={isSubmitting}>
//             Submit
//           </Button>
//         </Stack>
//       </FormProvider>
//     </>
//   );
// }

// // BatchNewEditForm.propTypes = {
// //   batchId: PropTypes.string,
// // };

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

export default function BatchNewEditForm({ batchId }) {
  const router = useRouter();
  const mdUp = useResponsive('up', 'md');
  const { enqueueSnackbar } = useSnackbar();
  const preview = useBoolean();
  const { user } = useAuthContext();
  const { students } = useGetStudentsList(user?.company_id);
  const { faculty } = useGetFaculty();
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
      faculty:null ,
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
            batch_time: moment(data?.batch?.batch_time, 'hh:mm').toDate(),
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
      await axios.put(URL, formattedData).then((res) => enqueueSnackbar('Update success!')).catch((err) => console.log(err));
      
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
          <Typography variant="h6" sx={{ mb: 0.5 }}>
            Details
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            Technology, Time...
          </Typography>
        </Grid>
      )}

      <Grid xs={12} md={8}>
        <Card>
          {!mdUp && <CardHeader title="Details" />}
          <Stack spacing={3} sx={{ p: 3 }}>
            {/* <RHFTextField name="technology" label="Technology" /> */}
            <RHFAutocomplete
              name="technology"
              type="technology"
              label="Technology"
              placeholder="Choose a technology"
              fullWidth
              options={technology.map((option) => option)}
              getOptionLabel={(option) => option}
            />
            <RHFTextField name="batch_name" label="Batch Name" />
            <Controller
              name="batch_time"
              control={control}
              render={({ field }) => (
                <MobileTimePicker
                  orientation="portrait"
                  label="Batch Time"
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
              name="faculty"
              type="faculty"
              label="Facult Name"
              placeholder="Choose a faculty"
              fullWidth
              options={facultyName.map((option) => option)}
              getOptionLabel={(option) => `${option?.firstName} ${option?.lastName}`}
            />
            <RHFAutocomplete1
              name='batch_members'
              labelName="Batch Members"
              control={control}
              studentName={studentName}
            />
          </Stack>
        </Card>
        <Stack sx={{ my: '30px', alignItems: 'flex-end' }}>
          <Button type="submit" variant="contained" disabled={isSubmitting}>
            Submit
          </Button>
        </Stack>
      </Grid>
    </>
  );

  return (
    <FormProvider methods={methods} onSubmit={onSubmit}>
      <Grid container>
        {renderDetails}
      </Grid>
    </FormProvider>
  );
}

BatchNewEditForm.propTypes = {
  batchId: PropTypes.string,
};