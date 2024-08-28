import React, { useEffect, useState } from 'react';
import * as Yup from 'yup';
import PropTypes from 'prop-types';
import { Dialog, DialogContent, DialogTitle, TextField } from '@mui/material';
import { FormProvider, useForm, Controller } from 'react-hook-form';
import { LoadingButton } from '@mui/lab';
import { yupResolver } from '@hookform/resolvers/yup';
import { LocalizationProvider, MobileDateTimePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { Box, Stack } from '@mui/system';
import axios from 'axios';
import { useSnackbar } from 'notistack';
import { useAuthContext } from 'src/auth/hooks';
import dayjs from 'dayjs';
import { RHFAutocomplete } from 'src/components/hook-form';
import { useGetConfigs } from 'src/api/config';

export default function DemoNewEditForm({ open, onClose, currentId }) {
  const { enqueueSnackbar } = useSnackbar();
  const { user } = useAuthContext();
  const [facultyOptions, setFacultyOptions] = useState([]);
  const [selectedFacultyId, setSelectedFacultyId] = useState(null);
  const { configs } = useGetConfigs();
  const [dateTime, setDateTime] = useState(null);

  const NewUserSchema = Yup.object().shape({
    faculty_name: Yup.object()
      .shape({
        label: Yup.string().required('Faculty name is required'),
        id: Yup.string().required('Faculty id is required'),
      })
      .nullable()
      .required('Faculty name is required'),
    date: Yup.date().required('Date is required'),
    technology: Yup.string().required('Technology is required'),
    detail: Yup.string().required('Detail is required'),
  });

  useEffect(() => {
    const fetchFacultyName = async () => {
      try {
        const URL = `${import.meta.env.VITE_AUTH_API}/api/company/${user?.company_id}/faculty`;
        const response = await axios.get(URL);
        if (response.status === 200) {
          const fetchedOptions = response.data.data.map((e) => ({
            label: `${e.firstName} ${e.lastName}`,
            id: e._id,
          }));
          setFacultyOptions(fetchedOptions);
        } else {
          enqueueSnackbar('Failed to fetch faculty data', { variant: 'error' });
        }
      } catch (error) {
        enqueueSnackbar('Failed to fetch faculty data', { variant: 'error' });
      }
    };

    fetchFacultyName();
  }, [user?.company_id, enqueueSnackbar]);

  const methods = useForm({
    resolver: yupResolver(NewUserSchema),
    defaultValues: {
      inquiry_id: currentId,
      company_id: user?.company_id,
      faculty_name: null,
      date: null,
      technology: '',
      detail: '',
    },
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
    control,
  } = methods;

  const createDemo = async (payload) => {
    try {
      const URL = `${import.meta.env.VITE_AUTH_API}/api/v2/demo`;
      const response = await axios.post(URL, payload);
      return response.data;
    } catch (error) {
      throw error;
    }
  };

  const onSubmit = async (data) => {
    try {
      const payload = {
        inquiry_id: currentId?._id,
        company_id: user?.company_id,
        detail: data.detail,
        technology: data.technology,
        date: dayjs(data.date).format('YYYY-MM-DDTHH:mm:ss.SSS[Z]'),
        faculty_id: data.faculty_name.id,
      };
      const response = await createDemo(payload);
      enqueueSnackbar(response.message, {
        variant: 'success',
      });
      onClose();
    } catch (error) {
      enqueueSnackbar('Failed to create demo', {
        variant: 'error',
      });
    }
  };

  const uniqueSubcategories =
    configs?.courses
      ?.flatMap((course) => course.subcategories)
      ?.filter((value, index, self) => self.indexOf(value) === index) || [];

  return (
    <Dialog
      fullWidth
      maxWidth="sm"
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: { maxWidth: 420 },
      }}
    >
      <DialogTitle>Add Demo</DialogTitle>
      <DialogContent sx={{ pb: 3 }}>
        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Stack>
              <Box
                sx={{ py: '15px' }}
                columnGap={2}
                rowGap={3}
                display="grid"
                gridTemplateColumns={{
                  xs: 'repeat(1, 1fr)',
                  md: 'repeat(1, 1fr)',
                }}
              >
                <Controller
                  name="faculty_name"
                  control={control}
                  render={({ field, fieldState: { error } }) => (
                    <RHFAutocomplete
                      {...field}
                      label="Faculty Name"
                      placeholder="Faculty Name"
                      options={facultyOptions}
                      getOptionLabel={(option) => option.label}
                      onChange={(event, value) => {
                        field.onChange(value);
                        setSelectedFacultyId(value?.id || null);
                      }}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="Faculty Name"
                          placeholder="Faculty Name"
                          fullWidth
                          error={!!error}
                          helperText={error ? error.message : null}
                        />
                      )}
                    />
                  )}
                />

                <Controller
                  name="date"
                  control={control}
                  defaultValue={null}
                  render={({ field: { onChange, value }, fieldState: { error } }) => (
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <MobileDateTimePicker
                        value={value}
                        onChange={(newValue) => {
                          onChange(newValue);
                          setDateTime(newValue);
                        }}
                        slotProps={{
                          textField: {
                            fullWidth: true,
                            margin: 'normal',
                            error: !!error,
                            helperText: error ? error.message : null,
                          },
                        }}
                      />
                    </LocalizationProvider>
                  )}
                />
                {configs?.developer_type && (
                  <RHFAutocomplete
                    name="technology"
                    type="technology"
                    label="Technology"
                    placeholder="Choose a Technology"
                    fullWidth
                    options={uniqueSubcategories}
                  />
                )}
                <Controller
                  name="detail"
                  control={control}
                  render={({ field, fieldState: { error } }) => (
                    <TextField
                      {...field}
                      label="Detail"
                      placeholder="Detail"
                      error={!!error}
                      helperText={error ? error.message : null}
                      fullWidth
                    />
                  )}
                />
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: '20px' }}>
                <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
                  Add Demo
                </LoadingButton>
              </Box>
            </Stack>
          </form>
        </FormProvider>
      </DialogContent>
    </Dialog>
  );
}

DemoNewEditForm.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  currentId: PropTypes.object,
};
