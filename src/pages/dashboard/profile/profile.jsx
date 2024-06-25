import { Helmet } from 'react-helmet-async';
import { UserProfileView } from 'src/sections/profile/view';


// ----------------------------------------------------------------------

export default function UserProfile() {
  return (
    <>
      <Helmet>
        <title> Dashboard: User Profile</title>
      </Helmet>

      <UserProfileView />
    </>
  );
}
