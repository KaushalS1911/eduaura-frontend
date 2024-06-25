import { Helmet } from 'react-helmet-async';

import { useParams } from 'src/routes/hooks';

import  {InquiryEditView}  from 'src/sections/inquiry/view';


// ----------------------------------------------------------------------

export default function InquiryEditPage() {
  
  const params=useParams();
  const {id}=params;


  return (
    <>
      <Helmet>
        <title> Dashboard: Inquiry Edit</title>
      </Helmet>
      
      <InquiryEditView  id={`${id}`}/>
    </>
  );
}
