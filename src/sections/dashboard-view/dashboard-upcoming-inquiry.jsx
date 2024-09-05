import PropTypes from 'prop-types';

import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import Tooltip from '@mui/material/Tooltip';
import IconButton from '@mui/material/IconButton';
import CardHeader from '@mui/material/CardHeader';
import ListItemText from '@mui/material/ListItemText';

import Iconify from 'src/components/iconify';
import { useRouter } from 'src/routes/hooks';
import { paths } from 'src/routes/paths';
import { Box } from '@mui/system';
import Label from '../../components/label';

// ----------------------------------------------------------------------

export default function DashboardUpcomingInquiry({ title, subheader, list, ...other }) {
  console.log(list);
  const router = useRouter();
  return (
    <Card {...other}>
      <CardHeader
        title={title}
        subheader={subheader}
        action={
          <Button
            onClick={() => router.push(paths.dashboard.inquiry.root)}
            size='small'
            color='inherit'
            endIcon={<Iconify icon='eva:arrow-ios-forward-fill' width={18} sx={{ ml: -0.5 }} />}
          >
            View All
          </Button>
        }
      />

      <Stack spacing={3} sx={{ p: 3 }}>
        {list.map((contact) => (
          <Stack direction='row' alignItems='center' key={contact.id}>
            <Avatar src={contact?.firstName} sx={{ width: 48, height: 48, mr: 2 }}>
              {contact?.firstName?.charAt(0).toUpperCase()}
            </Avatar>
            <ListItemText
              primary={`${contact?.firstName} ${contact?.lastName}`}
              secondary={contact?.remark}
            />
            <Box sx={{ fontSize: '15px',margin:"0px 10px" }}>
              <Label
                variant='soft'
                color={
                  (contact.status === 'Active' && 'success') ||
                  (contact.status === 'In Active' && 'error') ||
                  'default'
                }
              >
                {contact.status}
              </Label>
            </Box>
            <Box sx={{ fontSize: '15px' }}>{contact?.contact}</Box>
          </Stack>
        ))}
      </Stack>
    </Card>
  );
}

DashboardUpcomingInquiry.propTypes = {
  list: PropTypes.array,
  subheader: PropTypes.string,
  title: PropTypes.string,
};
