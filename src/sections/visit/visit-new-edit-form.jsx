import React, { useState, useEffect, useCallback, useMemo } from 'react';
import * as Yup from 'yup';
import PropTypes from 'prop-types';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Unstable_Grid2';
import CardHeader from '@mui/material/CardHeader';
import Typography from '@mui/material/Typography';
import { useRouter } from 'src/routes/hooks';
import { useBoolean } from 'src/hooks/use-boolean';
import { useResponsive } from 'src/hooks/use-responsive';
import { useSnackbar } from 'src/components/snackbar';
import FormProvider, { RHFTextField, RHFAutocomplete } from 'src/components/hook-form';
import axios from 'axios';
import { paths } from 'src/routes/paths';
import { useAuthContext } from 'src/auth/hooks';

// ----------------------------------------------------------------------

export default function VisitNewEditForm({ expensesId }) {
  const router = useRouter();
  const mdUp = useResponsive('up', 'md');
  const { enqueueSnackbar } = useSnackbar();
  const { user } = useAuthContext();
  const preview = useBoolean();
  const [allUser, setAllUser] = useState([]);

  const getUsers = () => {
    axios
      .get(`${import.meta.env.VITE_AUTH_API}/api/company/${user?.company_id}/user/list`)
      .then((res) => setAllUser(res.data))
      .catch((err) => console.log(err));
  };
  useEffect(() => {
    getUsers();
  }, []);
  const filter = allUser.map((data) => ` ${data?.firstName} ${data?.lastName}`);
  const NewBlogSchema = Yup.object().shape({
    firstName: Yup.string().required('FirstName is required'),
    lastName: Yup.string().required('LastName is required'),
    notes: Yup.string().required('Notes is required'),
    address: Yup.string().required('Address is required'),
    reference: Yup.string().required('Reference is required'),
    contact_person: Yup.string().required('Contact person is required'),
    contact: Yup.string().max(10).min(10).required('Contact number is required'),
  });

  const methods = useForm({
    resolver: yupResolver(NewBlogSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      notes: '',
      address: '',
      reference: '',
      contact_person: '',
      contact: '',
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
    const fetchExpenseById = async () => {
      try {
        if (expensesId) {
          const URL = `${import.meta.env.VITE_AUTH_API}/api/v2/visit/${expensesId}`;
          const response = await axios.get(URL);
          const { data } = response.data;
          reset({
            reference: data.reference,
            contact_person: `${data?.contact_person?.firstName} ${data?.contact_person?.lastName}`,
            contact: data.contact,
            firstName: data.firstName,
            lastName: data.lastName,
            notes: data.notes,
            address: data.address,
          });
        }
      } catch (error) {
        console.error('Failed to fetch expense:', error);
      }
    };
    fetchExpenseById();
  }, [expensesId, reset]);

  const onSubmit = handleSubmit(async (data) => {
    const assignObject = allUser.find((item) =>
      data.contact_person.includes(item?.firstName) && data.contact_person.includes(item?.lastName)
        ? item._id
        : null
    );
    try {
      const formattedData = {
        ...data,
        contact_person: assignObject?._id,
        company_id: `${user?.company_id}`,
      };
      const URL = `${import.meta.env.VITE_AUTH_API}/api/v2/visit/${expensesId}`;
      await axios
        .put(URL, formattedData)
        .then((res) => {
          router.push(paths.dashboard.visit.list);
          enqueueSnackbar('Update success!');
          preview.onFalse();
        })
        .catch((err) => {
          console.log(err)
          enqueueSnackbar('Something want wrong!',{variant:"error"});
        });

      
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
            Name, short address, contact...
          </Typography>
        </Grid>
      )}

      <Grid xs={12} md={8}>
        <Card>
          {!mdUp && <CardHeader title="Details" />}

          <Stack spacing={3} sx={{ p: 3 }}>
            <RHFTextField name="firstName" label="First Name" />
            <RHFTextField name="lastName" label="Last Name" />
            <RHFTextField name="address" label="Address" />
            <RHFTextField name="contact" label="Contact" />
            <RHFAutocomplete
              name="contact_person"
              label="Contact Person"
              placeholder="Choose a contact person"
              fullWidth
              options={filter}
              getOptionLabel={(option) => option}
            />
            <RHFTextField name="reference" label="Reference" />
            <RHFTextField name="notes" label="Notes" multiline rows={3} />
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

VisitNewEditForm.propTypes = {
  expensesId: PropTypes.string,
};
