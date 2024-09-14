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
import { useGetEmployees } from '../../api/employee';
import { useGetConfigs } from '../../api/config';
import { getResponsibilityValue } from '../../permission/permission';

// ----------------------------------------------------------------------

export default function CalendarForm({ currentEvent, colorOptions, onClose, mutate }) {
  const { configs } = useGetConfigs();
  const { enqueueSnackbar } = useSnackbar();
  const { students } = useGetStudents();
  const { employees } = useGetEmployees();
  const [studentId, setStudentId] = useState('');
  const [employeeId, setEmployeeId] = useState('');
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

  const eventTypeOptions = ['holiday', 'student leave', 'employee leave', 'notice'];

  const onSubmit = handleSubmit(async (data) => {
    let payload = {};

    if (getValues().event_type === 'student leave') {
      payload = {
        ...getValues(),
        user_id: studentId || currentEvent?.user_id,
        leave_status: leaveStatus,
        company_id: user?.company_id,
      };
    } else if (getValues().event_type === 'employee leave') {
      payload = {
        ...getValues(),
        user_id: employeeId || currentEvent?.user_id,
        leave_status: leaveStatus,
        company_id: user?.company_id,
      };
    } else {
      payload = {
        ...getValues(),
        user_id: user._id,
        leave_status: leaveStatus,
        company_id: user?.company_id,
      };
    }
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
      console.error('ERROR: ', err);
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

  const handleemployeeId = (event, newValue) => {
    if (newValue) {
      setEmployeeId(newValue.user_id);
    } else {
      setEmployeeId('');
    }
  };

  return (
    <FormProvider methods={methods} onSubmit={onSubmit}>
      <Stack spacing={3} sx={{ px: 3 }}>
        <RHFAutocomplete
          name='event_type'
          label='Event Type'
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
          <RHFTextField name='reason' label='Reason' multiline rows={3} />
        ) : (
          <>
            {getValues().event_type === 'student leave' && (
              <RHFAutocomplete
                name=''
                label='Student Name'
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
          </>
        )}

        {currentEvent?.event_type === 'employee leave' ? (
          <RHFTextField name='reason' label='Reason' multiline rows={3} />
        ) : (
          <>
            {getValues().event_type === 'employee leave' && (
              <>
                <RHFAutocomplete
                  name=''
                  label='employee Name'
                  options={employees}
                  getOptionLabel={(option) =>
                    `${option.firstName} ${option.lastName}`
                  }
                  isOptionEqualToValue={(option, value) => option === value}
                  renderOption={(props, option) => (
                    <li {...props} key={option.email}>
                      {option.firstName} {option.lastName}
                    </li>
                  )}
                  onChange={handleemployeeId}
                />
              </>
            )}
          </>
        )}
        {currentEvent?.event_type === 'student leave' || currentEvent?.event_type === 'employee leave' ? '' : (<>
          {getValues().event_type === 'employee leave' ?
            <RHFAutocomplete
              name='event'
              label='Event'
              options={['Half time', 'Full time']}
              getOptionLabel={(option) => option}
              isOptionEqualToValue={(option, value) => option === value}
              renderOption={(props, option) => (
                <li {...props} key={option}>
                  {option}
                </li>
              )}
            />
            :
            <RHFTextField name='event' label='Event' />
          }

          <Controller
            name='from'
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
                label='Start date'
                format='dd/MM/yyyy'
                slotProps={{
                  textField: {
                    fullWidth: true,
                  },
                }}
              />
            )}
          />

          <Controller
            name='to'
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
                label='End date'
                format='dd/MM/yyyy'
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
          <RHFTextField name='description' label='Description' multiline rows={3} /></>)}
      < /Stack>
      {currentEvent?.event_type === 'student leave' || currentEvent?.event_type === 'employee leave' ? (
        <>
          <DialogActions>
            {getResponsibilityValue('delete_event', configs, user) && <Tooltip title='Delete Event'>
              <IconButton onClick={onDelete}>
                <Iconify icon='solar:trash-bin-trash-bold' />
              </IconButton>
            </Tooltip>}
            <Box sx={{ flexGrow: 1 }} />

            <Button
              color='error'
              variant='contained'
              type='submit'
              onClick={() => setLeaveStatus('reject')}
            >
              Reject
            </Button>

            <LoadingButton
              type='submit'
              variant='contained'
              color='primary'
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
            {getResponsibilityValue('delete_event', configs, user) && <Tooltip title='Delete Event'>
              <IconButton onClick={onDelete}>
                <Iconify icon='solar:trash-bin-trash-bold' />
              </IconButton>
            </Tooltip>}

            <Box sx={{ flexGrow: 1 }} />

            <Button variant='outlined' color='inherit' onClick={onClose}>
              Cancel
            </Button>

            <LoadingButton
              type='submit'
              variant='contained'
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
