import React, { useEffect, useState } from 'react';
import { useForm, Controller, FormProvider } from 'react-hook-form';
import PropTypes from 'prop-types';
import * as Yup from 'yup';
import { useRouter } from 'src/routes/hooks';
import { yupResolver } from '@hookform/resolvers/yup';
import {
  Typography,
  TextField,
  Grid,
  Box,
  Autocomplete,
  Stack,
  Card,
  Checkbox,
  Chip,
} from '@mui/material';
import { DateTimePicker, MobileDateTimePicker } from '@mui/x-date-pickers';
import { RHFAutocomplete, RHFTextField } from 'src/components/hook-form';
import { useResponsive } from 'src/hooks/use-responsive';
import { useAuthContext } from 'src/auth/hooks';
import LoadingButton from '@mui/lab/LoadingButton';
import axios from 'axios';
import { useSnackbar } from 'src/components/snackbar';
import { paths } from 'src/routes/paths';
import { useGetConfigs } from '../../api/config';

export default function SeminarNewEditForm({ SeminarId }) {
  const { user } = useAuthContext();
  const [users, setUsers] = useState([]);
  const mdUp = useResponsive('up', 'md');
  const [selectedRole, setSelectedRole] = useState('');
  const router = useRouter();
  const [allUser, setAllUser] = useState([]);
  const { enqueueSnackbar } = useSnackbar();
  const { configs } = useGetConfigs();

  const NewUserSchema = Yup.object().shape({
    title: Yup.string().required('Title is required'),
    schedule_by: Yup.string().required('Schedule by is required'),
    date_time: Yup.date().required('Date and Time are required'),
    role: Yup.string().required('Role is required'),
    users: Yup.array().min(1, 'At least one user must be selected').required('Users are required'),
    desc: Yup.string().required('Description is required'),
  });

  const methods = useForm({
    resolver: yupResolver(NewUserSchema),
    defaultValues: {
      title: '',
      schedule_by: '',
      date_time: null,
      role: '',
      desc: '',
      users: [],
    },
  });

  const {
    reset,
    setValue,
    handleSubmit,
    control,
    watch,
    formState: { isSubmitting, errors },
  } = methods;

  useEffect(() => {
    const getUsers = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_AUTH_API}/api/company/${user?.company_id}/user/list`
        );
        setAllUser(response.data);
      } catch (err) {
        console.error('Failed to fetch users:', err);
      }
    };
    getUsers();
  }, [user?.company_id]);

  const filter = allUser.map((data) => `${data?.firstName} ${data?.lastName}`);

  useEffect(() => {
    const fetchSeminarById = async () => {
      try {
        if (SeminarId) {
          const URL = `${import.meta.env.VITE_AUTH_API}/api/company/seminar/${SeminarId}`;
          const response = await axios.get(URL);
          const data = response.data.data;
          console.log(data);
          reset({
            title: data.title,
            desc: data.desc,
            date_time: data?.date_time ? new Date(data.date_time) : null,
            schedule_by: `${data.schedule_by.firstName} ${data.schedule_by.lastName}`,
            role: [...new Set(data.attended_by.map((e) => e.role))],
            users: data.attended_by.map((e) => ({
              _id: e._id,
              firstName: e.firstName,
              lastName: e.lastName,
              selectedTime: e.selectedTime || null,
            })),
          });
          setSelectedRole(data?.attended_by[0]?.role);
        }
      } catch (error) {
        console.error('Failed to fetch seminar:', error);
      }
    };
    fetchSeminarById();
  }, [SeminarId, reset]);

  const postSeminar = async (payload) => {
    try {
      const URL = `${import.meta.env.VITE_AUTH_API}/api/company/seminar`;
      const response = await axios.post(URL, payload);
      return response.data;
    } catch (error) {
      console.error('Error creating seminar:', error.message);
      throw error;
    }
  };

  const updateSeminar = async (payload) => {
    try {
      const URL = `${import.meta.env.VITE_AUTH_API}/api/company/seminar/${SeminarId}`;
      const response = await axios.put(URL, payload);
      return response.data;
    } catch (error) {
      console.error('Error updating seminar:', error.message);
      throw error;
    }
  };

  const onSubmit = handleSubmit(async (data) => {
    const assignObject = allUser.find(
      (item) => `${item.firstName} ${item.lastName}` === data.schedule_by
    );
    const payload = {
      title: data.title,
      desc: data.desc,
      company_id: user?.company_id,
      date_time: data.date_time,
      schedule_by: assignObject?._id,
      attended_by: data.users.map((attended_by) => ({
        _id: attended_by._id,
        selectedTime: attended_by.selectedTime,
      })),
    };
    try {
      let response;
      if (SeminarId) {
        response = await updateSeminar(payload);
        router.push(paths.dashboard.seminar.list);
        enqueueSnackbar(response.message, { variant: 'success' });
      } else {
        response = await postSeminar(payload);
        enqueueSnackbar(response.message, { variant: 'success' });
        router.push(paths.dashboard.seminar.list);
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      enqueueSnackbar(error.response?.data?.message || 'Error submitting form', {
        variant: 'error',
      });
    }
  });

  const fetchUsers = async (role) => {
    try {
      const URL = `${import.meta.env.VITE_AUTH_API}/api/company/${user?.company_id}/role/${role}`;
      const response = await axios.get(URL);
      setUsers(response.data.data);
    } catch (error) {
      console.error('Failed to fetch users:', error);
    }
  };

  useEffect(() => {
    if (selectedRole) {
      fetchUsers(selectedRole);
    }
  }, [selectedRole]);

  useEffect(() => {
    const subscription = watch((value, { name }) => {
      if (name === 'role') {
        setSelectedRole(value.role);
        setValue('users', []);
      }
    });
    return () => subscription.unsubscribe();
  }, [watch, setValue]);

  const seminarDetails = (
    <>
      {mdUp && (
        <Grid item md={4}>
          <Typography variant="h6" sx={{ mb: 0.5 }}>
            Seminar Details
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            Seminar, role, Schedule by...
          </Typography>
        </Grid>
      )}
      <Grid item xs={12} md={6}>
        <Card>
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
              <RHFTextField name="title" label="Title" error={!!errors.title} />

              <RHFAutocomplete
                name="schedule_by"
                label="Schedule By"
                placeholder="Choose a contact person"
                fullWidth
                options={filter}
                getOptionLabel={(option) => option}
                error={!!errors.schedule_by}
              />
              <Controller
                name="date_time"
                control={control}
                render={({ field }) => (
                  <MobileDateTimePicker
                    {...field}
                    value={field.value || null}
                    onChange={(newValue) => field.onChange(newValue)}
                    slotProps={{
                      textField: {
                        fullWidth: true,
                        margin: 'normal',
                      },
                    }}
                    error={!!errors?.date_time}
                  />
                )}
              />
              <RHFAutocomplete
                name="role"
                label="Role"
                placeholder="Choose a role"
                fullWidth
                options={configs?.roles}
                getOptionLabel={(option) => option}
                error={!!errors.role}
              />

              <Controller
                name="users"
                control={control}
                render={({ field }) => (
                  <Autocomplete
                    {...field}
                    multiple
                    options={users}
                    value={field.value || []}
                    disableCloseOnSelect
                    getOptionLabel={(option) => `${option.firstName} ${option.lastName}`}
                    onChange={(event, newValue) => field.onChange(newValue)}
                    isOptionEqualToValue={(option, value) => option._id === value._id}
                    renderOption={(props, option, { selected }) => (
                      <li {...props}>
                        <Checkbox style={{ marginRight: 8 }} checked={selected} />
                        {option.firstName} {option.lastName}
                      </li>
                    )}
                    renderTags={(selected, getTagProps) =>
                      selected.map((option, index) => (
                        <Chip
                          {...getTagProps({ index })}
                          key={option?._id}
                          label={`${option?.firstName} ${option?.lastName}`}
                          size="small"
                          variant="soft"
                        />
                      ))
                    }
                    renderInput={(params) => <TextField {...params} label="Users" />}
                    error={!!errors?.users}
                  />
                )}
              />

              <RHFTextField
                name="desc"
                label="Description"
                multiline
                rows={4}
                error={!!errors?.desc}
              />
            </Box>
          </Stack>
        </Card>
      </Grid>
    </>
  );

  const renderOption = (
    <>
      {mdUp && <Grid item md={8} />}
      <Grid item xs={12} md={10} sx={{ display: 'flex', justifyContent: 'end' }}>
        <LoadingButton type="submit" variant="contained" size="large" loading={isSubmitting}>
          {!SeminarId ? 'Add Seminar' : 'Save Changes'}
        </LoadingButton>
      </Grid>
    </>
  );

  return (
    <FormProvider {...methods}>
      <form onSubmit={onSubmit}>
        <Grid container spacing={3}>
          {seminarDetails}
          {renderOption}
        </Grid>
      </form>
    </FormProvider>
  );
}

SeminarNewEditForm.propTypes = {
  SeminarId: PropTypes.string,
};
