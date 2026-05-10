"use client";

import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Stack,
  Avatar,
  LinearProgress
} from '@mui/material';
import { useTheme } from '@mui/material/styles';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  color?: "primary" | "secondary" | "success" | "error" | "warning" | "info";
  trend?: string;
  progress?: number;
}

export default function StatCard({
  title,
  value,
  icon,
  color = "primary",
  trend,
  progress
}: StatCardProps) {
  const theme = useTheme();

  return (
    <Card
      sx={{
        height: '100%',
        borderRadius: 4,
        boxShadow: 'none',
        border: '1px solid',
        borderColor: 'divider',
        transition: 'transform 0.2s',
        '&:hover': { transform: 'scale(1.02)' }
      }}
    >
      <CardContent sx={{ p: 4 }}>
        <Stack direction="row" spacing={3} alignItems="center">
          <Avatar
            sx={{
              width: 56,
              height: 56,
              bgcolor: `${color}.lighter`,
              color: `${color}.main`,
              borderRadius: 3
            }}
          >
            {icon}
          </Avatar>
          <Box>
            <Typography variant="body2" color="text.secondary" fontWeight={600} gutterBottom>
              {title}
            </Typography>
            <Typography variant="h4" fontWeight={700}>
              {value}
            </Typography>
          </Box>
        </Stack>

        {trend && (
          <Box sx={{ mt: 2 }}>
            <Typography variant="caption" color="text.secondary">
              <Typography component="span" variant="caption" color="success.main" fontWeight={700} sx={{ mr: 0.5 }}>
                {trend}
              </Typography>
              than last month
            </Typography>
          </Box>
        )}

        {progress !== undefined && (
          <Box sx={{ mt: 3 }}>
            <LinearProgress
              variant="determinate"
              value={progress}
              color={color as any}
              sx={{ height: 6, borderRadius: 3, bgcolor: 'divider' }}
            />
          </Box>
        )}
      </CardContent>
    </Card>
  );
}
