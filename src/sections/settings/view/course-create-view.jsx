import React, { useState } from 'react';
import {
  TextField,
  Button,
  Typography,
  Grid,
  Box,
  Card,
  CardHeader,
  IconButton,
} from '@mui/material';
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
  const [subCategoryVal, setSubCategoryVal] = useState('');
  const [subCategories, setSubCategories] = useState([]);
  const { enqueueSnackbar } = useSnackbar();

  const handleAddCourse = () => {
    if (subCategories.length === 0) {
      enqueueSnackbar('Please add at least one subcategory before submitting.', { variant: 'warning' });
      return;
    }
    const newCourse = { name: inputVal, subcategories: subCategories };
    const URL = `${import.meta.env.VITE_AUTH_API}/api/company/${user?.company_id}/configs/${configs?._id}`;
    const payload = { ...configs, courses: [...configs.courses, newCourse] };
    axios
      .put(URL, payload)
      .then(() => {
        setInputVal('');
        setSubCategories([]);
        enqueueSnackbar('Course added successfully', { variant: 'success' });
        mutate();
      })
      .catch((err) => console.log(err));
  };

  const handleDeleteCourse = (course) => {
    const filteredCourses = configs?.courses.filter((e) => e.name !== course.name);
    const apiEndpoint = `${import.meta.env.VITE_AUTH_API}/api/company/${user?.company_id}/configs/${configs?._id}`;
    const payload = { ...configs, courses: filteredCourses };
    axios
      .put(apiEndpoint, payload)
      .then(() => {
        enqueueSnackbar('Course deleted successfully', { variant: 'success' });
        mutate();
      })
      .catch((err) => console.log(err));
  };

  const handleAddSubCategory = () => {
    setSubCategories([...subCategories, subCategoryVal]);
    setSubCategoryVal('');
  };

  return (
    <Box sx={{ width: '100%', maxWidth: '100%', padding: '10px' }}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <CardHeader title='Add Our Courses' />
        </Grid>
        <Grid item md={4} xs={12}>
          <Box sx={{ width: '100%', maxWidth: '600px', marginBottom: '10px', padding: '10px' }}>
            <Grid item>
              <TextField
                fullWidth
                variant='outlined'
                onChange={(e) => setInputVal(e.target.value)}
                label='Course Name'
                value={inputVal}
                sx={{ fontSize: '16px' }}
              />
              <TextField
                fullWidth
                variant='outlined'
                onChange={(e) => setSubCategoryVal(e.target.value)}
                label='Subcategory'
                value={subCategoryVal}
                sx={{ fontSize: '16px', mt: 2 }}
              />
              <Box display={'flex'} justifyContent={'space-between'}>
                <Button variant='contained' onClick={handleAddSubCategory} sx={{ mt: 2 }}>
                  Add Subcategory
                </Button>
                <Box>
                  <Button variant='contained' onClick={handleAddCourse} sx={{ mt: 2 }}>
                    Add Course
                  </Button>
                </Box>
              </Box>
              <Box sx={{ mt: 2 }}>
                <Card>
                  <Box p={2}>
                    <Typography mb={1} sx={{ fontSize: '14px', fontWeight: '900' }}>
                      Subcategory
                    </Typography>
                    {subCategories.map((sub, index) => (
                      <Typography key={index}>
                        {index + 1}. {sub}
                      </Typography>
                    ))}
                  </Box>
                </Card>
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
                display='grid'
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
                      <Typography mt={1} mb={2} sx={{ fontSize: '16px', fontWeight: '900' }}>
                        {course?.name}
                      </Typography>
                      {course?.subcategories?.map((sub, idx) => (
                        <Typography key={idx} sx={{ fontSize: '16px' }}>
                          - {sub}
                        </Typography>
                      ))}
                    </Grid>
                    <Grid item>
                      <IconButton
                        sx={{ color: 'error.main' }}
                        onClick={() => handleDeleteCourse(course)}
                      >
                        <Iconify icon='solar:trash-bin-trash-bold' />
                      </IconButton>
                    </Grid>
                  </Grid>
                ))}
              </Box>
            </Stack>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}
