import PropTypes from 'prop-types';

import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Unstable_Grid2';

import Iconify from 'src/components/iconify';

import SeminarItem from './seminar-item';
import {SeminarItemSkeleton} from './seminar-skeleton';

// ----------------------------------------------------------------------

export default function SeminarList({ posts, loading, disabledIndex }) {
  const renderSkeleton = (
    <>
      {[...Array(16)].map((_, index) => (
        <Grid key={index} xs={12} sm={6} md={3}>
          <SeminarItemSkeleton />
        </Grid>
      ))}
    </>
  );

  const renderList = (
    <>
      {posts.map((post, index) => (
        <Grid key={post.id} xs={12} sm={6} md={!disabledIndex && index === 0 ? 6 : 3}>
          <SeminarItem post={post} index={!disabledIndex ? index : undefined} />
        </Grid>
      ))}
    </>
  );

  return (
    <>
      <Grid container spacing={3}>
        {loading ? renderSkeleton : renderList}
      </Grid>

      {posts.length > 8 && (
        <Stack
          alignItems="center"
          sx={{
            mt: 8,
            mb: { xs: 10, md: 15 },
          }}
        >
          <Button
            size="large"
            variant="outlined"
            startIcon={<Iconify icon="svg-spinners:12-dots-scale-rotate" width={24} />}
          >
            Load More
          </Button>
        </Stack>
      )}
    </>
  );
}

SeminarList.propTypes = {
  disabledIndex: PropTypes.bool,
  loading: PropTypes.bool,
  posts: PropTypes.array,
};
