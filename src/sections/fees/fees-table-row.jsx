import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import Collapse from '@mui/material/Collapse';
import MenuItem from '@mui/material/MenuItem';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import IconButton from '@mui/material/IconButton';
import ListItemText from '@mui/material/ListItemText';
import { useBoolean } from 'src/hooks/use-boolean';
import { fDate } from 'src/utils/format-time';
import Label from 'src/components/label';
import Iconify from 'src/components/iconify';
import { ConfirmDialog } from 'src/components/custom-dialog';
import CustomPopover, { usePopover } from 'src/components/custom-popover';
import { useRouter } from 'src/routes/hooks';
import { paths } from 'src/routes/paths';
import { Controller, FormProvider, useForm } from 'react-hook-form';
import { Dialog, DialogActions, DialogContent, DialogTitle, TextField } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { LoadingButton } from '@mui/lab';
import { RHFAutocomplete } from 'src/components/hook-form';
import axios from 'axios';
import moment from 'moment';
import { DatePicker } from '@mui/x-date-pickers';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'srNo', label: '#', width: 88, align: 'center' },
  { id: 'profile', label: 'Installment date' },
  { id: 'enroll', label: 'Amount' },
  { id: 'contact', label: 'Payment date' },
  { id: 'course', label: 'Payment mode' },
  { id: 'installments', label: 'Status' },
  { id: '', label: '' },
];
const PAYMENT_OPTIONS = ['card', 'cash', 'cheque', 'upi'];

