import PropTypes from 'prop-types';
import { useCallback } from 'react';
import { PDFViewer, PDFDownloadLink } from '@react-pdf/renderer';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import DialogActions from '@mui/material/DialogActions';
import CircularProgress from '@mui/material/CircularProgress';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { useBoolean } from 'src/hooks/use-boolean';

import Iconify from 'src/components/iconify';
import ExamOverviewPDF from './exam-overview-pdf';

// ----------------------------------------------------------------------

export default function ExamToolbar({
  examData,
  calculatePercentage,
  calculateResult,
  calculateGrade,
  passFailCount,
  gradeSummary,
  configs,
  rankedStudents,
  calculateAveragePercentage,
}) {
  const view = useBoolean();

  return (
    <>
      <Stack
        spacing={3}
        direction={{ xs: 'column', sm: 'row' }}
        alignItems={{ xs: 'flex-end', sm: 'center' }}
        sx={{ mb: { xs: 3, md: 5 } }}
      >
        <Stack direction="row" spacing={1} flexGrow={1} sx={{ width: 1 }}>
          <Tooltip title="View">
            <IconButton onClick={view.onTrue}>
              <Iconify icon="solar:eye-bold" />
            </IconButton>
          </Tooltip>
          <PDFDownloadLink
            document={
              <ExamOverviewPDF
                examData={examData}
                calculatePercentage={calculatePercentage}
                calculateResult={calculateResult}
                calculateGrade={calculateGrade}
                passFailCount={passFailCount}
                gradeSummary={gradeSummary}
                configs={configs}
                rankedStudents={rankedStudents}
                calculateAveragePercentage={calculateAveragePercentage}
              />
            }
            fileName={examData?._id}
            style={{ textDecoration: 'none' }}
          >
            {({ loading }) => (
              <Tooltip title="Download">
                <IconButton>
                  {loading ? (
                    <CircularProgress size={24} color="inherit" />
                  ) : (
                    <Iconify icon="eva:cloud-download-fill" />
                  )}
                </IconButton>
              </Tooltip>
            )}
          </PDFDownloadLink>
        </Stack>
      </Stack>

      <Dialog fullScreen open={view.value}>
        <Box sx={{ height: 1, display: 'flex', flexDirection: 'column' }}>
          <DialogActions
            sx={{
              p: 1.5,
            }}
          >
            <Button color="inherit" variant="contained" onClick={view.onFalse}>
              Close
            </Button>
          </DialogActions>
          <Box sx={{ flexGrow: 1, height: 1, overflow: 'hidden' }}>
            <PDFViewer width="100%" height="100%" style={{ border: 'none' }}>
              <ExamOverviewPDF
                examData={examData}
                calculatePercentage={calculatePercentage}
                calculateResult={calculateResult}
                calculateGrade={calculateGrade}
                passFailCount={passFailCount}
                gradeSummary={gradeSummary}
                configs={configs}
                rankedStudents={rankedStudents}
                calculateAveragePercentage={calculateAveragePercentage}
              />
            </PDFViewer>
          </Box>
        </Box>
      </Dialog>
    </>
  );
}

ExamToolbar.propTypes = {
  currentStatus: PropTypes.string,
  student: PropTypes.object,
  onChangeStatus: PropTypes.func,
  statusOptions: PropTypes.array,
};
