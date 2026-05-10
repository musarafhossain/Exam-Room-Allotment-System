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
  Room as RoomIcon,
  Business as BuildingIcon,
  Layers as FloorIcon,
  Book as SubjectIcon,
  Assignment as PaperIcon,
  AccessTime as TimeIcon
} from '@mui/icons-material';
import dayjs from 'dayjs';
import { StudentRoomModel } from 'models';

interface ResultCardProps {
  result: StudentRoomModel;
}

export default function ResultCard({ result }: ResultCardProps) {
  return (
    <Grow in={true}>
      <Paper
        elevation={0}
        sx={{
          p: { xs: 3, sm: 4 },
          width: '100%',
          borderRadius: 4,
          bgcolor: 'background.paper',
          border: '1px solid',
          borderColor: 'divider',
          boxShadow: '0px 20px 40px rgba(0,0,0,0.04)',
          position: 'relative',
          overflow: 'hidden',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            width: '6px',
            height: '100%',
            bgcolor: `primary.main`,
          }
        }}
      >
        <Stack spacing={3}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: { xs: 'flex-start', sm: 'center' }, flexDirection: { xs: 'column', sm: 'row' }, gap: 2 }}>
            <Stack direction="row" spacing={2} alignItems="center">
              <Box sx={{ 
                p: 1.5, 
                bgcolor: `primary.lighter`, 
                color: `primary.main`, 
                borderRadius: 2,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
                <RoomIcon sx={{ fontSize: 28 }} />
              </Box>
              <Box>
                <Typography variant="h5" fontWeight={800} sx={{ letterSpacing: -0.5 }}>Room {result.roomNo}</Typography>
                <Typography variant="body2" color="text.secondary">Seat allotment confirmed</Typography>
              </Box>
            </Stack>
            
            <Box sx={{ 
              px: 2, 
              py: 0.5, 
              borderRadius: 5, 
              bgcolor: `success.lighter`, 
              color: `success.main`,
              fontSize: '0.875rem',
              fontWeight: 700,
              alignSelf: { xs: 'flex-start', sm: 'center' }
            }}>
              Confirmed
            </Box>
          </Box>
          
          <Divider sx={{ borderStyle: 'dashed' }} />

          <Grid container spacing={2}>
            <ResultItem icon={<BuildingIcon />} label="Building" value={result.building || 'N/A'} xs={12} sm={6} />
            <ResultItem icon={<FloorIcon />} label="Floor" value={result.floor || 'N/A'} xs={12} sm={6} />
            {result.subject && <ResultItem icon={<SubjectIcon />} label="Subject" value={result.subject} xs={12} />}
            {result.paper && <ResultItem icon={<PaperIcon />} label="Paper" value={result.paper} xs={12} />}
            <ResultItem 
                icon={<TimeIcon />} 
                label="Exam Time" 
                value={result.time ? dayjs(`2000-01-01 ${result.time}`).format('hh:mm A') : 'N/A'} 
                xs={12} 
                highlight 
                color="primary" 
            />
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
            <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: `primary.main` }} />
            <Typography variant="caption" color="text.secondary" fontWeight={600}>
              Please reach the exam hall 30 minutes before the scheduled time.
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
  color = "primary",
  xs = 12,
  sm = 6
}: { 
  icon: React.ReactNode; 
  label: string; 
  value: string | number;
  highlight?: boolean;
  color?: "primary" | "secondary" | "info" | "success" | "warning" | "error";
  xs?: number;
  sm?: number;
}) {
  return (
    <Grid size={{ xs: 12, sm: 6, md: 4 }}>
      <Box sx={{ 
        p: 2, 
        borderRadius: 3, 
        bgcolor: highlight ? `${color}.lighter` : 'transparent',
        border: highlight ? '1px solid' : '1px solid',
        borderColor: highlight ? `${color}.main` : 'divider',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center'
      }}>
        <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 1 }}>
          <Box sx={{ 
            color: highlight ? `${color}.main` : 'text.disabled', 
            display: 'flex',
            '& svg': { fontSize: 20 }
          }}>
            {icon}
          </Box>
          <Typography variant="caption" sx={{ textTransform: 'uppercase', letterSpacing: 1, fontWeight: 700, color: 'text.disabled', fontSize: '0.6rem' }}>
            {label}
          </Typography>
        </Stack>
        <Typography 
          variant="h6" 
          fontWeight={800} 
          color={highlight ? `${color}.main` : 'text.primary'}
          sx={{ 
            fontSize: { xs: '1rem', md: '1.15rem' }, 
            lineHeight: 1.2,
            wordBreak: 'break-word',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            minHeight: '2.4em' // Pre-allocate space for 2 lines to keep row alignment
          }}
        >
          {value}
        </Typography>
      </Box>
    </Grid>
  );
}
