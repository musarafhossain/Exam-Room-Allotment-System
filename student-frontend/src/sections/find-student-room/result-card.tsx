"use client";

import React from 'react';
import { 
  Box, 
  Stack, 
  Divider, 
  Grid, 
  Typography, 
  Fade,
} from '@mui/material';
import { 
  Business as BuildingIcon,
  Layers as FloorIcon,
  Book as SubjectIcon,
  Assignment as PaperIcon,
  AccessTime as TimeIcon,
} from '@mui/icons-material';
import ApartmentIcon from '@mui/icons-material/Apartment';
import dayjs from 'dayjs';
import { StudentRoomModel } from 'models';

interface ResultCardProps {
  result: StudentRoomModel;
}

export default function ResultCard({ result }: ResultCardProps) {
  return (
    <Fade in={true} timeout={500}>
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
              <Box sx={{ 
                p: 1.5, 
                bgcolor: 'rgba(0, 102, 255, 0.06)', 
                color: 'primary.main', 
                borderRadius: 3,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
                <ApartmentIcon sx={{ fontSize: 28 }} />
              </Box>
              <Box>
                <Typography variant="h5" fontWeight={800} sx={{ letterSpacing: -0.5 }}>Room {result.roomNo}</Typography>
                <Typography variant="body2" color="text.secondary">Seat allotment confirmed</Typography>
              </Box>
            </Stack>
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
      </Box>
    </Fade>
  );
}

function ResultItem({ 
  icon, 
  label, 
  value, 
  highlight = false, 
  color = "primary",
  xs = 12,
  sm = 6,
  md = 4
}: { 
  icon: React.ReactNode; 
  label: string; 
  value: string | number;
  highlight?: boolean;
  color?: "primary" | "secondary" | "info" | "success" | "warning" | "error";
  xs?: number;
  sm?: number;
  md?: number;
}) {
  return (
    <Grid size={{ xs, sm, md }}>
      <Box sx={{ 
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
