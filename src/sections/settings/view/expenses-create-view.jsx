import React, { useState } from 'react';
import { TextField, Button, Typography, Grid, Box, Card, CardHeader } from '@mui/material';
import { useGetConfigs } from 'src/api/config';
import axios from 'axios';
import { useAuthContext } from 'src/auth/hooks';
import { useSnackbar } from 'src/components/snackbar';
import Iconify from 'src/components/iconify';
import { Stack } from '@mui/system';
import { useResponsive } from 'src/hooks/use-responsive';

export default function ExpenseCreatePage() {
  const { user } = useAuthContext();
  const { configs, mutate } = useGetConfigs();


  const [inputVal, setInputVal] = useState('');
  const { enqueueSnackbar } = useSnackbar();

  const handleClick = () => {
    const URL = `${import.meta.env.VITE_AUTH_API}/api/company/${user.company_id}/configs/${configs._id}`;
    const payload = {
      ...configs,
      expenses: [...configs.expenses, inputVal],
    };
    axios
      .put(URL, payload)
      .then(() => {
        setInputVal('');
        enqueueSnackbar('Expenses Add Successfully', {
          variant: 'success',
        });
        mutate();
      })
      .catch((err) => console.log(err));
  };

  const handleDelete = (item) => {
    const filteredExpenses = configs.expenses.filter((e) => e !== item);
    const apiEndpoint = `${import.meta.env.VITE_AUTH_API}/api/company/${user.company_id}/configs/${configs._id}`;
    const payload = { ...configs, expenses: filteredExpenses };
    axios
      .put(apiEndpoint, payload)
      .then(() => {
        enqueueSnackbar('Expenses Delete Successfully', {
          variant: 'success',
        });
        mutate();
      })
      .catch((err) => console.log(err));
  };

  return (
   
    <>
      <Box sx={{ width: '100%', maxWidth: '100%', padding: '10px' }}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <CardHeader title="Add Our Expenses" />
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
                  label="Expenses"
                  value={inputVal}
                  sx={{
                    fontSize: '16px',
                  }}
                />
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: '20px' }}>
                  <Button
                    variant="contained"
                    // color="primary"
                    onClick={handleClick}
                  >
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
                    md: 'repeat(2, 1fr)',
                  }}
                >
                  {configs?.expenses &&
                    configs?.expenses.length !== 0 &&
                    configs?.expenses.map((expense, index) => (
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
                          <Typography sx={{ fontSize: '14px' }}>{expense}</Typography>
                        </Grid>
                        <Grid item>
                          <Box
                            sx={{ color: 'error.main', cursor: 'pointer' }}
                            onClick={() => handleDelete(expense)}
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
