"use client";

import React from 'react';
import { 
  Box, 
  Paper, 
  Stack, 
  Divider, 
  Grid, 
  Typography, 
  Grow 
} from '@mui/material';
import { 
  Assignment as AssignmentIcon,
  AccessTime as TimeIcon,
  Person as PersonIcon,
  Event as EventIcon
} from '@mui/icons-material';
import { TeacherRoomModel } from 'models';
import dayjs from 'dayjs';

interface ResultCardProps {
  result: TeacherRoomModel;
}

export default function ResultCard({ result }: ResultCardProps) {
  return (
    <Grow in={true}>
      <Paper
        elevation={0}
        sx={{
          p: { xs: 3, sm: 4, md: 6 },
          width: '100%',
          borderRadius: 5,
          bgcolor: 'background.paper',
          border: '1px solid',
          borderColor: 'divider',
          boxShadow: '0px 40px 100px rgba(0,0,0,0.06)',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        <Stack spacing={4}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 2.5, md: 3 }, flexDirection: { xs: 'column', sm: 'row' }, textAlign: { xs: 'center', sm: 'left' } }}>
            <Box sx={{ 
              p: 2, 
              bgcolor: 'primary.lighter', 
              color: 'primary.main', 
              borderRadius: 4,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 10px 20px rgba(26, 115, 232, 0.1)'
            }}>
              <AssignmentIcon sx={{ fontSize: { xs: 32, md: 40 } }} />
            </Box>
            <Box>
              <Typography variant="h4" fontWeight={800} sx={{ letterSpacing: -1, fontSize: { xs: '1.75rem', md: '2.5rem' } }}>Duty Assigned</Typography>
              <Typography color="text.secondary" sx={{ fontSize: { xs: '0.9rem', md: '1rem' } }}>We successfully located your duty assignment for the day.</Typography>
            </Box>
          </Box>
          
          <Divider />

          <Grid container spacing={4}>
            <ResultItem icon={<PersonIcon />} label="Teacher Name" value={result.name} highlight />
            <ResultItem icon={<EventIcon />} label="Date" value={dayjs(result.date).format('MMMM DD, YYYY')} highlight color="secondary" />
            
            {result.shift1 && (
              <ResultItem 
                icon={<TimeIcon />} 
                label="Shift 1" 
                value={`${result.shift1Start || '10:00'} - ${result.shift1End || '13:00'}`} 
                highlight 
                color="primary" 
              />
            )}
            
            {result.shift2 && (
              <ResultItem 
                icon={<TimeIcon />} 
                label="Shift 2" 
                value={`${result.shift2Start || '14:00'} - ${result.shift2End || '17:00'}`} 
                highlight 
                color="secondary" 
              />
            )}
          </Grid>
          
          <Box sx={{ mt: 2, p: 3, bgcolor: 'info.lighter', borderRadius: 3, display: 'flex', alignItems: 'flex-start', gap: 2 }}>
            <Typography variant="body2" color="info.main" fontWeight={600}>
              Note: Please arrive at the duty location at least 15 minutes before your shift starts.
            </Typography>
          </Box>
        </Stack>
      </Paper>
    </Grow>
  );
}

function ResultItem({ 
  icon, 
  label, 
  value, 
  highlight = false, 
  color = "primary" 
}: { 
  icon: React.ReactNode; 
  label: string; 
  value: string | number;
  highlight?: boolean;
  color?: "primary" | "secondary";
}) {
  return (
    <Grid size={{ xs: 12, sm: 6, md: 4 }}>
      <Box sx={{ 
        p: 2.5, 
        borderRadius: 4, 
        bgcolor: highlight ? `${color}.lighter` : 'background.default',
        border: highlight ? '1px solid' : '1px transparent',
        borderColor: highlight ? `${color}.main` : 'transparent',
        height: '100%',
        transition: 'all 0.3s ease',
        '&:hover': { transform: 'translateY(-5px)', boxShadow: '0 10px 20px rgba(0,0,0,0.05)' }
      }}>
        <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 1.5 }}>
          <Box sx={{ 
            color: highlight ? `${color}.main` : 'text.secondary', 
            display: 'flex',
            '& svg': { fontSize: 24 }
          }}>
            {icon}
          </Box>
          <Typography variant="caption" sx={{ textTransform: 'uppercase', letterSpacing: 2, fontWeight: 700, color: 'text.secondary', fontSize: '0.65rem' }}>
            {label}
          </Typography>
        </Stack>
        <Typography 
          variant="h5" 
          fontWeight={800} 
          color={highlight ? `${color}.main` : 'text.primary'}
          sx={{ fontSize: highlight ? { xs: '1.5rem', md: '1.75rem' } : { xs: '1.25rem', md: '1.5rem' }, lineHeight: 1.2 }}
        >
          {value}
        </Typography>
      </Box>
    </Grid>
  );
}
