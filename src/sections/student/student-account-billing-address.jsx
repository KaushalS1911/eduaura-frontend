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

// import { AddressNewForm } from '../address';
import GuardianAddForm from './guardian/guardian-add-form';
import GuardianItem from './guardian/guardian-item';

// ----------------------------------------------------------------------

export default function StudentAccountBillingAddress({ addressBook = [] }) {
  const [addressId, setAddressId] = useState('');
  const [editAddressId, setEditAddressId] = useState(null);

  const popover = usePopover();

  const GuardianNewForm = useBoolean();

  const handleAddNewAddress = useCallback((address) => {
    console.info('ADDRESS', address);
  }, []);

  const handleSelectedId = useCallback(
    (event, id) => {
      popover.onOpen(event);
      setAddressId(id);
    },
    [popover]
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
          title="Guardian Details"
          action={
            <Button
              size="small"
              color="primary"
              startIcon={<Iconify icon="mingcute:add-line" />}
              onClick={() => {
                setEditAddressId(null);
                GuardianNewForm.onTrue();
              }}
            >
              Guardian
            </Button>
          }
        />

        <Stack spacing={2.5} sx={{ p: 3 }}>
          {addressBook.map((address) => (
            <GuardianItem
              variant="outlined"
              key={address.id}
              address={address}
              action={
                <IconButton
                  onClick={(event) => {
                    handleSelectedId(event, `${address.id}`);
                  }}
                  sx={{ position: 'absolute', top: 8, right: 8 }}
                >
                  <Iconify icon="eva:more-vertical-fill" />
                </IconButton>
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
          <Iconify icon="solar:pen-bold" />
          Edit
        </MenuItem>

        <MenuItem
          onClick={() => {
            handleClose();
            console.info('DELETE', addressId);
          }}
          sx={{ color: 'error.main' }}
        >
          <Iconify icon="solar:trash-bin-trash-bold" />
          Delete
        </MenuItem>
      </CustomPopover>

      <GuardianAddForm
        open={GuardianNewForm.value}
        onClose={GuardianNewForm.onFalse}
        onCreate={handleAddNewAddress}
        addressId={editAddressId}
      />
    </>
  );
}

StudentAccountBillingAddress.propTypes = {
  addressBook: PropTypes.array,
};

StudentAccountBillingAddress.defaultProps = {
  addressBook: [],
};
