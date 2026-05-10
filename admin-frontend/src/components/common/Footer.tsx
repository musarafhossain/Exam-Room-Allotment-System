import React from 'react';
import { Box, Typography, Link } from '@mui/material';
import { Favorite as HeartIcon } from '@mui/icons-material';

export default function Footer() {
  return (
    <Box
      component="footer"
      sx={{
        py: 1.5,
        bgcolor: 'rgba(255, 255, 255, 0.4)', // Higher transparency for classic glass look
        backdropFilter: 'blur(10px) saturate(180%)',
        boxShadow: '0 -4px 12px rgba(0,0,0,0.05)', // Top side shadow
        textAlign: 'center',
      }}
    >
      <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0.5 }}>
        Design & Developed By{' '}
        <Link
          href="https://www.linkedin.com/in/musarafhossain"
          target="_blank"
          rel="noopener noreferrer"
          underline="hover"
          sx={{ fontWeight: 700, color: 'primary.main' }}
        >
          Musaraf Hossain
        </Link>
      </Typography>
    </Box>
  );
}
