import { Helmet } from 'react-helmet-async';
import { ProfileEditView } from 'src/sections/profile/view';

// ----------------------------------------------------------------------

export default function UserEditProfile() {
  return (
    <>
      <Helmet>
        <title> Dashboard: User Edit Profile</title>
      </Helmet>

      <ProfileEditView />
    </>
  );
}
