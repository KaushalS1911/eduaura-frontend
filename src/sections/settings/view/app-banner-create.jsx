import {
  Button,
  Card,
  CardContent,
  CardHeader,
  FormControlLabel,
  Grid,
  Switch,
  Typography,
} from '@mui/material';
import { Box } from '@mui/system';
import React, { useCallback, useEffect, useState } from 'react';
import { Upload } from 'src/components/upload';
import { useBoolean } from 'src/hooks/use-boolean';
import axios from 'axios';
import { useAuthContext } from '../../../auth/hooks';
import { enqueueSnackbar } from 'notistack';
import log from 'eslint-plugin-react/lib/util/log';

export default function AppbanerCreate() {
  const preview = useBoolean();

  const [files, setFiles] = useState([]);
  const { user } = useAuthContext();
  const getBanners =() =>{
    axios.get(`${import.meta.env.VITE_AUTH_API}/api/v1/company/${user?.company_id}/app-banner`).then((res) => setFiles([res?.data?.banner_image])).catch((err) => console.log(err))
  }
  useEffect(() => {
    getBanners()
  },[])
  //api/v1/company/cid/f-banner:banner-imag |
  const handleDropMultiFile = useCallback(
    (acceptedFiles) => {
      setFiles([
        ...files,
        ...acceptedFiles.map((newFile) =>
          Object.assign(newFile, {
            preview: URL.createObjectURL(newFile),
          }),
        ),
      ]);
    },
    [files],
  );

  const handleRemoveFile = (inputFile) => {
    const filesFiltered = files.filter((fileFiltered) => fileFiltered !== inputFile);
    setFiles(filesFiltered);
  };

  const handleRemoveAllFiles = () => {
    setFiles([]);
  };
  const handleUpload = () => {
    const formData = new FormData();
    formData.append('banner-image', files[0]);
    axios.post(`${import.meta.env.VITE_AUTH_API}/api/v1/company/${user?.company_id}/app-banner`, formData).then((res) => enqueueSnackbar('Banner Upload Successfully')).catch((err) => 'Something want wrong',{variant:"error"});
  };
  return (
    <>
      <Box
        sx={{
          width: '100%',
          marginBottom: '10px',
          padding: '10px',
        }}
      >
        <Grid container>
          <Grid
            item
            md={4}
            sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}
          >
            <Box>
              <Typography variant='h6' sx={{ mb: 0.5 }}>
                Company's Application Banner
              </Typography>
              <Typography variant='body2' sx={{ color: 'text.secondary' }}>
                Select iamge ...
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} md={8}>
            <Card>
              <CardHeader title='Upload Application Banner' />
              <CardContent>
                <Upload
                  multiple
                  thumbnail={true}
                  files={files}
                  onDrop={handleDropMultiFile}
                  onRemove={handleRemoveFile}
                  onRemoveAll={handleRemoveAllFiles}
                  onUpload={handleUpload}
                  disabled={files[0]?.path}
                />
              </CardContent>
            </Card>
          </Grid>

        </Grid>
      </Box>
    </>
  );
}
