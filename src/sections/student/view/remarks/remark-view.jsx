import { Container } from '@mui/system';
import React from 'react'
import { useSettingsContext } from 'src/components/settings';
import RemarkListView from '../../remark/remark-list-view';

const RemarkView = ({ currentStudent , mutate}) => {
  const settings = useSettingsContext();
  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      <RemarkListView currentStudent={currentStudent} mutate={mutate} />
    </Container>
  );
};

export default RemarkView