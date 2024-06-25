import PropTypes from 'prop-types';

import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Avatar from '@mui/material/Avatar';
import Divider from '@mui/material/Divider';
import MenuItem from '@mui/material/MenuItem';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import ListItemText from '@mui/material/ListItemText';

import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';

import { fDate } from 'src/utils/format-time';
import { fCurrency } from 'src/utils/format-number';

import Iconify from 'src/components/iconify';
import CustomPopover, { usePopover } from 'src/components/custom-popover';

// ----------------------------------------------------------------------

export default function ExaminationItem({ exam, onView, onEdit, onDelete }) {
  const popover = usePopover();

  const { examTitle, examDate, totalMarks, obtained_marks } = exam;

  return (
    <>
      <Card>
        {/* <IconButton onClick={popover.onOpen} sx={{ position: 'absolute', top: 8, right: 8 }}>
          <Iconify icon="eva:more-vertical-fill" />
        </IconButton> */}
        <Box sx={{ position: 'absolute', top: 20, right: 20 }}>
          <Box sx={{ display: 'flex' , justifyContent: "space-between",alignItems: "center"}}>
            <Typography sx={{ fontSize: '13px', color: 'text.disabled' }}>
              Total Marks :{' '}
            </Typography>
            <Typography sx={{ fontSize: '13px', ml: '5px' }}>{totalMarks}</Typography>
          </Box>
          <Box sx={{ display: 'flex', justifyContent: "space-between",alignItems: "center" }}>
            <Typography sx={{ fontSize: '13px', color: 'text.disabled' }}>
              Obtain Marks :{' '}
            </Typography>
            <Typography sx={{ fontSize: '13px', ml: '5px' }}>{obtained_marks}</Typography>
          </Box>
        </Box>

        <Stack sx={{ p: 3, pb: 2 }}>
          <Avatar
            src="https://multishoring.com/wp-content/uploads/2024/04/JavaScript-Symbol.png"
            alt="image"
            variant="rounded"
            sx={{ width: 48, height: 48, mb: 2 }}
          />

          <ListItemText
            sx={{ mb: 1 }}
            primary={<Link color="inherit">{examTitle}</Link>}
            secondary={`Posted date: ${fDate(examDate)}`}
            primaryTypographyProps={{
              typography: 'subtitle1',
            }}
            secondaryTypographyProps={{
              mt: 1,
              component: 'span',
              typography: 'caption',
              color: 'text.disabled',
            }}
          />

          {/* <Stack
            spacing={0.5}
            direction="row"
            alignItems="center"
            sx={{ color: 'primary.main', typography: 'caption' }}
          >
            <Iconify width={16} icon="solar:users-group-rounded-bold" />3 Candidates
          </Stack> */}
        </Stack>

        <Divider sx={{ borderStyle: 'dashed' }} />

        {/* <Box rowGap={1.5} display="grid" gridTemplateColumns="repeat(2, 1fr)" sx={{ p: 3 }}>
          {[
            {
              label: "experience",
              icon: <Iconify width={16} icon="carbon:skill-level-basic" sx={{ flexShrink: 0 }} />,
            },
            {
              label: "employmentTypes",
              icon: <Iconify width={16} icon="solar:clock-circle-bold" sx={{ flexShrink: 0 }} />,
            },
            {
              label: "salary",
              icon: <Iconify width={16} icon="solar:wad-of-money-bold" sx={{ flexShrink: 0 }} />,
            },
            {
              label: "role",
              icon: <Iconify width={16} icon="solar:user-rounded-bold" sx={{ flexShrink: 0 }} />,
            },
          ].map((item) => (
            <Stack
              key={item.label}
              spacing={0.5}
              flexShrink={0}
              direction="row"
              alignItems="center"
              sx={{ color: 'text.disabled', minWidth: 0 }}
            >
              {item.icon}
              <Typography variant="caption" noWrap>
                {item.label}
              </Typography>
            </Stack>
          ))}
        </Box> */}
      </Card>

      {/* <CustomPopover
        open={popover.open}
        onClose={popover.onClose}
        arrow="right-top"
        sx={{ width: 140 }}
      >
        <MenuItem
          onClick={() => {
            popover.onClose();
            onView();
          }}
        >
          <Iconify icon="solar:eye-bold" />
          View
        </MenuItem>

        <MenuItem
          onClick={() => {
            popover.onClose();
            onEdit();
          }}
        >
          <Iconify icon="solar:pen-bold" />
          Edit
        </MenuItem>

        <MenuItem
          onClick={() => {
            popover.onClose();
            onDelete();
          }}
          sx={{ color: 'error.main' }}
        >
          <Iconify icon="solar:trash-bin-trash-bold" />
          Delete
        </MenuItem>
      </CustomPopover> */}
    </>
  );
}

ExaminationItem.propTypes = {
  job: PropTypes.object,
  onDelete: PropTypes.func,
  onEdit: PropTypes.func,
  onView: PropTypes.func,
};
