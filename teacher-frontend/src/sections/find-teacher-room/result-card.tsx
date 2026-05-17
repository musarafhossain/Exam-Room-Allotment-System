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
  AccessTime as TimeIcon,
  Person as PersonIcon,
  CalendarMonth as CalendarIcon
} from '@mui/icons-material';
import dayjs from 'dayjs';
import { TeacherRoomModel } from 'models';

interface ResultCardProps {
  result: TeacherRoomModel;
  shiftType: 1 | 2;
  index?: number;
}

export default function ResultCard({ result, shiftType, index }: ResultCardProps) {
  const isShift1 = shiftType === 1;
  const shiftLabel = isShift1 ? "Shift 1 (Morning)" : "Shift 2 (Afternoon)";
  const shiftTime = isShift1
    ? `${result.shift1Start || '10:00'} - ${result.shift1End || '13:00'}`
    : `${result.shift2Start || '14:00'} - ${result.shift2End || '17:00'}`;
  const shiftColor = isShift1 ? "primary" : "secondary";

  const isSticky = typeof index === 'number';

  return (
    <Fade in={true} timeout={500}>
      <Box
        sx={{
          width: '100%',
          p: { xs: 3, sm: 4 },
          borderRadius: 5,
          border: '1px solid',
          borderColor: 'divider',
          bgcolor: 'rgba(255, 255, 255, 0.85)',
          backdropFilter: 'blur(20px)',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.04)',
          ...(isSticky && {
            position: 'sticky',
            top: { xs: 16 + index * 16, sm: 24 + index * 24 },
            zIndex: index + 1,
          }),
        }}
      >
        <Stack spacing={3}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: { xs: 'flex-start', sm: 'center' }, flexDirection: { xs: 'column', sm: 'row' }, gap: 2 }}>
            <Stack direction="row" spacing={2} alignItems="center">
              <Box sx={{
                p: 1.5,
                bgcolor: isShift1 ? 'rgba(0, 102, 255, 0.06)' : 'rgba(156, 39, 176, 0.06)',
                color: `${shiftColor}.main`,
                borderRadius: 3,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
                <CalendarIcon sx={{ fontSize: 28 }} />
              </Box>
              <Box>
                <Typography
                  variant="h5"
                  fontWeight={800}
                  sx={{
                    letterSpacing: -0.5,
                    fontSize: { xs: 'h6.fontSize', sm: 'h5.fontSize' }
                  }}
                >
                  {shiftLabel}
                </Typography>
                <Typography variant="body2" color="text.secondary">{dayjs(result.date).format('ddd, MMM DD, YYYY')}</Typography>
              </Box>
            </Stack>
          </Box>

          <Divider sx={{ borderStyle: 'dashed' }} />

          <Grid container spacing={2}>
            <ResultItem icon={<PersonIcon />} label="Teacher" value={result.name} xs={12} sm={6} />
            <ResultItem
              icon={<TimeIcon />}
              label="Time Slot"
              value={shiftTime}
              xs={12}
              highlight
              color={shiftColor}
            />
          </Grid>
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
  md = 6
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
  const isPrimary = color === "primary";

  const bg = highlight
    ? (isPrimary ? 'rgba(26, 115, 232, 0.05)' : 'rgba(156, 39, 176, 0.05)')
    : 'rgba(0, 0, 0, 0.02)';

  const borderColor = highlight
    ? (isPrimary ? 'rgba(26, 115, 232, 0.15)' : 'rgba(156, 39, 176, 0.15)')
    : 'rgba(0, 0, 0, 0.05)';

  const iconColor = highlight
    ? `${color}.main`
    : 'text.secondary';

  const textColor = highlight
    ? `${color}.main`
    : 'text.primary';

  return (
    <Grid size={{ xs, sm, md }}>
      <Box sx={{
        p: 2.5,
        borderRadius: 4,
        bgcolor: bg,
        border: '1px solid',
        borderColor: borderColor,
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        transition: 'all 0.3s ease',
        '&:hover': {
          transform: 'translateY(-2px)',
          boxShadow: '0 8px 24px rgba(0,0,0,0.04)',
        }
      }}>
        <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 1.5 }}>
          <Box sx={{
            color: iconColor,
            display: 'flex',
            '& svg': { fontSize: 20 }
          }}>
            {icon}
          </Box>
          <Typography variant="caption" sx={{ textTransform: 'uppercase', letterSpacing: 1, fontWeight: 700, color: 'text.disabled', fontSize: '0.65rem' }}>
            {label}
          </Typography>
        </Stack>
        <Typography
          variant="h6"
          fontWeight={800}
          color={textColor}
          sx={{
            fontSize: { xs: '1.05rem', md: '1.2rem' },
            wordBreak: 'break-word',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            fontFamily: 'Montserrat, sans-serif',
          }}
        >
          {value}
        </Typography>
      </Box>
    </Grid>
  );
}
