"use client";

import React from 'react';
import { 
  Box, 
  Paper, 
  Stack, 
  Skeleton, 
  Grid, 
  Divider 
} from '@mui/material';

export default function ResultSkeleton() {
  return (
    <Paper
      elevation={0}
      sx={{
        p: { xs: 3, sm: 4, md: 6 },
        width: '100%',
        borderRadius: 5,
        bgcolor: 'background.paper',
        border: '1px solid',
        borderColor: 'divider',
        boxShadow: '0px 20px 40px rgba(0,0,0,0.04)',
      }}
    >
      <Stack spacing={4}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
          <Skeleton variant="rectangular" width={72} height={72} sx={{ borderRadius: 4 }} />
          <Box sx={{ flex: 1 }}>
            <Skeleton variant="text" width="60%" sx={{ fontSize: '2rem' }} />
            <Skeleton variant="text" width="40%" />
          </Box>
        </Box>
        
        <Divider />

        <Grid container spacing={3}>
           {[1, 2, 3, 4, 5].map((i) => (
             <Grid key={i} size={{ xs: 12, sm: 6, md: 4 }}>
                <Box sx={{ p: 2.5, borderRadius: 4, bgcolor: 'background.default', height: '100%' }}>
                  <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
                    <Skeleton variant="circular" width={24} height={24} />
                    <Skeleton variant="text" width={80} />
                  </Stack>
                  <Skeleton variant="text" width={120} height={40} />
                </Box>
             </Grid>
           ))}
        </Grid>
      </Stack>
    </Paper>
  );
}
