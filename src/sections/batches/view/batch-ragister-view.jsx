import React, { useEffect, useState } from 'react';
import { Card, Box, Grid } from '@mui/material';
import { useGetConfigs } from '../../../api/config';
import axios from 'axios';
import CustomBreadcrumbs from '../../../components/custom-breadcrumbs';
import { paths } from '../../../routes/paths';
import BatchToolbar from '../register-toolbar';

function BatchRagisterView({ registerId }) {
  const [student, setStudent] = useState([]);

  useEffect(() => {
    const URL = `https://admin-panel-dmawv.ondigitalocean.app/api/company/batch/${registerId}`;
    axios
      .get(URL)
      .then((resp) => setStudent(resp.data.data.batch.batch_members))
      .catch((err) => console.log(err));
  }, [registerId]);

  const { configs } = useGetConfigs();
  const data = ['PD', `AD`, 'TD', 'HL'];

  return (
    <>
      <CustomBreadcrumbs
        heading="Edit"
        links={[
          { name: 'Dashboard', href: paths.dashboard.root },
          { name: 'Batches', href: paths.dashboard.batches.root },
          { name: 'Register' },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />
      <BatchToolbar invoice={student} data1={data} configs={configs} />
      <Card id="attendance" sx={{ p: 3, overflowX: 'auto', minWidth: '300px' }}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <Box>
              <Box sx={{ fontSize: '25px', fontWeight: '800' }}>
                {configs?.company_details?.name}
              </Box>
              <Box sx={{ mb: 2 }}>
                {`${configs?.company_details?.address_1}, ${configs?.company_details?.city}, ${configs?.company_details?.state}, ${configs?.company_details?.country} - ${configs?.company_details?.zipcode}.`}
              </Box>
            </Box>
          </Grid>
          <Grid item xs={12} sm={6} container alignItems="flex-end" justifyContent="flex-end">
            <Box sx={{ display: 'flex', fontSize: 14 }}>
              <Box sx={{ mr: 5 }}>
                <Box>PD : Present Day</Box>
                <Box>AD : Absent Day</Box>
              </Box>
              <Box>
                <Box>TD : Total Day</Box>
                <Box>HL : Holi Day</Box>
              </Box>
            </Box>
          </Grid>
        </Grid>
        <Box sx={{ display: 'flex', flexDirection: 'column', mt: 2 }}>
          <table style={{ border: '1px solid black', width: '100%', marginBottom: '16px' }}>
            <thead>
              <tr>
                <th>Roll No</th>
                <th>G.R No</th>
                <th>Student Name</th>
              </tr>
            </thead>
            <tbody>
              {student.map((data, index) => (
                <tr key={index}>
                  <td style={{ textAlign: 'center' }}>{index + 1}</td>
                  <td style={{ textAlign: 'center' }}>{data?.enrollment_no}</td>
                  <td>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Box sx={{ ml: 1 }}>{`${data?.firstName} ${data?.lastName}`}</Box>
                      <Box sx={{ mr: 2 }}>{data?.contact}</Box>
                    </Box>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <Box sx={{ display: 'flex', overflowX: 'auto' }}>
            <table style={{ border: '1px solid black', minWidth: '800px', marginRight: '16px' }}>
              <thead>
                <tr>
                  {Array.from({ length: 31 }, (_, index) => (
                    <th key={index} style={{ textAlign: 'center' }}>
                      {index + 1}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {Array.from({ length: student.length + 3 }).map((_, rowIndex) => (
                  <tr key={rowIndex}>
                    {Array.from({ length: 31 }).map((_, cellIndex) => (
                      <td key={cellIndex} style={{ height: 27 }}></td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
            <table style={{ border: '1px solid black', minWidth: '300px' }}>
              <thead>
                <tr>
                  {data.map((name, index) => (
                    <th
                      key={index}
                      style={{
                        fontSize: '12px',
                        position: 'relative',
                        backgroundColor: 'green !important',
                      }}
                    >
                      <Box>{name}</Box>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {Array.from({ length: student.length + 3 }).map((_, rowIndex) => (
                  <tr key={rowIndex}>
                    {Array.from({ length: 4 }).map((_, cellIndex) => (
                      <td key={cellIndex} style={{ height: 27 }}></td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </Box>
        </Box>
      </Card>
    </>
  );
}

export default BatchRagisterView;
