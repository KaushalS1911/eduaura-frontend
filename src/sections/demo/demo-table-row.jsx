import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Avatar from '@mui/material/Avatar';
import Collapse from '@mui/material/Collapse';
import MenuItem from '@mui/material/MenuItem';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import IconButton from '@mui/material/IconButton';
import ListItemText from '@mui/material/ListItemText';
import Button from '@mui/material/Button';
import { useBoolean } from 'src/hooks/use-boolean';
import { fDate } from 'src/utils/format-time';
import Label from 'src/components/label';
import Iconify from 'src/components/iconify';
import DemoFormDialog from './demo-form-dialog';
import { useState } from 'react';
import { usePopover } from 'src/components/custom-popover';
import { DeleteDemo } from 'src/api/demo';
import { ConfirmDialog } from 'src/components/custom-dialog';
import moment from 'moment';

export default function DemoTableRow({
                                       row,
                                       selected,
                                       onViewRow,
                                       onSelectRow,
                                       onDeleteRow,
                                       srNumber,
                                       mutate,
                                     }) {
  const [open, setOpen] = useState(false);
  const [demosID, setDemosID] = useState(null);
  const [demoID, setDemoID] = useState(null);
  const { demos, inquiry_id } = row;
  const { firstName, lastName, email, contact } = inquiry_id || {};
  const confirm = useBoolean();
  const collapse = useBoolean();
  const popover = usePopover();

  const handleDelete = async (demoId) => {
    try {
      await DeleteDemo(demoId);
      mutate();
      onDeleteRow(demoId);
      confirm.onFalse();
    } catch (error) {
      console.error('Failed to delete demo:', error);
    }
  };

  const overallStatus = demos.every((item) => item.status === 'Completed')
    ? 'Completed'
    : demos.every((item) => item.status === 'Pending')
      ? 'Pending'
      : demos.every((item) => item.status === 'Cancelled')
        ? 'Cancelled'
        : 'Mixed';

  const renderPrimary = (
    <TableRow hover selected={selected}>
      <TableCell align='center'>{srNumber}</TableCell>
      <TableCell>{`${firstName} ${lastName}`}</TableCell>
      <TableCell>{contact}</TableCell>
      <TableCell>{email}</TableCell>
      <TableCell sx={{ width: 114 }}>
        <Label
          variant='soft'
          color={
            (overallStatus === 'Completed' && 'success') ||
            (overallStatus === 'Pending' && 'warning') ||
            (overallStatus === 'Cancelled' && 'error') ||
            (overallStatus === 'Mixed' && 'info') ||
            'default'
          }
        >
          {overallStatus}
        </Label>
      </TableCell>
      <TableCell align='center' sx={{ px: 3, whiteSpace: 'nowrap' }}>
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
      <TableCell sx={{ p: 0, border: 'none' }} colSpan={8}>
        <Collapse
          in={collapse.value}
          timeout='auto'
          unmountOnExit
          sx={{ bgcolor: 'background.neutral' }}
        >
          <Stack component={Paper} sx={{ m: 1.5 }}>
            {demos.map((item, index) => (
              <Stack
                key={item._id}
                direction='row'
                alignItems='center'
                sx={{
                  px: 1,
                  p: (theme) => theme.spacing(1.5, 2, 1.5, 1.5),
                  '&:not(:last-of-type)': {
                    borderBottom: (theme) =>
                      `solid 2px ${theme.palette.background.neutral}`,
                  },
                }}
              >
                <TableCell sx={{ mr: 3 }}>{index + 1}</TableCell>
                <Avatar
                  src={item?.faculty_id?.avatar_url}
                  variant='circular'
                  sx={{ width: 48, height: 48, mr: 2 }}
                />
                <ListItemText
                  primary={`${item.faculty_id.firstName} ${item.faculty_id.lastName}`}
                  secondary={item.faculty_id.email}
                  primaryTypographyProps={{
                    variant: 'body2',
                  }}
                  secondaryTypographyProps={{
                    component: 'span',
                    color: 'text.disabled',
                    mt: 0.5,
                  }}
                />
                <TableCell>
                  <Box>{item.technology}</Box>
                </TableCell>
                <TableCell>
                  <ListItemText
                    primary={fDate(item.date)}
                    primaryTypographyProps={{ variant: 'body2', noWrap: true }}
                    secondaryTypographyProps={{
                      mt: 0.5,
                      component: 'span',
                      variant: 'caption',
                    }}
                  />
                </TableCell>

                <TableCell sx={{ width: 114 }}>
                  <Label
                    variant='soft'
                    color={
                      (item.status === 'Completed' && 'success') ||
                      (item.status === 'Pending' && 'warning') ||
                      (item.status === 'Cancelled' && 'error') ||
                      'default'
                    }
                  >
                    {item.status}
                  </Label>
                </TableCell>
                <MenuItem>
                  <IconButton
                    color='default'
                    onClick={() => {
                      setOpen(true);
                      setDemosID(row._id);
                      setDemoID(item._id);
                    }}
                  >
                    <Iconify icon='solar:pen-bold' />
                  </IconButton>
                </MenuItem>
                <MenuItem
                  onClick={() => {
                    confirm.onTrue();
                    popover.onClose();
                    setDemosID(row._id);
                    setDemoID(item._id);
                  }}
                >
                  <IconButton color='default'>
                    <Iconify icon='solar:trash-bin-trash-bold' />
                  </IconButton>
                </MenuItem>
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
      <ConfirmDialog
        open={confirm.value}
        onClose={confirm.onFalse}
        title='Delete Demo'
        content='Are you sure you want to delete selected demo?'
        action={
          <Button
            variant='contained'
            color='error'
            onClick={() => handleDelete(demoID)}
          >
            Delete
          </Button>
        }
      />
      <DemoFormDialog
        open={open}
        setOpen={setOpen}
        demosID={demosID}
        demoID={demoID}
        mutate={mutate}
      />
    </>
  );
}

DemoTableRow.propTypes = {
  row: PropTypes.object.isRequired,
  selected: PropTypes.bool,
  onViewRow: PropTypes.func,
  onSelectRow: PropTypes.func,
  onDeleteRow: PropTypes.func,
  srNumber: PropTypes.number,
};
