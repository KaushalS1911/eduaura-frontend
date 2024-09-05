import React, { useState } from 'react';
import {
  Button,
  Typography,
  Grid,
  Box,
  Card,
  CardHeader,
  Switch,
  FormControlLabel,
  Checkbox,
} from '@mui/material';
import { useGetConfigs } from 'src/api/config';
import { Stack } from '@mui/system';
import { useForm, FormProvider, Controller } from 'react-hook-form';
import { RHFAutocomplete } from '../../../components/hook-form';

const modules = [
  { name: 'Dashboard' },
  { name: 'Account' },
  { name: 'Visit', permission: ['can Update', 'can Add', 'can Delete'] },
  { name: 'Inquiry', permission: ['can Update', 'can Add', 'can Delete'] },
  { name: 'Demo', permission: ['can Update', 'can Add', 'can Delete'] },
  { name: 'Student', permission: ['can Update', 'can Add', 'can Delete'] },
  { name: 'Employee', permission: ['can Update', 'can Add', 'can Delete'] },
  { name: 'Batches', permission: ['can Update', 'can Add', 'can Delete'] },
  { name: 'Attendance', permission: ['can Update', 'can Add', 'can Delete'] },
  { name: 'Exam', permission: ['can Update', 'can Add', 'can Delete'] },
  { name: 'Seminar', permission: ['can Update', 'can Add', 'can Delete'] },
  { name: 'Fees', permission: ['can Update', 'can Add', 'can Delete'] },
  { name: 'Expenses', permission: ['can Update', 'can Add', 'can Delete'] },
  { name: 'Calendar', permission: ['can Update', 'can Add', 'can Delete'] },
  { name: 'Task', permission: ['can Update', 'can Add', 'can Delete'] },
  { name: 'Complaints', permission: ['can Update', 'can Add', 'can Delete'] },
  { name: 'Setting' },
];

export default function PermissionView() {
  const methods = useForm();
  const { configs } = useGetConfigs();
  const [selectedRole, setSelectedRole] = useState(null);
  const [moduleSwitchState, setModuleSwitchState] = useState({});

  const handleRoleChange = (event, value) => {
    setSelectedRole(value);
  };

  const handleSwitchChange = (moduleName, checked) => {
    setModuleSwitchState(prevState => ({
      ...prevState,
      [moduleName]: checked,
    }));
  };

  const handleReset = () => {
    methods.reset(); // Reset the form to initial values
    setSelectedRole(null); // Reset the selected role
    setModuleSwitchState({}); // Reset the switch states
  };

  const handleSave = (data) => {
    console.log('Form Data:', data);
  };

  return (
    <FormProvider {...methods}>
      <Box sx={{ width: '100%', maxWidth: '100%', padding: '10px' }}>
        <Grid container spacing={3}>
          <Grid item xs={12} display={'flex'} justifyContent={'space-between'}>
            <Box>
              <CardHeader title={'Permission'} sx={{ padding: '0px' }} />
            </Box>
            <Box sx={{ width: '250px' }}>
              <RHFAutocomplete
                name='course'
                label='Roles'
                placeholder='Choose a Role'
                options={configs?.roles?.map((course) => course)}
                isOptionEqualToValue={(option, value) => option === value}
                onChange={handleRoleChange} // Set the role value in state
              />
            </Box>
          </Grid>

          <Grid item xs={12} md={12}>
            <Card>
              <Stack spacing={3} sx={{ p: 3 }}>
                <Box
                  columnGap={2}
                  rowGap={2}
                  display='grid'
                  gridTemplateColumns={{
                    xs: 'repeat(1, 1fr)',
                    sm: 'repeat(3, 1fr)',
                  }}
                >
                  {modules.map((module, index) => (
                    <Grid
                      container
                      sx={{
                        width: '100%',
                        height: (!module.permission) ? '70px' : 'auto',
                        boxShadow: 4,
                        borderRadius: 1,
                        p: 2,
                        m: 1,
                      }}
                      key={index}
                    >
                      <Grid item xs={12} display='flex' alignItems='start' justifyContent='space-between'>
                        <Typography mt={1} mb={2} sx={{ fontSize: '16px', fontWeight: '900' }}>
                          {module.name}
                        </Typography>
                        <Controller
                          name={`${module.name}.moduleSwitch`}
                          control={methods.control}
                          render={({ field }) => (
                            <FormControlLabel
                              control={
                                <Switch
                                  {...field}
                                  checked={moduleSwitchState[module.name] || false}
                                  onChange={(e) => {
                                    const checked = e.target.checked;
                                    field.onChange(checked);
                                    handleSwitchChange(module.name, checked);
                                  }}
                                />
                              }
                              sx={{ margin: '0px' }}
                              label=''
                            />
                          )}
                        />
                      </Grid>
                      {module.permission && (
                        module.permission.map((Per, idx) => (
                          <Grid item xs={12} key={idx}>
                            <FormControlLabel
                              control={
                                <Controller
                                  name={`${module.name}.${Per}`}
                                  control={methods.control}
                                  render={({ field }) => (
                                    <Checkbox
                                      {...field}
                                      checked={field.value || false}
                                      disabled={!moduleSwitchState[module.name]}
                                    />
                                  )}
                                />
                              }
                              label={Per}
                            />
                          </Grid>
                        ))
                      )}
                    </Grid>
                  ))}
                </Box>
                <Stack direction='row' spacing={2} justifyContent='flex-end'>
                  <Button variant='contained' onClick={handleReset}>
                    Reset
                  </Button>
                  <Button variant='contained' onClick={methods.handleSubmit(handleSave)}>
                    Save
                  </Button>
                </Stack>
              </Stack>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </FormProvider>
  );
}
