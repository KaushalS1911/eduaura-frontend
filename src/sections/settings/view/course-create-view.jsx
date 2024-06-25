import React, { useState } from 'react';
import { TextField, Button, Typography, Grid, Box, Card, CardHeader } from '@mui/material';
import { useGetConfigs } from 'src/api/config';
import axios from 'axios';
import { useAuthContext } from 'src/auth/hooks';
import { useSnackbar } from 'src/components/snackbar';
import Iconify from 'src/components/iconify';
import { Stack } from '@mui/system';

export default function CourseCreatePage() {
  const { user } = useAuthContext();
  const { configs, mutate } = useGetConfigs();
  const [inputVal, setInputVal] = useState('');
  const { enqueueSnackbar } = useSnackbar();

  const handleClick = () => {
    const URL = `${import.meta.env.VITE_AUTH_API}/api/company/${user.company_id}/configs/${configs._id}`;
    const payload = { ...configs, courses: [...configs.courses, inputVal] };
    axios
      .put(URL, payload)
      .then(() => {
        setInputVal('');
        enqueueSnackbar('courses Add Successfully', {
          variant: 'success',
        });
        mutate();
      })
      .catch((err) => console.log(err));
  };

  const handleDelete = (item) => {
    const filteredCourses = configs?.courses.filter((e) => e !== item);
    const apiEndpoint = `${import.meta.env.VITE_AUTH_API}/api/company/${user.company_id}/configs/${configs._id}`;
    const payload = { ...configs, courses: filteredCourses };
    axios
      .put(apiEndpoint, payload)
      .then(() => {
        enqueueSnackbar('courses Delete Successfully', {
          variant: 'success',
        });
        mutate();
      })
      .catch((err) => console.log(err));
  };

  return (
    <>
      <Box
        sx={{
          width: '100%',
          maxWidth: '100%',
          padding: '10px',
        }}
      >
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <CardHeader title="Add Our Courses" />
          </Grid>
          <Grid item md={4} xs={12}>
            <Box
              sx={{
                width: '100%',
                maxWidth: '600px',
                marginBottom: '10px',
                padding: '10px',
              }}
            >
              <Grid item>
                <TextField
                  fullWidth
                  variant="outlined"
                  onChange={(e) => setInputVal(e.target.value)}
                  label="Cources"
                  value={inputVal}
                  sx={{
                    fontSize: '16px',
                  }}
                />
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: '20px' }}>
                  <Button variant="contained" onClick={handleClick}>
                    Add
                  </Button>
                </Box>
              </Grid>
            </Box>
          </Grid>
          <Grid item xs={12} md={8}>
            <Card>
              <Stack spacing={3} sx={{ p: 3 }}>
                <Box
                  columnGap={2}
                  rowGap={2}
                  display="grid"
                  gridTemplateColumns={{
                    xs: 'repeat(1, 1fr)',
                    sm: 'repeat(2, 1fr)',
                  }}
                >
                  {configs?.courses &&
                    configs?.courses.length !== 0 &&
                    configs?.courses.map((course, index) => (
                      <Grid
                        container
                        sx={{
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          width: '100%',
                          boxShadow: 4,
                          borderRadius: 1,
                          p: 2,
                          m: 1,
                        }}
                        key={index}
                      >
                        <Grid item>
                          <Typography sx={{ fontSize: '14px' }}>{course}</Typography>
                        </Grid>
                        <Grid item>
                          <Box
                            sx={{ color: 'error.main', cursor: 'pointer' }}
                            onClick={() => handleDelete(course)}
                          >
                            <Iconify icon="solar:trash-bin-trash-bold" />
                          </Box>
                        </Grid>
                      </Grid>
                    ))}
                </Box>
              </Stack>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </>
  );
}
