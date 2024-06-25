import { Helmet } from 'react-helmet-async';

import { InquiryCreateView } from 'src/sections/inquiry/view';


// ----------------------------------------------------------------------

 function InquiryCreatePage() {
  return (
    <>
      <Helmet>
        <title> Dashboard: Create a new Inquiry</title>
      </Helmet>

      <InquiryCreateView />
    </>
  );
}

export default InquiryCreatePage;