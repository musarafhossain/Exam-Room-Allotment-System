"use client";

import React from 'react';
import { Box, Typography, Button, Fade } from '@mui/material';
import { Refresh as RefreshIcon, ErrorOutline as ErrorIcon } from '@mui/icons-material';

interface ResultErrorProps {
    onRetry: () => void;
}

export default function ResultError({ onRetry }: ResultErrorProps) {
    return (
        <Fade in={true} timeout={500}>
            <Box
                sx={{
                    width: '100%',
                    textAlign: 'center',
                    borderRadius: 5,
                    mt: 6,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}
            >
                <ErrorIcon sx={{ fontSize: 60, color: 'error.main', mb: 2, opacity: 0.8 }} />
                <Typography variant="h6" fontWeight={700} color="text.primary" gutterBottom>
                    Unable to load data
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 3, maxWidth: 280 }}>
                    We encountered a technical issue. Please check your connection and try again.
                </Typography>
                <Button
                    variant="outlined"
                    color="primary"
                    startIcon={<RefreshIcon />}
                    onClick={onRetry}
                    sx={{ 
                        borderRadius: 3, 
                        px: 3,
                        fontWeight: 700,
                        textTransform: 'none',
                        borderColor: 'primary.main',
                        '&:hover': {
                            bgcolor: 'primary.main',
                            color: '#fff'
                        }
                    }}
                >
                    Retry Now
                </Button>
            </Box>
        </Fade>
    );
}
