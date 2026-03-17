'use client';

import {
  Box,
  IconButton,
  Typography,
  Grid,
  Paper,
} from '@mui/material';

import { DarkMode, LightMode } from '@mui/icons-material';

import {
  useColorScheme,
} from '@mui/material/styles';


// 🔥 Inner component (must be inside provider)
function Content() {
  const { mode, setMode } = useColorScheme();

  const colors = [
    'primary',
    'secondary',
    'error',
    'warning',
    'info',
    'success',
  ] as const;

  const shades = ['light', 'main', 'dark'] as const;

  return (
    <>
      {/* Toggle Button */}
      <Box sx={{ position: 'fixed', top: 16, right: 16 }}>
        <IconButton
          onClick={() => setMode(mode === 'light' ? 'dark' : 'light')}
        >
          {mode === 'light' ? <DarkMode /> : <LightMode />}
        </IconButton>
      </Box>

      <Box sx={{ p: 4 }}>
        <Typography variant="h4" gutterBottom>
          MUI Theme Colors ({mode})
        </Typography>

        <Grid container spacing={2}>
          {colors.map((color) =>
            shades.map((shade) => (
              <Grid size={{ sm: 1, md: 2, lg: 3 }} key={`${color}-${shade}`}>
                <Paper
                  sx={{
                    p: 2,
                    bgcolor: `${color}.${shade}`,
                    color: (theme) =>
                      theme.palette.getContrastText(
                        theme.palette[color][shade]
                      ),
                  }}
                >
                  <Typography variant="subtitle1">
                    {color}.{shade}
                  </Typography>
                </Paper>
              </Grid>
            ))
          )}
        </Grid>
      </Box>
    </>
  );
}


// 🔥 Main Page
export default function Page() {
  return (
    <Content />
  );
}