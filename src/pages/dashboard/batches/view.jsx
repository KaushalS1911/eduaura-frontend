import React from 'react';
import { Helmet } from 'react-helmet-async';
import { BatchRagisterView } from '../../../sections/batches/view';
import { useParams } from '../../../routes/hooks';

function RegisterView(props) {
  const params = useParams();

  const { id } = params;
  return (
    <>
      <Helmet>
        <title> Dashboard: Register View</title>
      </Helmet>

      <BatchRagisterView registerId={id}/>
    </>
  );
}

export default RegisterView;
