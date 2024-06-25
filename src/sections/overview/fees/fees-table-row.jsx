import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import Collapse from '@mui/material/Collapse';
import MenuItem from '@mui/material/MenuItem';
import TableRow from '@mui/material/TableRow';
import Checkbox from '@mui/material/Checkbox';
import TableCell from '@mui/material/TableCell';
import IconButton from '@mui/material/IconButton';
import ListItemText from '@mui/material/ListItemText';
import { useBoolean } from 'src/hooks/use-boolean';
import { fCurrency } from 'src/utils/format-number';
import { fDate, fTime } from 'src/utils/format-time';
import Label from 'src/components/label';
import Iconify from 'src/components/iconify';
import { ConfirmDialog } from 'src/components/custom-dialog';
import CustomPopover, { usePopover } from 'src/components/custom-popover';
import { useRouter } from 'src/routes/hooks';
import { paths } from 'src/routes/paths';
import { FormProvider, useForm, Controller } from 'react-hook-form';
import { Alert, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import { useEffect, useMemo, useState } from 'react';
import { LoadingButton } from '@mui/lab';
import { RHFAutocomplete, RHFTextField } from 'src/components/hook-form';
import axios from 'axios';

// ----------------------------------------------------------------------

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
  const {
    profile_pic,
    course,
    student_name,
    student_email,
    contact,
    joining_date,
    firstName,
    lastName,
  } = row;

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
    },
  });

  const {
    reset,
    handleSubmit,
    control,
    formState: { isSubmitting },
  } = methods;

  useEffect(() => {
    const fetchInstallmentId = async () => {
      try {
        if (deleteInstallmentId) {
          const currentStatus = row?.fee_detail?.installments.find(
            (item) => item._id === deleteInstallmentId
          );
          if (currentStatus) {
            reset({
              status: OPTIONS.find((option) => option.value === currentStatus.status),
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
    try {
      const statusValue = data.status.value;
      await axios.put(
        `${import.meta.env.VITE_AUTH_API}/api/v2/student/${row._id}/installment/${deleteInstallmentId}`,
        { ...data, status: statusValue }
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
      <TableCell align={"center"}>
        <Box
          onClick={onViewRow}
          sx={{
            cursor: 'pointer',
            '&:hover': {
              textDecoration: 'underline',
            },
          }}
        >
          {index + 1}
        </Box>
      </TableCell>

      <TableCell sx={{ display: 'flex', alignItems: 'center' }}>
        <Avatar alt="error" src={profile_pic} sx={{ mr: 2 }} />

        <ListItemText
          primary={student_name}
          secondary={student_email}
          primaryTypographyProps={{ typography: 'body2' }}
          secondaryTypographyProps={{
            component: 'span',
            color: 'text.disabled',
          }}
        />
      </TableCell>

      <TableCell>
        <ListItemText
          primary={enrollment_no}
          primaryTypographyProps={{ typography: 'body2', noWrap: true }}
          secondaryTypographyProps={{
            mt: 0.5,
            component: 'span',
            typography: 'caption',
          }}
        />
      </TableCell>

      <TableCell align="center">
        <ListItemText
          primary={`${firstName} ${lastName}`}
          primaryTypographyProps={{ typography: 'body2' }}
          secondaryTypographyProps={{
            component: 'span',
            color: 'text.disabled',
          }}
        />
      </TableCell>

      <TableCell align="center">
        <ListItemText
          primary={course}
          primaryTypographyProps={{ typography: 'body2' }}
          secondaryTypographyProps={{
            component: 'span',
            color: 'text.disabled',
          }}
        />{' '}
      </TableCell>

      <TableCell>
        <ListItemText
          primary={fDate(joining_date)}
          primaryTypographyProps={{ typography: 'body2', noWrap: true }}
          secondaryTypographyProps={{
            mt: 0.5,
            component: 'span',
            typography: 'caption',
          }}
        />
      </TableCell>

      <TableCell>
        <ListItemText
          primary={contact}
          primaryTypographyProps={{ typography: 'body2', noWrap: true }}
          secondaryTypographyProps={{
            mt: 0.5,
            component: 'span',
            typography: 'caption',
          }}
        />
      </TableCell>

      <TableCell align="center" sx={{ px: 1, whiteSpace: 'nowrap' }}>
        <IconButton
          color={collapse.value ? 'inherit' : 'default'}
          onClick={collapse.onToggle}
          sx={{
            ...(collapse.value && {
              bgcolor: 'action.hover',
            }),
          }}
        >
          <Iconify icon="eva:arrow-ios-downward-fill" />
        </IconButton>
      </TableCell>
    </TableRow>
  );

  const renderSecondary = (
    <TableRow>
      <TableCell sx={{ p: 0, border: 'none' }} colSpan={9}>
        <Collapse
          in={collapse.value}
          timeout="auto"
          unmountOnExit
          sx={{ bgcolor: 'background.neutral' }}
        >
          <Stack component={Paper} sx={{ m: 1.5 }}>
            {row?.fee_detail?.installments?.map((item, index) => (
              <Stack
                key={index}
                direction="row"
                alignItems="center"
                sx={{
                  display: 'flex',
                  justifyContent: 'space-around',
                  p: (theme) => theme.spacing(1.5, 2, 1.5, 1.5),
                  '&:not(:last-of-type)': {
                    borderBottom: (theme) => `solid 2px ${theme.palette.background.neutral}`,
                  },
                }}
              >
                <Box
                  sx={{
                    cursor: 'pointer',
                    '&:hover': {
                      textDecoration: 'underline',
                    },
                  }}
                >
                  {index + 1}
                </Box>

                <Box sx={{ width: 110, textAlign: 'right' }}>
                  {fDate(item.installment_date, 'dd MMM yyyy')}
                </Box>
                <Box sx={{ width: 110, textAlign: 'right' }}>{item.amount}</Box>
                <Box sx={{ width: 110, textAlign: 'right' }}>
                  {item.payment_date == null ? '-' : fDate(item.payment_date, 'dd MMM yyyy')}
                </Box>

                <Box sx={{ width: 110, textAlign: 'right' }}>{item.payment_mode}</Box>
                <Box sx={{ width: 110, textAlign: 'right' }}>
                  <Label
                    variant="soft"
                    color={
                      (item.status === 'paid' && 'success') ||
                      (item.status === 'pending' && 'warning') ||
                      (item.status === 'unpaid' && 'error') ||
                      'default'
                    }
                  >
                    {item.status}
                  </Label>
                </Box>
                <Box>
                  <IconButton
                    color={popover.open ? 'inherit' : 'default'}
                    onClick={(e) => {
                      popover.onOpen(e), handleInstallmentDelete(item);
                    }}
                  >
                    <Iconify icon="eva:more-vertical-fill" />
                  </IconButton>
                </Box>
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
        arrow="right-top"
        sx={{ width: 140 }}
      >
        {/* <MenuItem
          onClick={() => {
            confirm.onTrue();
            popover.onClose();
          }}
          sx={{ color: 'error.main' }}
        >
          <Iconify icon="solar:trash-bin-trash-bold" />
          Delete
        </MenuItem> */}

        <MenuItem
          onClick={() => {
            dialog.onTrue();
            popover.onClose();
          }}
        >
          <Iconify icon="solar:pen-bold" />
          Edit
        </MenuItem>
        <MenuItem
          onClick={() => {
            router.push(paths.dashboard.general.feesInvoice);
            popover.onClose();
          }}
        >
          <Iconify icon="solar:eye-bold" />
          Invoice
        </MenuItem>
      </CustomPopover>

      <ConfirmDialog
        open={confirm.value}
        onClose={confirm.onFalse}
        title="Delete"
        content="Are you sure want to delete?"
        action={
          <Button variant="contained" color="error" onClick={onDeleteRow}>
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
                <Box>
                  <RHFAutocomplete
                    name="status"
                    label="Status"
                    options={OPTIONS}
                    getOptionLabel={(option) => option.label}
                    isOptionEqualToValue={(option, value) => option.value === value.value}
                    renderOption={(props, option) => (
                      <li {...props} key={option.value}>
                        {option.label}
                      </li>
                    )}
                    // Ensure the value is correctly set to the status
                    value={methods.watch('status')}
                    onChange={(_, newValue) => methods.setValue('status', newValue)}
                  />
                </Box>
              </DialogContent>

              <DialogActions>
                <Button variant="outlined" onClick={dialog.onFalse}>
                  Cancel
                </Button>

                <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
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
