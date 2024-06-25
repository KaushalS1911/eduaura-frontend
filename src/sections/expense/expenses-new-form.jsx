import React from 'react';
import * as Yup from 'yup';
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
import moment from 'moment';
import { useAuthContext } from 'src/auth/hooks';

const types = [
  'Rent',
  'Electricity Bill',
  'Salary',
  'Stationary',
  'Maintenance',
  'New Asset Purchase',
  'Office Expense',
];

const ExpenseNewForm = () => {
  const router = useRouter();
  const mdUp = useResponsive('up', 'md');
  const { enqueueSnackbar } = useSnackbar();
  const preview = useBoolean();

  const NewBlogSchema = Yup.object().shape({
    type: Yup.string().required('Type is required'),
    desc: Yup.string().required('Description is required'),
    // date: Yup.date().required('Date is required'),
    amount: Yup.number().required('Amount is required'),
  });

  const methods = useForm({
    resolver: yupResolver(NewBlogSchema),
    defaultValues: {
      type: '',
      desc: '',
      date: null,
      amount: '',
    },
  });

  const {
    reset,
    setValue,
    handleSubmit,
    control,
    formState: { isSubmitting },
  } = methods;
  const { user } = useAuthContext();
  console.log(user, 'user');
  const onSubmit = handleSubmit(async (data) => {
    try {
      const formattedData = {
        ...data,
        // date: moment(data.date, 'DD/MM/YYYY').format('DD-MM-YYYY'),
        company_id: `${user?.company_id}`,
        created_by: `${user?._id}`,
      };

      const URL = `${import.meta.env.VITE_AUTH_API}/api/company/expense`;
      await axios
        .post(URL, formattedData)
        .then((res) => {
          enqueueSnackbar('Create success!');
        })
        .catch((err) => console.log(err));

      router.push(paths.dashboard.expenses.list);
      preview.onFalse();
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
            Type, short description, Amount...
          </Typography>
        </Grid>
      )}

      <Grid xs={12} md={8}>
        <Card>
          {!mdUp && <CardHeader title="Details" />}

          <Stack spacing={3} sx={{ p: 3 }}>
            <RHFAutocomplete
              name="type"
              label="Type"
              placeholder="Choose a Type"
              fullWidth
              options={types}
              getOptionLabel={(option) => option}
            />
            <RHFTextField name="desc" label="Description" multiline rows={3} />
            <RHFTextField name="amount" label="Amount" />
            {/* <Stack spacing={1.5}>
              <Controller
                name="date"
                control={control}
                render={({ field, fieldState: { error } }) => (
                  <DatePicker
                    {...field}
                    value={field.value ? moment(field.value).toDate() : null}
                    onChange={(newDate) => {
                      const formattedDate = newDate ? moment(newDate).format('DD/MM/YYYY') : null;
                      setValue('date', formattedDate);
                      field.onChange(formattedDate);
                    }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        fullWidth
                        error={!!error}
                        helperText={error?.message}
                      />
                    )}
                  />
                )}
              />
            </Stack> */}
            <Stack spacing={1.5}>
              <Controller
                name="date"
                control={control}
                render={({ field, fieldState: { error } }) => (
                  <DatePicker
                    {...field}
                    value={field.value}
                    onChange={(newDate) => {
                      setValue('date', newDate);
                      field.onChange(newDate);
                    }}
                    format="dd/MM/yyyy"
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        fullWidth
                        error={!!error}
                        helperText={error?.message}
                      />
                    )}
                  />
                )}
              />
            </Stack>
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
    <>
      <FormProvider methods={methods} onSubmit={onSubmit}>
        <Grid container spacing={3}>
          {renderDetails}
        </Grid>
      </FormProvider>
    </>
  );
};

export default ExpenseNewForm;
