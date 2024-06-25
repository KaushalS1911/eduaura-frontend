import {
  Card,
  CardContent,
  CardHeader,
  FormControlLabel,
  Grid,
  Switch,
  Typography,
} from '@mui/material';
import { Box } from '@mui/system';
import React, { useCallback, useState } from 'react';
import { Upload } from 'src/components/upload';
import { useBoolean } from 'src/hooks/use-boolean';

export default function AppbanerCreate() {
  const preview = useBoolean();

  const [files, setFiles] = useState([]);

  const handleDropMultiFile = useCallback(
    (acceptedFiles) => {
      setFiles([
        ...files,
        ...acceptedFiles.map((newFile) =>
          Object.assign(newFile, {
            preview: URL.createObjectURL(newFile),
          })
        ),
      ]);
    },
    [files]
  );

  const handleRemoveFile = (inputFile) => {
    const filesFiltered = files.filter((fileFiltered) => fileFiltered !== inputFile);
    setFiles(filesFiltered);
  };

  const handleRemoveAllFiles = () => {
    setFiles([]);
  };
  const handleUpload = () => {
    console.log(files[0],"files");
  }
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
              <Typography variant="h6" sx={{ mb: 0.5 }}>
                Company's Application  Banner
              </Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
               Select iamge ...
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} md={8}>
            <Card>
              <CardHeader title="Upload Application Banner" />
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
