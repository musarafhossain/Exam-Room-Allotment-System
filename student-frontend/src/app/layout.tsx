'use client';
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { Public_Sans, Montserrat } from 'next/font/google';
import CssBaseline from "@mui/material/CssBaseline";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { ReactQueryProvider, ReactHotToastProvider } from 'providers';
import "./globals.css";

const publicSans = Public_Sans({
  subsets: ['latin'],
  display: 'swap',
  weight: ['300', '400', '500', '600', '700', '800'],
});

const montserrat = Montserrat({
  subsets: ['latin'],
  display: 'swap',
  weight: ['400', '500', '600', '700', '800'],
});

const theme = createTheme({
  typography: {
    fontFamily: publicSans.style.fontFamily,
    h1: { fontFamily: montserrat.style.fontFamily },
    h2: { fontFamily: montserrat.style.fontFamily },
    h3: { fontFamily: montserrat.style.fontFamily },
    h4: { fontFamily: montserrat.style.fontFamily },
    h5: { fontFamily: montserrat.style.fontFamily },
    h6: { fontFamily: montserrat.style.fontFamily },
  },
  palette: {
    mode: 'light',
    primary: {
      main: "#1a73e8",
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
      <head>
        <link rel="icon" href="/favicon.png" />
        <title>Exam Room Finder | Allotment System</title>
        <meta name="description" content="Find your examination room assignment quickly and easily. Enter your registration number to see your allotted room, building, and floor." />
      </head>
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
