"use client";

import React from 'react';
import { 
  Box, 
  Paper, 
  Stack, 
  Divider, 
  Grid, 
  Skeleton 
} from '@mui/material';

export default function ResultSkeleton() {
  return (
    <Paper
      elevation={0}
      sx={{
        p: { xs: 3, md: 5 },
        width: '100%',
        borderRadius: 5,
        bgcolor: 'background.paper',
        border: '1px solid',
        borderColor: 'divider',
        boxShadow: '0px 30px 60px rgba(0,0,0,0.12)',
        overflow: 'hidden'
      }}
    >
      <Stack spacing={4}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Skeleton variant="circular" width={60} height={60} />
          <Box sx={{ flexGrow: 1 }}>
            <Skeleton variant="text" width="60%" height={40} />
            <Skeleton variant="text" width="40%" />
          </Box>
        </Box>
        
        <Divider />

        <Grid container spacing={4}>
          {[...Array(6)].map((_, index) => (
            <Grid key={index} size={{ xs: 12, sm: 6, md: 4 }}>
               <Box sx={{ p: 2.5, borderRadius: 4, bgcolor: 'background.default', border: '1px solid transparent' }}>
                  <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 1 }}>
                    <Skeleton variant="circular" width={24} height={24} />
                    <Skeleton variant="text" width={80} />
                  </Stack>
                  <Skeleton variant="text" width="100%" height={40} />
               </Box>
            </Grid>
          ))}
        </Grid>
        
        <Skeleton variant="rectangular" height={80} sx={{ borderRadius: 3 }} />
      </Stack>
    </Paper>
  );
}
