import {
  Button,
  Card,
  CardHeader,
  Grid,
  MenuItem,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableRow,
  Typography,
} from '@mui/material';
import React, { useCallback, useState } from 'react';
import CustomPopover, { usePopover } from 'src/components/custom-popover';
import Iconify from 'src/components/iconify';
import { TableHeadCustom } from 'src/components/table';
import IconButton from '@mui/material/IconButton';
import { useBoolean } from 'src/hooks/use-boolean';
import { useGetSingleStudent, useGetStudents } from 'src/api/student';
import { Box, Stack } from '@mui/system';
import AddRemarkForm from '../view/remarks/add-remark-form';
import { fDate } from 'src/utils/format-time';
import axios from 'axios';

const RemarkListView = ({ currentStudent, mutate }) => {
  const popover = usePopover();

  const RemarkNewForm = useBoolean(false);
  const confirm = useBoolean();

  const handleAddNewAddress = useCallback((address) => {
    console.info('address', address);
  }, []);

  const TABLE_DATA = [
    { date: '22/2/2222', title: 'Ac is Not working properly' },
    { date: '22/2/2222', title: 'Ac is Not working properly' },
    { date: '22/2/2222', title: 'Ac is Not working properly' },
    { date: '22/2/2222', title: 'Ac is Not working properly' },
  ];
  const handleDelete = (id) => {
    const filteredRemarks = currentStudent?.remarks?.filter((item) => item._id !== id);

    const URL = `https://admin-panel-dmawv.ondigitalocean.app/api/v2/student/${currentStudent?._id}`;
    try {
      axios
        .put(URL, { ...currentStudent, remarks: filteredRemarks })
        .then((res) => mutate())
        .catch((err) => console.log(err));
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <Card spacing={2.5}>
        <CardHeader
          title="Remarks"
          action={
            <Button
              size="small"
              color="primary"
              startIcon={<Iconify icon="mingcute:add-line" />}
              onClick={() => {
                //   setEditAddressId(null);
                RemarkNewForm.onTrue();
              }}
            >
              Remark
            </Button>
          }
        />
        <Stack sx={{ mt: '20px' }}>
          <Table>
            <Stack spacing={2.5} sx={{ p: 3 }}>
              {currentStudent?.remarks?.map((item) => (
                <Stack
                  component={Paper}
                  spacing={2}
                  alignItems={{ md: 'flex-end' }}
                  direction={{ xs: 'column', md: 'row' }}
                  sx={{
                    position: 'relative',
                    border: '1px solid rgba(145, 158, 171, 0.2)',
                    p: 2.5,
                    borderRadius: 1,
                  }}
                >
                  <Stack flexGrow={1} spacing={1} variant="outlined">
                    <Stack direction="row" alignItems="center">
                      <Typography variant="subtitle2">{item.title}</Typography>
                    </Stack>

                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                      {fDate(item.date)}
                    </Typography>
                  </Stack>
                  <IconButton
                    color={popover.open ? 'inherit' : 'default'}
                    onClick={() => handleDelete(item._id)}
                    sx={{ position: 'absolute', top: 8, right: 8 }}
                  >
                    <Iconify icon="solar:trash-bin-trash-bold" />
                  </IconButton>
                </Stack>
              ))}
            </Stack>
          </Table>
        </Stack>
      </Card>
      <AddRemarkForm
        open={RemarkNewForm.value}
        onClose={RemarkNewForm.onFalse}
        currentStudent={currentStudent}
      />
    </>
  );
};

export default RemarkListView;
