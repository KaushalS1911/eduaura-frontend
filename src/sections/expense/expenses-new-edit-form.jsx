import React, { useEffect } from 'react';
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
import { useGetConfigs } from '../../api/config';

// ----------------------------------------------------------------------

const types = [
  'Rent',
  'Electricity Bill',
  'Salary',
  'Stationary',
  'Maintenance',
  'New Asset Purchase',
  'Office Expense',
];

const NewBlogSchema = Yup.object().shape({
  type: Yup.string().required('Type is required'),
  desc: Yup.string().required('Description is required'),
  date: Yup.date().nullable().required('Date is required'),
  amount: Yup.number()
    .required('Amount is required')
    .positive('Amount must be positive')
    .min(1, 'Amount must be greater than 0'),
});

export default function PostNewEditForm({ expensesId }) {
  const router = useRouter();
  const mdUp = useResponsive('up', 'md');
  const { enqueueSnackbar } = useSnackbar();
  const preview = useBoolean();
  const { configs } = useGetConfigs();
  const { user } = useAuthContext();

  const methods = useForm({
    resolver: yupResolver(NewBlogSchema),
    defaultValues: {
      type: '',
      desc: '',
      date: new Date() || '',
      amount: '',
    },
  });

  const {
    reset,
    handleSubmit,
    control,
    formState: { isSubmitting },
  } = methods;

  useEffect(() => {
    const fetchExpenseById = async () => {
      try {
        if (expensesId) {
          const URL = `${import.meta.env.VITE_AUTH_API}/api/company/${user?.company_id}/${expensesId}/expense`;
          const response = await axios.get(URL);
          const { data } = response.data;
          reset({
            type: data.type,
            desc: data.desc,
            date: data.date ? new Date(data.date) : new Date(),
            amount: data.amount,
          });
        }
      } catch (error) {
        console.error('Failed to fetch expense:', error);
      }
    };
    fetchExpenseById();
  }, [expensesId, reset, user?.company_id]);

  const onSubmit = handleSubmit(async (data) => {
    try {
      const URL = expensesId
        ? `${import.meta.env.VITE_AUTH_API}/api/company/${user?.company_id}/${expensesId}/update-expense`
        : `${import.meta.env.VITE_AUTH_API}/api/company/${user?.company_id}/create-expense`;

      await axios.post(URL, data);
      router.push(paths.dashboard.expenses.list);
      enqueueSnackbar(expensesId ? 'Update success!' : 'Create success!');
    } catch (error) {
      console.error('Submission Error:', error);
    }
  });

  const renderDetails = (
    <>
      {mdUp && (
        <Grid md={4}>
          <Typography variant='h6' sx={{ mb: 0.5 }}>
            Details
          </Typography>
          <Typography variant='body2' sx={{ color: 'text.secondary' }}>
            Type, short description, Amount...
          </Typography>
        </Grid>
      )}

      <Grid xs={12} md={8}>
        <Card>
          {!mdUp && <CardHeader title='Details' />}

          <Stack spacing={3} sx={{ p: 3 }}>
            <RHFAutocomplete
              name='type'
              label='Type'
              placeholder='Choose a Type'
              fullWidth
              options={configs?.expenses || types}
              getOptionLabel={(option) => option}
            />
            <RHFTextField name='desc' label='Description' multiline rows={3} />
            <RHFTextField name='amount' label='Amount' inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }}
                          onInput={(e) => {
                            e.target.value = e.target.value.replace(/[^0-9]/g, '');
                          }} />
            <Stack spacing={1.5}>
              <Controller
                name='date'
                control={control}
                render={({ field, fieldState: { error } }) => {
                  return (
                    <DatePicker
                      {...field}
                      value={field.value || new Date()}
                      onChange={(newDate) => {
                        field.onChange(newDate);
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
                  );
                }}
              />
            </Stack>
          </Stack>
        </Card>
        <Stack sx={{ my: '30px', alignItems: 'flex-end' }}>
          <Button type='submit' variant='contained' disabled={isSubmitting}>
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

PostNewEditForm.propTypes = {
  expensesId: PropTypes.string,
};
