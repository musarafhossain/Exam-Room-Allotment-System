'use client';
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { ReactQueryProvider, ReactHotToastProvider, AuthProvider } from 'providers';
import "./globals.css";

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: "#1a73e8",      // academic blue
      light: "#1a73e888",
    },
    secondary: {
      main: "#6c757d",
      light: "#6c757d88",
    },
    success: {
      main: "#4caf50",
      light: "#4caf5088",
    },
    error: {
      main: "#f44336",
      light: "#f4433688",
    },
    warning: {
      main: "#ff9800",
      light: "#ff980088",
    },
    info: {
      main: "#2196f3",
      light: "#2196f388",
    },
    background: {
      default: "#f5f7fa",
      paper: "#ffffff",
    },
    text: {
      primary: "#1c1c1c",
      secondary: "#555",
    },
    divider: "#e0e0e0",
  },
});

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <ReactHotToastProvider>
              <AuthProvider>
                <ReactQueryProvider>
                  {children}
                </ReactQueryProvider>
              </AuthProvider>
            </ReactHotToastProvider>
          </LocalizationProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
