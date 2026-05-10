"use client";
import { 
  Box, 
  Stack, 
  Divider, 
  Grid, 
  Skeleton 
} from '@mui/material';

export default function ResultSkeleton() {
  return (
    <Box
      sx={{
        width: '100%',
        position: 'relative',
        p: { xs: 3, sm: 4 },
        borderRadius: 5,
        border: '1px solid',
        borderColor: 'divider',
        bgcolor: 'rgba(255, 255, 255, 0.4)',
        backdropFilter: 'blur(10px)',
      }}
    >
      <Stack spacing={3}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: { xs: 'flex-start', sm: 'center' }, flexDirection: { xs: 'column', sm: 'row' }, gap: 2 }}>
          <Stack direction="row" spacing={2} alignItems="center">
            <Skeleton variant="rounded" width={52} height={52} sx={{ borderRadius: 2 }} />
            <Box>
              <Skeleton variant="text" width={120} height={32} />
              <Skeleton variant="text" width={180} height={20} />
            </Box>
          </Stack>
        </Box>
        
        <Divider sx={{ borderStyle: 'dashed' }} />

        <Grid container spacing={2}>
          {[...Array(5)].map((_, index) => (
            <Grid key={index} size={{ xs: 12, sm: 6, md: 4 }}>
              <Box sx={{ 
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center'
              }}>
                <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 1 }}>
                  <Skeleton variant="circular" width={20} height={20} />
                  <Skeleton variant="text" width={60} height={16} />
                </Stack>
                <Skeleton variant="text" width="80%" height={28} />
              </Box>
            </Grid>
          ))}
        </Grid>
        
        <Box sx={{ 
            p: 2, 
            bgcolor: 'rgba(0,0,0,0.02)', 
            borderRadius: 2, 
            border: '1px solid rgba(0,0,0,0.05)',
            display: 'flex', 
            alignItems: 'center', 
            gap: 1.5 
        }}>
          <Skeleton variant="circular" width={8} height={8} />
          <Skeleton variant="text" width="70%" height={20} />
        </Box>
      </Stack>
    </Box>
  );
}
