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
import FeesInvoicePDF from './fees-invoice-pdf';

// ----------------------------------------------------------------------

export default function InvoiceToolbar({
  invoice,
  currentStatus,
  statusOptions,
  onChangeStatus,
  invoiceDetails,
  config,
}) {
  const router = useRouter();

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
              <FeesInvoicePDF
                config={config}
                invoice={invoice}
                currentStatus={currentStatus}
                invoiceDetails={invoiceDetails}
              />
            }
            fileName={invoice?._id}
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
          {/* <Tooltip title="Print">
            <IconButton>
              <Iconify icon="solar:printer-minimalistic-bold" />
            </IconButton>
          </Tooltip> */}
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
              <FeesInvoicePDF
                config={config}
                invoice={invoice}
                currentStatus={currentStatus}
                invoiceDetails={invoiceDetails}
              />
            </PDFViewer>
          </Box>
        </Box>
      </Dialog>
    </>
  );
}

InvoiceToolbar.propTypes = {
  currentStatus: PropTypes.string,
  invoice: PropTypes.object,
  onChangeStatus: PropTypes.func,
  statusOptions: PropTypes.array,
};
