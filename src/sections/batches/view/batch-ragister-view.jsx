import React, { useEffect, useState } from 'react';
import { Card } from '@mui/material';
import { Box } from '@mui/system';
import { useGetConfigs } from '../../../api/config';
import axios from 'axios';
import CustomBreadcrumbs from '../../../components/custom-breadcrumbs';
import { paths } from '../../../routes/paths';
import BatchToolbar from '../register-toolbar';

function BatchRagisterView({ registerId }) {
const [student,setStudent] = useState([])

  useEffect(() => {
    const URL = `https://admin-panel-dmawv.ondigitalocean.app/api/company/batch/${registerId}`;
    axios.get(URL)
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
          {
            name: 'Dashboard',
            href: paths.dashboard.root,
          },
          {
            name: 'Batches',
            href: paths.dashboard.batches.root,
          },
          { name: 'Register' },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />
      <BatchToolbar invoice={student} data1={data} configs={configs} />
      <Card id='attendance' sx={{ padding: '20px',overflowX:'scroll' }}>
        <Box sx={{display:"flex",justifyContent:"space-between"}}>
          <Box>
            <Box sx={{ fontSize: '25px', fontWeight: '800' }}>{configs?.company_details?.name}</Box>
            <Box
              sx={{ mb: '5px' }}>{`${configs?.company_details?.address_1}, ${configs?.company_details?.city}, ${configs?.company_details?.state}, ${configs?.company_details?.country} - ${configs?.company_details?.zipcode}.`}</Box>
          </Box>
          <Box sx={{display:'flex',alignItems:'end',fontSize:14}}>
            <Box sx={{marginRight:5}}>
              <Box>PD : Present Day</Box>
              <Box>AD : Absent Day</Box>
            </Box>
            <Box>
              <Box>TD : Total Day</Box>
              <Box>HL : Holi Day</Box>
            </Box>
          </Box>
        </Box>
        <Box sx={{ display: 'flex' }}>
          <table style={{ border: '1px solid black', width: '500px' }}>
            <tr>
              <td colSpan='3' style={{ padding: '5px' }}>
                <Box sx={{ color: '#6d0000', fontWeight: '700' }}>
                  Medium :
                </Box>
                <Box sx={{
                  display: 'flex',
                  width: '100%',
                  fontSize: '15px',
                  color: '#050568',
                  fontWeight: '700',
                  my: '10px',
                }}>
                  <Box sx={{ width: 140 }}>Standard : </Box>
                  <Box sx={{ marginLeft: '80px' }}>Division : </Box>
                </Box>
                <Box sx={{ display: 'flex', width: '100%', fontSize: '15px', color: 'black', fontWeight: '700' }}>
                  <Box sx={{ width: 140 }}>Month : </Box>
                  <Box sx={{ marginLeft: '80px' }}>Year : </Box>
                </Box>
              </td>
            </tr>
            <tr>
              <th>Roll No</th>
              <th>G.R No</th>
              <th>Student Name</th>
            </tr>
            {student.map((data,index) =>(
              <tr>
                <td style={{ textAlign: 'center' }}>{index+1}</td>
                <td style={{ textAlign: 'center' }}>{data?.enrollment_no}</td>
                <td><Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Box sx={{ marginLeft: '5px' }}>{`${data?.firstName} ${data?.lastName}`}</Box>
                  <Box sx={{ marginRight: '10px' }}>{data?.contact}</Box>
                </Box></td>
              </tr>
            ))}
            <tr>
              <td className='hide'>dd</td>
              <td className='hide'>ddd</td>
              <td className='hide'>dd</td>
            </tr>
            <tr>
              <td className='hide'>dd</td>
              <td className='hide'>ddd</td>
              <td className='hide'>dd</td>
            </tr>



          </table>
          <table style={{ border: '1px solid black', width: '800px' }}>
            <tr style={{ height: '100px' }}>
              {Array(31).fill(null).map((_, index) => (

                <td key={index} style={{ height: 27, width: 25.77, textAlign: 'center' }}>{index + 1}</td>
              ))}
            </tr>
            {Array(student?.length+3).fill(null).map((_, index) => (
              <tr>
                {Array(31).fill(null).map((_, index) => (
                  <td key={index} style={{ height: 27 }}></td>
                ))}
              </tr>
            ))}
          </table>
          <table style={{ border: '1px solid black', width: '300px' }}>
            <tr style={{ height: '100px' }}>
              {data.map((name, index) => (

                <th key={index} style={{ fontSize: '12px', position: 'relative', backgroundColor: 'green !important' }}>
                  <Box >{name}</Box></th>
              ))}
            </tr>
            {Array(student?.length+3).fill(null).map((_, index) => (
              <tr>
                {Array(4).fill(null).map((_, index) => (
                  <td key={index} style={{ height: 27 }}></td>
                ))}
              </tr>
            ))}
          </table>
        </Box>
      </Card>
    </>
  );
}

export default BatchRagisterView;