export default function FeesTableRow({
                                       row,
                                       index,
                                       selected,
                                       onViewRow,
                                       onSelectRow,
                                       onDeleteRow,
                                       mutate,
                                     }) {
  const { enrollment_no } = row;
  const [deleteInstallmentId, setDeleteInstallmentId] = useState();
  const [singleInstallment, setSingleInstallment] = useState();
  const { profile_pic, course, email, contact, joining_date, firstName, lastName } = row;

  const confirm = useBoolean();
  const dialog = useBoolean();
  const collapse = useBoolean();
  const router = useRouter();
  const popover = usePopover();

  const OPTIONS = [
    { value: 'paid', label: 'Paid' },
    { value: 'pending', label: 'Pending' },
  ];

  const methods = useForm({
    defaultValues: {
      status: '',
      payment_mode: '',
      payment_date: moment().format('YYYY-MM-DD'),
    },
  });

  const {
    reset,
    handleSubmit,
    control,
    setValue,
    formState: { isSubmitting },
  } = methods;

  useEffect(() => {
    const fetchInstallmentId = async () => {
      try {
        if (deleteInstallmentId) {
          const currentStatus = row?.fee_detail?.installments.find(
            (item) => item._id === deleteInstallmentId,
          );
          if (currentStatus) {
            reset({
              status: OPTIONS.find((option) => option.value === currentStatus.status),
              payment_mode: currentStatus?.payment_mode,
              payment_date: currentStatus?.payment_date
                ? new Date(currentStatus?.payment_date)
                : new Date(),
            });
          }
        }
      } catch (err) {
        console.log('ERROR : ', err);
      }
    };
    fetchInstallmentId();
  }, [deleteInstallmentId, reset, row?.fee_detail?.installments]);

  const handleInstallmentDelete = (item) => {
    setDeleteInstallmentId(item._id);
  };

  const onSubmit = handleSubmit(async (data) => {
    console.log(data, 'data');
    try {
      const statusValue = data.status.value;
      await axios.put(
        `${import.meta.env.VITE_AUTH_API}/api/v2/student/${row._id}/installment/${deleteInstallmentId}`,
        { ...data, status: statusValue },
      );
      mutate();
      dialog.onFalse();
      setDeleteInstallmentId('');
    } catch (error) {
      console.error(error);
    }
  });

  const renderPrimary = (
    <TableRow hover selected={selected}>
      <TableCell align='center'>{index + 1}</TableCell>

      <TableCell sx={{ display: 'flex', alignItems: 'center' }}>
        <Avatar alt='error' src={profile_pic} sx={{ mr: 2 }} />

        <ListItemText
          primary={`${firstName} ${lastName}`}
          secondary={email}
          primaryTypographyProps={{ typography: 'body2' }}
          secondaryTypographyProps={{
            component: 'span',
            color: 'text.disabled',
          }}
        />
      </TableCell>

      <TableCell>{enrollment_no}</TableCell>

      <TableCell>{contact}</TableCell>

      <TableCell>{course}</TableCell>

      <TableCell>{moment(joining_date).format('DD/MM/YYYY')}</TableCell>

      <TableCell align='center' sx={{ px: 1, whiteSpace: 'nowrap' }}>
        <IconButton
          color={collapse.value ? 'inherit' : 'default'}
          onClick={collapse.onToggle}
          sx={{
            ...(collapse.value && {
              bgcolor: 'action.hover',
            }),
          }}
        >
          <Iconify icon='eva:arrow-ios-downward-fill' />
        </IconButton>
      </TableCell>
    </TableRow>
  );

  const renderSecondary = (
    <TableRow>
      <TableCell sx={{ p: 0, border: 'none' }} colSpan={9}>
        <Collapse
          in={collapse.value}
          timeout='auto'
          unmountOnExit
          sx={{ bgcolor: 'background.neutral' }}
        >
          <Stack component={Paper} sx={{ m: 1.5 }}>
            {row?.fee_detail?.installments?.map((item, index) => (
              <Stack
                key={index}
                direction='row'
                alignItems='center'
                sx={{
                  display: 'flex',
                  justifyContent: 'space-around',
                  p: (theme) => theme.spacing(1.5, 2, 1.5, 1.5),
                  '&:not(:last-of-type)': {
                    borderBottom: (theme) => `solid 2px ${theme.palette.background.neutral}`,
                  },
                }}
              >
                <TableCell>{index + 1}</TableCell>
                <TableCell sx={{ width: 140 }}>
                  {moment(item.installment_date).format('DD/MM/YYYY')}
                </TableCell>
                <TableCell sx={{ width: 126 }}>{item.amount}</TableCell>
                <TableCell sx={{ width: 140 }}>
                  {item.payment_date == null ? '-' : moment(item.payment_date).format('DD/MM/YYYY')}
                </TableCell>

                <TableCell sx={{ width: 68 }}>{item.payment_mode}</TableCell>
                <TableCell sx={{ width: 68 }}>
                  <Label
                    variant='soft'
                    color={
                      (item.status === 'paid' && 'success') ||
                      (item.status === 'pending' && 'warning') ||
                      (item.status === 'unpaid' && 'error') ||
                      'default'
                    }
                  >
                    {item.status}
                  </Label>
                </TableCell>
                <TableCell>
                  <IconButton
                    color={popover.open ? 'inherit' : 'default'}
                    onClick={(e) => {
                      popover.onOpen(e),
                        handleInstallmentDelete(item),
                        setSingleInstallment(item._id);
                    }}
                  >
                    <Iconify icon='eva:more-vertical-fill' />
                  </IconButton>
                </TableCell>
              </Stack>
            ))}
          </Stack>
        </Collapse>
      </TableCell>
    </TableRow>
  );

  return (
    <>
      {renderPrimary}

      {renderSecondary}

      <CustomPopover
        open={popover.open}
        onClose={popover.onClose}
        arrow='right-top'
        sx={{ width: 140 }}
      >
        <MenuItem
          onClick={() => {
            dialog.onTrue();
            popover.onClose();
          }}
        >
          <Iconify icon='solar:pen-bold' />
          Edit
        </MenuItem>
        <MenuItem
          onClick={() => {
            router.push(paths.dashboard.general.feesInvoice(row._id, singleInstallment));
            popover.onClose();
          }}
        >
          <Iconify icon='solar:eye-bold' />
          Invoice
        </MenuItem>
      </CustomPopover>

      <ConfirmDialog
        open={confirm.value}
        onClose={confirm.onFalse}
        title='Delete'
        content='Are you sure want to delete?'
        action={
          <Button variant='contained' color='error' onClick={onDeleteRow}>
            Delete
          </Button>
        }
      />
      {dialog.value && (
        <Dialog
          fullWidth
          maxWidth={false}
          open={dialog.value}
          onClose={dialog.onFalse}
          PaperProps={{
            sx: { maxWidth: 720 },
          }}
        >
          <FormProvider {...methods}>
            <form onSubmit={onSubmit}>
              <DialogTitle sx={{ fontSize: '25px !important' }}>Update Status</DialogTitle>

              <DialogContent>
                <Box sx={{ mt: 1 }}>
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
                    value={methods.watch('status')}
                    onChange={(_, newValue) => methods.setValue('status', newValue)}
                  />
                  <RHFAutocomplete
                    sx={{ my: 3 }}
                    name='payment_mode'
                    label='Payment Mode'
                    placeholder='Choose a Payment Mode'
                    fullWidth
                    options={PAYMENT_OPTIONS}
                    getOptionLabel={(option) => option}
                    value={methods.watch('payment_mode') || 'card'}
                    onChange={(_, newValue) => methods.setValue('payment_mode', newValue)}
                  />
                  <Stack spacing={1.5}>
                    <Controller
                      name='payment_date'
                      control={control}
                      render={({ field, fieldState: { error } }) => (
                        <DatePicker
                          {...field}
                          value={field.value}
                          onChange={(newDate) => {
                            setValue('payment_date', newDate);
                            field.onChange(newDate);
                          }}
                          format='dd/MM/yyyy'
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
                </Box>
              </DialogContent>

              <DialogActions>
                <Button variant='outlined' onClick={dialog.onFalse}>
                  Cancel
                </Button>

                <LoadingButton type='submit' variant='contained' loading={isSubmitting}>
                  Update
                </LoadingButton>
              </DialogActions>
            </form>
          </FormProvider>
        </Dialog>
      )}
    </>
  );
}

FeesTableRow.propTypes = {
  row: PropTypes.object,
  selected: PropTypes.bool,
  onViewRow: PropTypes.func,
  onDeleteRow: PropTypes.func,
  onSelectRow: PropTypes.func,
};
