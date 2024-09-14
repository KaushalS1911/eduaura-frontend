import PropTypes from 'prop-types';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import MenuItem from '@mui/material/MenuItem';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import IconButton from '@mui/material/IconButton';
import ListItemText from '@mui/material/ListItemText';
import { useBoolean } from 'src/hooks/use-boolean';
import Label from 'src/components/label';
import Iconify from 'src/components/iconify';
import CustomPopover, { usePopover } from 'src/components/custom-popover';
import moment from 'moment';
import { Dialog, DialogActions, DialogContent, DialogTitle, Box } from '@mui/material';
import { FormProvider, useForm } from 'react-hook-form';
import { LoadingButton } from '@mui/lab';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { RHFAutocomplete } from '../../components/hook-form';
import { useSnackbar } from 'notistack';
import { useAuthContext } from '../../auth/hooks';
import { useGetConfigs } from '../../api/config';
import { getResponsibilityValue } from '../../permission/permission';

// ----------------------------------------------------------------------

export default function ComplainTableRow({
                                           row,
                                           selected,
                                           onSelectRow,
                                           onViewRow,
                                           onEditRow,
                                           index,
                                           mutate,
                                           onDeleteRow,
                                         }) {
  const { date, title, status, student } = row;
  const { configs } = useGetConfigs();
  const { user } = useAuthContext();
  const confirm = useBoolean();
  const dialog = useBoolean();
  const popover = usePopover();
  const { enqueueSnackbar } = useSnackbar();
  const [complainId, setComplainId] = useState();

  const methods = useForm({
    defaultValues: {
      status: row.status || null,
    },
  });

  const { handleSubmit, setValue, reset } = methods;
  const OPTIONS = [
    { value: 'completed', label: 'Completed' },
    { value: 'pending', label: 'Pending' },
    { value: 'cancel', label: 'Cancel' },
  ];

  useEffect(() => {
    if (dialog.value) {
      reset({
        status: OPTIONS.find(option => option.value === row.status),
      });
    }
  }, [dialog.value, row.status, reset]);

  const onSubmit = handleSubmit(async (data) => {
    try {
      const response = await axios.put(
        `https://admin-panel-dmawv.ondigitalocean.app/api/v2/complain/${complainId}`,
        { status: data.status.value },
      );
      enqueueSnackbar(response?.message || 'Status Updated Successfully', { variant: 'success' });
      dialog.onFalse();
      mutate();
    } catch (error) {
      console.error('Failed to update status:', error);
      enqueueSnackbar('Failed to update status', { variant: 'error' });
    }
  });

  const handleDelete = async () => {
    try {
      const response = await axios.delete(
        `https://admin-panel-dmawv.ondigitalocean.app/api/v2/complain/${complainId}`,
      );
      enqueueSnackbar(response?.message || 'Complain Deleted Successfully', { variant: 'success' });
      confirm.onFalse();
      mutate();
    } catch (error) {
      console.error('Failed to delete complain:', error);
      enqueueSnackbar('Failed to delete complain', { variant: 'error' });
    }
  };

  return (
    <TableRow key={index}>
      <TableCell>{index + 1}</TableCell>
      <TableCell sx={{ display: 'flex', alignItems: 'center' }}>
        <Avatar
          alt={`${student?.firstName} ${student?.lastName}`}
          src={student?.profile_pic}
          sx={{ mr: 2 }}
        />
        <ListItemText
          primary={`${student?.firstName} ${student?.lastName}`}
          secondary={student?.email}
          primaryTypographyProps={{ typography: 'body2' }}
          secondaryTypographyProps={{
            component: 'span',
            color: 'text.disabled',
          }}
        />
      </TableCell>
      <TableCell>{moment(date).format('DD/MM/YYYY')}</TableCell>
      <TableCell>{title}</TableCell>
      <TableCell>
        <Label
          variant='soft'
          color={
            (status === 'completed' && 'success') ||
            (status === 'pending' && 'warning') ||
            (status === 'cancel' && 'error') ||
            'default'
          }
        >
          {status}
        </Label>
      </TableCell>
      <TableCell align='right' sx={{ px: 1, whiteSpace: 'nowrap' }}>
        <IconButton color={popover.open ? 'inherit' : 'default'} onClick={(e) => {
          popover.onOpen(e);
          setComplainId(row._id);
        }}>
          <Iconify icon='eva:more-vertical-fill' />
        </IconButton>
      </TableCell>
      <CustomPopover
        open={popover.open}
        onClose={popover.onClose}
        arrow='right-top'
        sx={{ width: 'auto' }}
      >
        {getResponsibilityValue('delete_complaint', configs, user) && <MenuItem
          onClick={() => {
            confirm.onTrue();
            popover.onClose();
          }}
          sx={{ color: 'error.main' }}
        >
          <Iconify icon='solar:trash-bin-trash-bold' />
          Delete
        </MenuItem>}
        {getResponsibilityValue('update_complaint', configs, user) && <MenuItem
          onClick={() => {
            dialog.onTrue();
            popover.onClose();
          }}
        >
          <Iconify icon='solar:pen-bold' />
          Edit
        </MenuItem>}
      </CustomPopover>
      {dialog.value && (
        <Dialog
          fullWidth
          maxWidth='sm'
          open={dialog.value}
          onClose={dialog.onFalse}
          PaperProps={{
            sx: { maxWidth: 720 },
          }}
        >
          <DialogTitle sx={{ fontSize: '25px !important' }}>Update Status</DialogTitle>
          <FormProvider {...methods}>
            <form onSubmit={handleSubmit(onSubmit)}>
              <DialogContent>
                <Box sx={{ margin: '10px 0px' }}>
                  <RHFAutocomplete
                    name='status'
                    label='Status'
                    options={OPTIONS}
                    getOptionLabel={(option) => option.label}
                    isOptionEqualToValue={(option, value) => option.value === value.value}
                    renderOption={(props, option) => (
                      <li {...props} key={option.value}>
                        {option.label}
                      </li>
                    )}
                    onChange={(_, newValue) => setValue('status', newValue)}
                  />
                </Box>
              </DialogContent>
              <DialogActions>
                <Button onClick={dialog.onFalse}>Cancel</Button>
                <LoadingButton type='submit' variant='contained'>
                  Update
                </LoadingButton>
              </DialogActions>
            </form>
          </FormProvider>
        </Dialog>
      )}
      {confirm.value && (
        <Dialog
          open={confirm.value}
          onClose={confirm.onFalse}
          aria-labelledby='alert-dialog-title'
          aria-describedby='alert-dialog-description'
        >
          <DialogTitle id='alert-dialog-title'>Confirm Delete</DialogTitle>
          <DialogContent>
            <Box sx={{ margin: '10px 0px' }}>
              Are you sure you want to delete this complain?
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={confirm.onFalse}>Cancel</Button>
            <LoadingButton
              onClick={handleDelete}
              variant='contained'
            >
              Delete
            </LoadingButton>
          </DialogActions>
        </Dialog>
      )}
    </TableRow>
  );
}

ComplainTableRow.propTypes = {
  onDeleteRow: PropTypes.func,
  onEditRow: PropTypes.func,
  onSelectRow: PropTypes.func,
  onViewRow: PropTypes.func,
  row: PropTypes.object,
  selected: PropTypes.bool,
};
