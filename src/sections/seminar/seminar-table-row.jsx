import PropTypes from 'prop-types';

import {
  Box,
  Button,
  MenuItem,
  TableRow,
  TableCell,
  IconButton,
  Tooltip,
  Avatar,
  Table,
} from '@mui/material';
import Collapse from '@mui/material/Collapse';
import { useBoolean } from 'src/hooks/use-boolean';
import { fDate } from 'src/utils/format-time';
import Paper from '@mui/material/Paper';

import Iconify from 'src/components/iconify';
import { ConfirmDialog } from 'src/components/custom-dialog';
import CustomPopover, { usePopover } from 'src/components/custom-popover';
import { Stack } from '@mui/system';
import { TableHeadCustom } from 'src/components/table';

export default function SeminarTableRow({
  row,
  index,
  selected,
  onEditRow,
  onSelectRow,
  onDeleteRow,
}) {
  const { title, desc, date_time, schedule_by, attended_by } = row;

  const confirm = useBoolean();
  const popover = usePopover();
  const collapse = useBoolean();

  const TABLE_HEAD = [
    { id: 'srNo', label: 'Sr No', width: '280px', align: 'center' },
    { id: 'Image', label: 'image', width: '295px', align: 'center' },
    { id: 'Role', label: 'Role', width: '295px', align: 'center' },
    { id: ' Name', label: ' Name', width: '295px', align: 'center' },
    { id: 'Contact', label: 'Contact', width: '295px', align: 'center' },
    { id: 'email', label: 'Email', width: '295px', align: 'center' },
  ];

  return (
    <>
      <TableRow hover selected={selected}>
        <TableCell>{index + 1}</TableCell>

        <TableCell>{title}</TableCell>

        <TableCell> {desc} </TableCell>
        <TableCell align="center">{fDate(date_time)}</TableCell>

        <TableCell align="center"> {`${schedule_by.firstName} ${schedule_by.lastName}`} </TableCell>

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

        <TableCell align="center" sx={{ px: 1, whiteSpace: 'nowrap' }}>
          <IconButton color={popover.open ? 'inherit' : 'default'} onClick={popover.onOpen}>
            <Iconify icon="eva:more-vertical-fill" />
          </IconButton>
        </TableCell>
      </TableRow>

      <TableRow>
        <TableCell sx={{ p: 0, border: 'none' }} colSpan={8}>
          <Collapse
            in={collapse.value}
            timeout="auto"
            unmountOnExit
            sx={{ bgcolor: 'background.neutral' }}
          >
            <Table sx={{ width: '100%', display: 'unset' }}>
              <TableHeadCustom headLabel={TABLE_HEAD} />
              <Stack component={Paper} sx={{ m: 1.5 }}>
                {attended_by.map((item, index) => (
                  <Stack
                    key={item.id}
                    direction="row"
                    alignItems="center"
                    sx={{
                      p: (theme) => theme.spacing(1.5, 2, 1.5, 1.5),
                      '&:not(:last-of-type)': {
                        borderBottom: (theme) => `solid 2px ${theme.palette.background.neutral}`,
                      },
                    }}
                  >
                    <TableCell sx={{ width: '100%' }} align="center">
                      {index + 1}
                    </TableCell>
                    <TableCell sx={{ width: '100%' }} align="center">
                      <Avatar
                        src={item.avatar_url}
                        variant="rounded"
                        sx={{ width: 50, height: 50, m: 'auto' }}
                      />
                    </TableCell>

                    <TableCell sx={{ width: '100%' }} align="center">
                      {item.role}
                    </TableCell>
                    <TableCell sx={{ width: '100%' }} align="center">
                      {item.firstName + ' ' + item.lastName}
                    </TableCell>
                    <TableCell sx={{ width: '100%' }} align="center">
                      {item.contact}
                    </TableCell>
                    <TableCell sx={{ width: '100%' }} align="center">
                      {item.email}
                    </TableCell>
                  </Stack>
                ))}
              </Stack>
            </Table>
          </Collapse>
        </TableCell>
      </TableRow>

      <CustomPopover
        open={popover.open}
        onClose={popover.onClose}
        arrow="right-top"
        sx={{ width: 140 }}
      >
        <MenuItem
          onClick={() => {
            confirm.onTrue();
            popover.onClose();
          }}
          sx={{ color: 'error.main' }}
        >
          <Iconify icon="solar:trash-bin-trash-bold" />
          Delete
        </MenuItem>

        <MenuItem
          onClick={() => {
            onEditRow();
            popover.onClose();
          }}
        >
          <Iconify icon="solar:eye-bold" />
          Edit
        </MenuItem>
      </CustomPopover>

      <ConfirmDialog
        open={confirm.value}
        onClose={confirm.onFalse}
        title="Delete"
        content="Are you sure you want to delete?"
        action={
          <Button variant="contained" color="error" onClick={onDeleteRow}>
            Delete
          </Button>
        }
      />
    </>
  );
}

SeminarTableRow.propTypes = {
  row: PropTypes.shape({
    title: PropTypes.string.isRequired,
    desc: PropTypes.string.isRequired,
    date_time: PropTypes.string.isRequired,
    schedule_by: PropTypes.shape({
      firstName: PropTypes.string.isRequired,
      lastName: PropTypes.string.isRequired,
    }).isRequired,
    attended_by: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.string.isRequired,
        role: PropTypes.string.isRequired,
        firstName: PropTypes.string.isRequired,
      })
    ).isRequired,
  }).isRequired,
  index: PropTypes.number.isRequired,
  selected: PropTypes.bool.isRequired,
  onEditRow: PropTypes.func.isRequired,
  onDeleteRow: PropTypes.func.isRequired,
  onSelectRow: PropTypes.func.isRequired,
};
