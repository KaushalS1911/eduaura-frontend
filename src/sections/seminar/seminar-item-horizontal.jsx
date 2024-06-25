import PropTypes from 'prop-types';

import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Avatar from '@mui/material/Avatar';
import MenuItem from '@mui/material/MenuItem';
import IconButton from '@mui/material/IconButton';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';
import { RouterLink } from 'src/routes/components';

import { useResponsive } from 'src/hooks/use-responsive';

import { fDate, fTime } from 'src/utils/format-time';
import { fShortenNumber } from 'src/utils/format-number';

import Label from 'src/components/label';
import Image from 'src/components/image';
import Iconify from 'src/components/iconify';
import TextMaxLine from 'src/components/text-max-line';
import CustomPopover, { usePopover } from 'src/components/custom-popover';

// ----------------------------------------------------------------------

export default function SeminarItemHorizontal({ post }) {
  const popover = usePopover();

  const router = useRouter();

  const smUp = useResponsive('up', 'sm');

  const { attended_role, schedule_by, title, date_time, coverUrl } = post;

  return (
    <>
      <Stack component={Card} direction="row">
        <Stack
          sx={{
            p: (theme) => theme.spacing(3, 3, 2, 3),
          }}
        >
          <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 2 }}>
            <Label variant="soft">{attended_role}</Label>
            <Box>
              <Box component="span" sx={{ typography: 'caption', color: 'text.disabled' }} mx={2}>
                {fDate(date_time)}
              </Box>
              <Box component="span" sx={{ typography: 'caption', color: 'text.disabled' }}>
                {fTime(date_time)}
              </Box>
            </Box>
          </Stack>

          <Stack spacing={1} flexGrow={1}>
            <TextMaxLine variant="subtitle2" line={2}>
              {schedule_by}
            </TextMaxLine>

            <TextMaxLine variant="body2" sx={{ color: 'text.secondary' }}>
              {
                'sdsjkfffffkjffffffffffffffffffff fhjshgjfhgjfshgjsgbns snfjshfjsgnsk njhjsfg nngjsngs n jnvjdbnjfgbjsdfgbjsgbjsfbgs'
              }
            </TextMaxLine>
          </Stack>
        </Stack>

        {smUp && (
          <Box
            sx={{
              width: 180,
              height: 240,
              position: 'relative',
              flexShrink: 0,
              p: 1,
            }}
          >
            <Image
              alt={title}
              src={
                'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTVXKmhslVFKCeoyECJMXMry48tE20Mor5ZDw&s'
              }
              sx={{ height: 1, borderRadius: 1.5 }}
            />
          </Box>
        )}
      </Stack>
    </>
  );
}

SeminarItemHorizontal.propTypes = {
  post: PropTypes.shape({
    author: PropTypes.object,
    coverUrl: PropTypes.string,
    createdAt: PropTypes.oneOfType([PropTypes.string, PropTypes.instanceOf(Date)]),
    description: PropTypes.string,
    publish: PropTypes.string,
    title: PropTypes.string,
    totalComments: PropTypes.number,
    totalShares: PropTypes.number,
    totalViews: PropTypes.number,
  }),
};
