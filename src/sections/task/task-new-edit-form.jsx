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
import { useGetTasks } from 'src/api/task';

// ----------------------------------------------------------------------

const status = ['Pending', 'Completed'];

export default function TaskNewEditForm({ expensesId }) {
  const router = useRouter();
  const mdUp = useResponsive('up', 'md');
  const { user } = useAuthContext();
  const [users, setUsers] = useState([]);
  const { enqueueSnackbar } = useSnackbar();
  const preview = useBoolean();
  const { tasks } = useGetTasks();
  const [taskData, setTaskData] = useState([]);

  const getUsers = () => {
    axios
      .get(`${import.meta.env.VITE_AUTH_API}/api/company/${user?.company_id}/user/list`)
      .then((res) => setUsers(res?.data))
      .catch((err) => console.log(err));
  };
  const filter = users.map((data) => ` ${data?.firstName} ${data?.lastName}`);
  useEffect(() => {
    getUsers();
    if (tasks[0]?._id) {
      setTaskData(tasks);
    }
  }, [tasks]);
  const NewBlogSchema = Yup.object().shape({
    title: Yup.string().required('Title is required'),
    assigned_to: Yup.string().required('Assingned to is required'),
    assigned_by: Yup.string().required('Assigned bY is required'),
    desc: Yup.string().required('Description is required'),
    status: Yup.string().required('Status is required'),
  });

  const methods = useForm({
    resolver: yupResolver(NewBlogSchema),
    defaultValues: {
      title: '',
      desc: '',
      assigned_to: '',
      assigned_by: '',
      status: '',
    },
  });
  const {
    reset,
    setValue,
    handleSubmit,
    control,
    formState: { isSubmitting },
  } = methods;
  const data = taskData ? taskData?.find((item) => item?._id == expensesId) : [];
  console.log(data, 'aaafa');
  const fetchExpenseById = async () => {
    try {
      if (expensesId) {
        reset({
          title: data.title,
          status: data?.status,
          desc: data.desc,
          assigned_to: `${data?.assigned_to?.firstName} ${data?.assigned_to?.lastName}`,
          assigned_by: `${user?.firstName} ${user?.lastName}`,
        });
      }
    } catch (error) {
      console.error('Failed to fetch expense:', error);
    }
  };
  useEffect(() => {
    fetchExpenseById();
  }, [expensesId, reset, taskData]);

  const onSubmit = handleSubmit(async (data) => {
    const assignObject = users.find((item) =>
      data.assigned_to.includes(item?.firstName) && data.assigned_to.includes(item?.lastName)
        ? item._id
        : null
    );
    try {
      const formattedData = {
        ...data,
        assigned_by: user?._id,
        assigned_to: assignObject?._id,
        company_id: `${user?.company_id}`,
        status: data?.status,
      };
      console.log(formattedData, 'data');
      if (data) {
        const URL = `${import.meta.env.VITE_AUTH_API}/api/company/task/${expensesId}`;
        await axios
          .put(URL, formattedData)
          .then((res) => router.push(paths.dashboard.task.list))
          .catch((err) => console.log(err));
      }
      preview.onFalse();
      enqueueSnackbar(expensesId ? 'Update success!' : 'Create success!');
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
            Title, short description, Amount...
          </Typography>
        </Grid>
      )}

      <Grid xs={12} md={8}>
        <Card>
          {!mdUp && <CardHeader title="Details" />}

          <Stack spacing={3} sx={{ p: 3 }}>
            <RHFTextField name="title" label="Title" />
            <RHFTextField name="desc" label="Description" multiline rows={3} />
            <RHFTextField disabled name="assigned_by" label="Assigned By" />
            <RHFAutocomplete
              name="assigned_to"
              label="Assigned To"
              placeholder="Choose a assigned to"
              fullWidth
              options={filter}
              getOptionLabel={(option) => option}
            />
            <RHFAutocomplete
              name="status"
              label="Choose a status"
              placeholder="Choose a status"
              fullWidth
              options={status}
              getOptionLabel={(option) => option}
            />
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

TaskNewEditForm.propTypes = {
  expensesId: PropTypes.string,
};
