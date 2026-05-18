import { Box, Typography } from '@mui/material';

export default function Footer() {
  return (
    <Box
      component="footer"
      sx={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 1100,
        bgcolor: 'rgba(255, 255, 255, 0.6)', // More transparent for glass effect
        backdropFilter: 'blur(15px)', // Increased blur
        py: 1.5, // Using explicit CSS string to guarantee padding is applied perfectly
        borderTop: '1px solid rgba(255, 255, 255, 0.3)', // Soft white border
        boxShadow: '0 -4px 30px rgba(0, 0, 0, 0.05)',
        textAlign: 'center',
      }}
    >
      <Typography 
        variant="caption" 
        sx={{ 
          display: 'flex', 
          flexDirection: 'column',
          alignItems: 'center', 
          justifyContent: 'center', 
          gap: '2px', // Tight gap
          color: 'text.secondary',
          fontFamily: '"Montserrat", sans-serif',
          letterSpacing: 0.8,
          fontSize: '0.8rem',
          lineHeight: 1.2, // Tighter line height
        }}
      >
        <span style={{ display: 'inline-flex', alignItems: 'center' }}>
          Designed & Developed By{' '}
          <Typography
            component={'span'}
            sx={{ 
              fontWeight: 600, 
              color: 'primary.main',
              fontFamily: '"Montserrat", sans-serif',
              letterSpacing: 0.5,
              fontSize: '0.85rem',
              ml: 0.5,
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px'
            }}
          >
            Musaraf Hossain
          </Typography>
        </span>
        <Typography
          component={'span'}
          sx={{ 
            fontWeight: 500, 
            color: '#718096',
            fontFamily: '"Montserrat", sans-serif',
            letterSpacing: 0.5,
            fontSize: '0.75rem',
          }}
        >
          {`(Department of CS, Cooch Behar College)`}
        </Typography>
      </Typography>
    </Box>
  );
}
