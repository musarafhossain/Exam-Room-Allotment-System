"use client";

import React from 'react';
import {
    Box,
    Container,
    Typography,
    Button,
    Stack,
    Grid,
    Card,
    CardContent,
    Avatar,
} from '@mui/material';
import {
    School as StudentIcon,
    AdminPanelSettings as AdminIcon,
    ArrowForward as ArrowIcon,
    Timeline as StatsIcon,
    Security as SecurityIcon,
    Devices as ResponsiveIcon
} from '@mui/icons-material';
import { useRouter } from 'next/navigation';
import { useTheme } from '@mui/material/styles';

export default function LandingPage() {
    const router = useRouter();
    const theme = useTheme();

    return (
        <Box sx={{ minHeight: '100vh', bgcolor: 'background.default', position: 'relative', overflow: 'hidden' }}>
            {/* Background Decorations */}
            <Box sx={{
                position: 'absolute',
                top: -100,
                right: -100,
                width: 400,
                height: 400,
                borderRadius: '50%',
                zIndex: 0
            }} />
            <Box sx={{
                position: 'absolute',
                bottom: -50,
                left: -50,
                width: 300,
                height: 300,
                borderRadius: '50%',
                zIndex: 0
            }} />

            <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
                {/* Hero Section */}
                <Box sx={{ py: { xs: 8, md: 15 }, textAlign: 'center' }}>
                    <Typography
                        variant="h1"
                        sx={{
                            fontSize: { xs: '3rem', md: '4.5rem' },
                            fontWeight: 900,
                            letterSpacing: -2,
                            lineHeight: 1.1,
                            mb: 3
                        }}
                    >
                        Modern <Typography component="span" variant="inherit" color="primary">Exam Allotment</Typography> <br /> Made Simple.
                    </Typography>
                    <Typography variant="h6" color="text.secondary" sx={{ maxWidth: 700, mx: 'auto', mb: 6, fontWeight: 400 }}>
                        Streamline your institution's examination room assignments with our intelligent allotment system. Efficient, responsive, and easy to use.
                    </Typography>

                    <Stack
                        direction={{ xs: 'column', sm: 'row' }}
                        spacing={3}
                        justifyContent="center"
                    >
                        <Button
                            variant="contained"
                            size="large"
                            startIcon={<StudentIcon />}
                            onClick={() => router.push('/find-student-room')}
                            sx={{
                                borderRadius: 3,
                                px: 5,
                                py: 2,
                                fontSize: '1.1rem',
                                fontWeight: 700,
                                boxShadow: '0px 20px 40px rgba(26, 115, 232, 0.3)',
                                textTransform: 'none'
                            }}
                        >
                            Find Student Room
                        </Button>
                        <Button
                            variant="contained"
                            size="large"
                            color="error"
                            startIcon={<AdminIcon />}
                            onClick={() => router.push('/find-teacher-room')}
                            sx={{
                                borderRadius: 3,
                                px: 5,
                                py: 2,
                                fontSize: '1.1rem',
                                fontWeight: 700,
                                boxShadow: '0px 20px 40px rgba(211, 47, 47, 0.3)',
                                textTransform: 'none'
                            }}
                        >
                            Teacher Duty Room
                        </Button>
                        <Button
                            variant="outlined"
                            size="large"
                            startIcon={<AdminIcon />}
                            onClick={() => router.push('/admin/dashboard')}
                            sx={{
                                borderRadius: 3,
                                px: 5,
                                py: 2,
                                fontSize: '1.1rem',
                                fontWeight: 700,
                                border: '2px solid',
                                '&:hover': { border: '2px solid' },
                                textTransform: 'none'
                            }}
                        >
                            Admin Portal
                        </Button>
                    </Stack>
                </Box>

                {/* Features Section */}
                <Grid container spacing={4} sx={{ pb: 15 }}>
                    <FeatureCard
                        icon={<StatsIcon />}
                        title="Intelligent Tracking"
                        description="Monitor room capacities and exam schedules in real-time with detailed analytics."
                    />
                    <FeatureCard
                        icon={<ResponsiveIcon />}
                        title="Fully Responsive"
                        description="Optimized for smartphones, tablets, and desktop computers for access anywhere."
                    />
                    <FeatureCard
                        icon={<SecurityIcon />}
                        title="Secure Management"
                        description="Protected admin portal ensuring your allotment data remains safe and controlled."
                    />
                </Grid>

                {/* Footer */}
                <Box sx={{ py: 6, borderTop: '1px solid', borderColor: 'divider', textAlign: 'center' }}>
                    <Typography variant="body2" color="text.secondary">
                        © {new Date().getFullYear()} Exam Room Allotment System. Built for academic excellence.
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                        Design & Developed By{' '}
                        <Typography
                            component="a"
                            href="https://www.linkedin.com/in/musrafhossain"
                            target="_blank"
                            rel="noopener noreferrer"
                            variant="body2"
                            sx={{ fontWeight: 700, color: 'primary.main', textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}
                        >
                            Musaraf Hossain
                        </Typography>
                    </Typography>
                </Box>
            </Container>
        </Box>
    );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode; title: string, description: string }) {
    return (
        <Grid size={{ xs: 12, md: 4 }}>
            <Card sx={{
                height: '100%',
                borderRadius: 4,
                boxShadow: 'none',
                border: '1px solid',
                borderColor: 'divider',
                p: 2,
                transition: 'all 0.3s ease',
                '&:hover': { transform: 'translateY(-10px)', borderColor: 'primary.main', boxShadow: '0 20px 40px rgba(0,0,0,0.05)' }
            }}>
                <CardContent>
                    <Avatar sx={{ bgcolor: 'primary.lighter', color: 'primary.main', mb: 3, width: 56, height: 56 }}>
                        {icon}
                    </Avatar>
                    <Typography variant="h6" fontWeight={700} gutterBottom>{title}</Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6 }}>{description}</Typography>
                </CardContent>
            </Card>
        </Grid>
    );
}