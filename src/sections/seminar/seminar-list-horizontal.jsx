import PropTypes from 'prop-types';

import Box from '@mui/material/Box';
import Pagination, { paginationClasses } from '@mui/material/Pagination';

import { SeminarItemSkeleton } from './seminar-skeleton';
import SeminarItemHorizontal from './seminar-item-horizontal';

// ----------------------------------------------------------------------

export default function SeminarListHorizontal({ posts, loading }) {
  const renderList = (
    <>
      {posts.map((post) => (
        <SeminarItemHorizontal key={post.id} post={post} />
      ))}
    </>
  );

  return (
    <>
      <Box
        gap={3}
        display="grid"
        gridTemplateColumns={{
          xs: 'repeat(1, 1fr)',
          md: 'repeat(2, 1fr)',
        }}
      >
        {loading ? renderSkeleton : renderList}
      </Box>

      {posts.length > 8 && (
        <Pagination
          count={8}
          sx={{
            mt: 8,
            [`& .${paginationClasses.ul}`]: {
              justifyContent: 'center',
            },
          }}
        />
      )}
    </>
  );
}

SeminarListHorizontal.propTypes = {
  loading: PropTypes.bool,
  posts: PropTypes.array,
};
