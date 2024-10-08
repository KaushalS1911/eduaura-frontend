/* eslint-disable perfectionist/sort-imports */


// i18n
import 'src/locales/i18n';

// ----------------------------------------------------------------------

import Router from 'src/routes/sections';

import ThemeProvider from 'src/theme';

import { LocalizationProvider } from 'src/locales';

import { useScrollToTop } from 'src/hooks/use-scroll-to-top';

import ProgressBar from 'src/components/progress-bar';
import { MotionLazy } from 'src/components/animate/motion-lazy';
import SnackbarProvider from 'src/components/snackbar/snackbar-provider';
import { SettingsDrawer, SettingsProvider } from 'src/components/settings';

// import { CheckoutProvider } from 'src/sections/checkout/context';
import { AuthProvider } from './auth/context/jwt';

export default function App() {
  useScrollToTop();

  return (

    <AuthProvider>
        <LocalizationProvider>
          <SettingsProvider
            defaultSettings={{
              themeMode: 'light', // 'light' | 'dark'
              themeDirection: 'ltr', //  'rtl' | 'ltr'
              themeContrast: 'default', // 'default' | 'bold'
              themeLayout: 'vertical', // 'vertical' | 'horizontal' | 'mini'
              themeColorPresets: 'default', // 'default' | 'cyan' | 'purple' | 'blue' | 'orange' | 'red'
              themeStretch: false,
            }}
          >
            <ThemeProvider>
              <MotionLazy>
                <SnackbarProvider>
                  {/* <CheckoutProvider> */}
                    <SettingsDrawer />
                    <ProgressBar />
                    <Router />
                  {/* </CheckoutProvider> */}
                </SnackbarProvider>
              </MotionLazy>
            </ThemeProvider>
          </SettingsProvider>
        </LocalizationProvider>
    </AuthProvider>
  );
}
