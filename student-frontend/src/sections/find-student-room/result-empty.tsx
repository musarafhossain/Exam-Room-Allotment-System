"use client";

import React from 'react';
import { Box, Typography, Fade } from '@mui/material';
import Lottie from 'lottie-react';
import animationData from '../../../public/assets/lottie/no_result_found.json';

export default function ResultEmpty() {
    return (
        <Fade in={true} timeout={500}>
            <Box
                sx={{
                    width: '100%',
                    py: 2,
                    textAlign: 'center',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}
            >
                <Box sx={{ width: 240, height: 240, mb: 0 }}>
                    <Lottie
                        animationData={animationData}
                        loop={true}
                        style={{ width: '100%', height: '100%' }}
                    />
                </Box>
                <Box sx={{
                    textAlign: 'center',
                }}>
                    <Typography variant="h6" fontWeight={700} color="text.primary" gutterBottom>No Assigned Room Found</Typography>
                    <Typography variant="body2" color="text.secondary">We couldn&apos;t find any room allotment for the provided data. Please re-check your credentials.</Typography>
                </Box>
            </Box>
        </Fade>
    );
}
