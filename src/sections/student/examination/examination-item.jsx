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
import { ExamImage } from '../../../_mock/_inquiry';

// ----------------------------------------------------------------------

export default function ExaminationItem({ exam, onView, onEdit, onDelete }) {
  const popover = usePopover();

  const { examTitle, examDate, totalMarks, obtained_marks } = exam;
  const image = ExamImage(examTitle);
  return (
    <>
      <Card>
        <Box sx={{ position: 'absolute', top: 20, right: 20 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography sx={{ fontSize: '13px', color: 'text.disabled' }}>
              Total Marks :{' '}
            </Typography>
            <Typography sx={{ fontSize: '13px', ml: '5px' }}>{totalMarks}</Typography>
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography sx={{ fontSize: '13px', color: 'text.disabled' }}>
              Obtain Marks :{' '}
            </Typography>
            <Typography sx={{ fontSize: '13px', ml: '5px' }}>{obtained_marks}</Typography>
          </Box>
        </Box>

        <Stack sx={{ p: 3, pb: 2 }}>
          <Avatar
            src={examTitle}
            alt={examTitle}
            sx={{
              width: 48, height: 48,
              margin: '0px 5px',
              border: (theme) => `solid 2px ${theme.palette.background.default}`,
            }}
          >
            {examTitle.charAt(0).toUpperCase()}
          </Avatar>
          <ListItemText
            sx={{ mb: 1, mt: 3 }}
            primary={<Link color='inherit'>{examTitle}</Link>}
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
        </Stack>
        <Divider sx={{ borderStyle: 'dashed' }} />
      </Card>
    </>
  );
}

ExaminationItem.propTypes = {
  job: PropTypes.object,
  onDelete: PropTypes.func,
  onEdit: PropTypes.func,
  onView: PropTypes.func,
};
