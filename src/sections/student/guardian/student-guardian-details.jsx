import PropTypes from 'prop-types';
import { useState, useCallback } from 'react';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import IconButton from '@mui/material/IconButton';
import CardHeader from '@mui/material/CardHeader';
import { useBoolean } from 'src/hooks/use-boolean';
import Iconify from 'src/components/iconify';
import CustomPopover, { usePopover } from 'src/components/custom-popover';
import GuardianAddForm from './guardian-add-form';
import GuardianItem from './guardian-item';
import axios from 'axios';

// ----------------------------------------------------------------------

export default function StudentGuardianDetails({ currentStudent, mutate }) {
  const [addressId, setAddressId] = useState('');
  const [editAddressId, setEditAddressId] = useState(null);
  const popover = usePopover();
  const [deletedGuardian, setDeletedGuardian] = useState(null);
  const [updateGuardian, setUpdateGuardian] = useState();
  const GuardianNewForm = useBoolean();

  const handleAddNewAddress = useCallback((address) => {
    console.info('address', address);
  }, []);

  const handleSelectedId = useCallback(
    (id) => {
      setAddressId(id);
      const filteredGuardian = currentStudent?.guardian_detail?.filter((item) => item._id !== id);
      const URL = `https://server-eduaura-pyjuy.ondigitalocean.app/api/v2/student/${currentStudent?._id}`;
      try {
        axios
          .put(URL, { guardian_detail: filteredGuardian })
          .then((res) => mutate(), setDeletedGuardian(null))
          .catch((err) => console.log(err));
      } catch (error) {
        console.error(error);
      }
    },
    [popover],
  );

  const handleClose = useCallback(() => {
    popover.onClose();
    setAddressId('');
  }, [popover]);

  const handleEdit = useCallback(() => {
    setEditAddressId(addressId);
    GuardianNewForm.onTrue();
    handleClose();
  }, [addressId, GuardianNewForm, handleClose]);

  return (
    <>
      <Card>
        <CardHeader
          title='Guardian Details'
          action={
            <Button
              size='small'
              color='primary'
              startIcon={<Iconify icon='mingcute:add-line' />}
              onClick={() => {
                setUpdateGuardian(undefined);
                setEditAddressId(null);
                GuardianNewForm.onTrue();
              }}
            >
              Guardian
            </Button>
          }
        />
        <Stack spacing={2.5} sx={{ p: 3 }}>
          {currentStudent?.guardian_detail?.map((item) => (
            <GuardianItem
              variant='outlined'
              key={item.id}
              guardian={item}
              action={
                <>
                  <IconButton
                    onClick={(event) => {
                      popover.onOpen(event);
                      setUpdateGuardian(item);
                      setDeletedGuardian(item._id);
                    }}
                    sx={{ position: 'absolute', top: 8, right: 8 }}
                  >
                    <Iconify icon='eva:more-vertical-fill' />
                  </IconButton>
                </>
              }
              sx={{
                p: 2.5,
                borderRadius: 1,
              }}
            />
          ))}
        </Stack>
      </Card>
      <CustomPopover open={popover.open} onClose={handleClose}>
        <MenuItem onClick={handleEdit}>
          <Iconify icon='solar:pen-bold' />
          Edit
        </MenuItem>
        <MenuItem
          onClick={() => {
            handleSelectedId(deletedGuardian);
            handleClose();
          }}
          sx={{ color: 'error.main' }}
        >
          <Iconify icon='solar:trash-bin-trash-bold' />
          Delete
        </MenuItem>
      </CustomPopover>
      <GuardianAddForm
        mutate={mutate}
        open={GuardianNewForm.value}
        onClose={GuardianNewForm.onFalse}
        onCreate={handleAddNewAddress}
        addressId={editAddressId}
        currentStudent={currentStudent}
        updateGuardian={updateGuardian}
      />
    </>
  );
}

StudentGuardianDetails.propTypes = {
  addressBook: PropTypes.array,
};

StudentGuardianDetails.defaultProps = {
  addressBook: [],
};
