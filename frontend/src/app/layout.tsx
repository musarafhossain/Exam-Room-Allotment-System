'use client';
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { ReactQueryProvider, ReactHotToastProvider } from 'providers';
import "./globals.css";

const theme = createTheme({
  defaultColorScheme: 'light',
  colorSchemes: {
    light: {
      palette: {
        mode: 'light',

        primary: {
          main: "#1a73e8",      // academic blue
          light: "#1a73e888",
          lighter: "#1a73e833",
        },
        secondary: {
          main: "#6c757d",
          light: "#6c757d88",
          lighter: "#6c757d33",
        },

        success: {
          main: "#4caf50",
          light: "#4caf5088",
          lighter: "#4caf5033",
        },
        error: {
          main: "#f44336",
          light: "#f4433688",
          lighter: "#f4433633",
        },
        warning: {
          main: "#ff9800",
          light: "#ff980088",
          lighter: "#ff980033",
        },
        info: {
          main: "#2196f3",
          light: "#2196f388",
          lighter: "#2196f333",
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
    },

    dark: {
      palette: {
        mode: 'dark',

        primary: {
          main: "#90caf9",
          light: "#90caf988",
          lighter: "#90caf933",
        },
        secondary: {
          main: "#b0bec5",
          light: "#b0bec588",
          lighter: "#b0bec533",
        },

        success: {
          main: "#66bb6a",
          light: "#66bb6a88",
          lighter: "#66bb6a33",
        },
        error: {
          main: "#ef5350",
          light: "#ef535088",
          lighter: "#ef535033",
        },
        warning: {
          main: "#ffa726",
          light: "#ffa72688",
          lighter: "#ffa72633",
        },
        info: {
          main: "#42a5f5",
          light: "#42a5f588",
          lighter: "#42a5f533",
        },

        background: {
          default: "#0f172a",
          paper: "#1e293b",
        },

        text: {
          primary: "#ffffff",
          secondary: "#cbd5e1",
        },

        divider: "#334155",
      },
    },
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
              <ReactQueryProvider>
                {children}
              </ReactQueryProvider>
            </ReactHotToastProvider>
          </LocalizationProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
