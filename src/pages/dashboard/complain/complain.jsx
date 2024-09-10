import Container from '@mui/material/Container';

import { useSettingsContext } from 'src/components/settings';
import ComplainListing from '../../../sections/complain/complain-listing';


// ----------------------------------------------------------------------

export default function StudentComplainCreateView() {
  const settings = useSettingsContext();

  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      <ComplainListing />
    </Container>
  );
}
