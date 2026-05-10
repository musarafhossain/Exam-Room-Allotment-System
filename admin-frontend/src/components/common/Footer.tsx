import React from 'react';
import { Box, Typography, Link } from '@mui/material';
import { Favorite as HeartIcon } from '@mui/icons-material';

export default function Footer() {
  return (
    <Box
      component="footer"
      sx={{
        mt: 4,
        py: 2,
        borderTop: '1px solid',
        borderColor: 'divider',
        textAlign: 'center',
      }}
    >
      <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0.5 }}>
        Design & Developed By{' '}
        <Link
          href="https://www.linkedin.com/in/musrafhossain"
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
