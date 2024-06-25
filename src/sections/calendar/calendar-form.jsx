import * as Yup from 'yup';
import PropTypes from 'prop-types';
import { useCallback, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import IconButton from '@mui/material/IconButton';
import LoadingButton from '@mui/lab/LoadingButton';
import DialogActions from '@mui/material/DialogActions';
import { MobileDateTimePicker } from '@mui/x-date-pickers/MobileDateTimePicker';

import uuidv4 from 'src/utils/uuidv4';
import { isAfter, fTimestamp } from 'src/utils/format-time';

import { createEvent, updateEvent, deleteEvent } from 'src/api/calendar';

import Iconify from 'src/components/iconify';
import { useSnackbar } from 'src/components/snackbar';
import { ColorPicker } from 'src/components/color-utils';
import FormProvider, {
  RHFAutocomplete,
  RHFSelect,
  RHFSwitch,
  RHFTextField,
} from 'src/components/hook-form';
import { MobileDatePicker } from '@mui/x-date-pickers';
import { useGetStudents } from 'src/api/student';
import { useAuthContext } from 'src/auth/hooks';
import axios from 'axios';

// ----------------------------------------------------------------------

export default function CalendarForm({ currentEvent, colorOptions, onClose, mutate }) {
  const { enqueueSnackbar } = useSnackbar();
  const { students}  = useGetStudents();
  const [studentId, setStudentId] = useState('');
  const { user } = useAuthContext();
  const [leaveStatus, setLeaveStatus] = useState('pending');
  const EventSchema = Yup.object().shape({
    title: Yup.string().max(255).required('Title is required'),
    description: Yup.string().max(5000, 'Description must be at most 5000 characters'),
    color: Yup.string(),
    allDay: Yup.boolean(),
    start: Yup.mixed(),
    end: Yup.mixed(),
  });

  const methods = useForm({
    // resolver: yupResolver(EventSchema),
    defaultValues: currentEvent,
  });

  const {
    reset,
    watch,
    control,
    handleSubmit,
    getValues,
    formState: { isSubmitting },
  } = methods;

  const values = watch();

  const dateError = isAfter(values.start, values.end);

  const eventTypeOptions = ['holiday', 'student leave', 'notice'];

  const onSubmit = handleSubmit(async (data) => {
    const payload =
      getValues().event_type === 'student leave'
        ? {
            ...getValues(),
            user_id: studentId || currentEvent.user_id,
            leave_status: leaveStatus,
            company_id: user.company_id,
          }
        : {
            ...getValues(),
            user_id: user._id,
            leave_status: leaveStatus,
            company_id: user.company_id,
        };
    try {
      if (!dateError) {
        if (currentEvent?._id) {
          await updateEvent(payload);
          mutate();
          enqueueSnackbar('Update success!');
        } else {
          await createEvent(payload);
          mutate();
          enqueueSnackbar('Create success!');
        }
        onClose();
        reset();
      }
    } catch (err) {
      console.log('ERROR : ', err);
    }
  });

  const onDelete = useCallback(async () => {
    try {
      await deleteEvent(`${currentEvent?._id}`);
      mutate();
      enqueueSnackbar('Delete success!');
      onClose();
    } catch (error) {
      console.error(error);
    }
  }, [currentEvent?.id, enqueueSnackbar, onClose]);

  const handleStudentId = (event, newValue) => {
    if (newValue) {
      setStudentId(newValue.user_id);
    } else {
      setStudentId('');
    }
  };
  
  return (
    <FormProvider methods={methods} onSubmit={onSubmit}>
      <Stack spacing={3} sx={{ px: 3 }}>
        <RHFAutocomplete
          name="event_type"
          label="Event Type"
          options={eventTypeOptions}
          getOptionLabel={(option) => option}
          isOptionEqualToValue={(option, value) => option === value}
          renderOption={(props, option) => (
            <li {...props} key={option}>
              {option}
            </li>
          )}
        />
        {currentEvent?.event_type === 'student leave' ? (
          <RHFTextField name="reason" label="Reason" multiline rows={3} />
        ) : (
          <>
            {getValues().event_type === 'student leave' && (
              <RHFAutocomplete
                name=""
                label="Student Name"
                options={students}
                getOptionLabel={(option) =>
                  `${option.firstName} ${option.lastName}`
                }
                isOptionEqualToValue={(option, value) => option === value}
                renderOption={(props, option) => (
                  <li {...props} key={option.email}>
                    {option.firstName} {option.lastName}
                  </li>
                )}
                onChange={handleStudentId}
              />
            )}

            <RHFTextField name="event" label="Event" />

            <Controller
              name="from"
              control={control}
              render={({ field }) => (
                <MobileDatePicker
                  {...field}
                  value={new Date(field.value)}
                  onChange={(newValue) => {
                    if (newValue) {
                      field.onChange(fTimestamp(newValue));
                    }
                  }}
                  label="Start date"
                  format="dd/MM/yyyy"
                  slotProps={{
                    textField: {
                      fullWidth: true,
                    },
                  }}
                />
              )}
            />

            <Controller
              name="to"
              control={control}
              render={({ field }) => (
                <MobileDatePicker
                  {...field}
                  value={new Date(field.value)}
                  onChange={(newValue) => {
                    if (newValue) {
                      field.onChange(fTimestamp(newValue));
                    }
                  }}
                  label="End date"
                  format="dd/MM/yyyy"
                  slotProps={{
                    textField: {
                      fullWidth: true,
                      error: dateError,
                      helperText: dateError && 'End date must be later than start date',
                    },
                  }}
                />
              )}
            />
            <RHFTextField name="description" label="Description" multiline rows={3} />
          </>
        )}
      </Stack>
      {currentEvent?.event_type === 'student leave' ? (
        <>
          <DialogActions>
            <Tooltip title="Delete Event">
              <IconButton onClick={onDelete}>
                <Iconify icon="solar:trash-bin-trash-bold" />
              </IconButton>
            </Tooltip>
            <Box sx={{ flexGrow: 1 }} />

            <Button
              color="error"
              variant="contained"
              type="submit"
              onClick={() => setLeaveStatus('reject')}
            >
              Reject
            </Button>

            <LoadingButton
              type="submit"
              variant="contained"
              color="primary"
              loading={isSubmitting}
              disabled={dateError}
              onClick={() => setLeaveStatus('approve')}
            >
              Approve
            </LoadingButton>
          </DialogActions>
        </>
      ) : (
        <>
          <DialogActions>
            <Tooltip title="Delete Event">
              <IconButton onClick={onDelete}>
                <Iconify icon="solar:trash-bin-trash-bold" />
              </IconButton>
            </Tooltip>

            <Box sx={{ flexGrow: 1 }} />

            <Button variant="outlined" color="inherit" onClick={onClose}>
              Cancel
            </Button>

            <LoadingButton
              type="submit"
              variant="contained"
              loading={isSubmitting}
              disabled={dateError}
            >
              {currentEvent?.event !== '' ? 'Save Changes' : 'Create Leave'}
            </LoadingButton>
          </DialogActions>
        </>
      )}
    </FormProvider>
  );
}

CalendarForm.propTypes = {
  colorOptions: PropTypes.arrayOf(PropTypes.string),
  currentEvent: PropTypes.object,
  onClose: PropTypes.func,
};
