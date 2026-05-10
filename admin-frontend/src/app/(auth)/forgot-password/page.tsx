'use client';

import React from 'react';
import { useMutation } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as zod from 'zod';
import {
    Box,
    Button,
    Card,
    Container,
    TextField,
    Typography,
    Stack,
    IconButton,
} from '@mui/material';
import { ArrowBack as ArrowBackIcon } from '@mui/icons-material';
import { useRouter } from 'next/navigation';
import { AuthService } from 'services';
import toast from 'react-hot-toast';
import Link from 'next/link';

const forgotPasswordSchema = zod.object({
    email: zod.string().email('Invalid email address'),
});

type ForgotPasswordFormValues = zod.infer<typeof forgotPasswordSchema>;

export default function ForgotPasswordPage() {
    const router = useRouter();

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<ForgotPasswordFormValues>({
        resolver: zodResolver(forgotPasswordSchema),
    });

    const mutation = useMutation({
        mutationFn: (data: ForgotPasswordFormValues) => AuthService.forgotPassword(data),
        onSuccess: (res) => {
            if (res.success) {
                toast.success('Password reset link sent to your email!');
            } else {
                toast.error(res.message || 'Failed to send reset link');
            }
        },
        onError: (error: any) => {
            toast.error(error?.response?.data?.message || 'Something went wrong');
        },
    });

    const onSubmit = (data: ForgotPasswordFormValues) => {
        mutation.mutate(data);
    };

    return (
        <Box 
            sx={{ 
                minHeight: '100vh', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
                p: 2
            }}
        >
            <Container maxWidth="sm">
                <Card 
                    sx={{ 
                        p: { xs: 3, md: 6 }, 
                        width: '100%', 
                        boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
                        borderRadius: 4,
                        background: 'rgba(255, 255, 255, 0.9)',
                        backdropFilter: 'blur(10px)',
                        border: '1px solid rgba(255, 255, 255, 0.3)'
                    }}
                >
                    <Stack spacing={4}>
                        <Box sx={{ textAlign: 'center', position: 'relative' }}>
                            <IconButton 
                                component={Link} 
                                href="/login" 
                                sx={{ 
                                    position: 'absolute', 
                                    left: -10, 
                                    top: -10,
                                    color: 'text.secondary',
                                    '&:hover': { color: 'primary.main', bgcolor: 'rgba(26, 115, 232, 0.05)' }
                                }}
                            >
                                <ArrowBackIcon />
                            </IconButton>
                            
                            <Box 
                                sx={{ 
                                    width: 64, 
                                    height: 64, 
                                    borderRadius: '20px', 
                                    display: 'flex', 
                                    alignItems: 'center', 
                                    justifyContent: 'center',
                                    mx: 'auto',
                                    mb: 3,
                                }}
                            >
                                <img 
                                     src="/assets/images/logo.png" 
                                    alt="Institution Logo" 
                                    style={{ width: '64px', height: '64px', objectFit: 'contain' }} 
                                />
                            </Box>

                            <Typography variant="h4" fontWeight={900} color="text.primary" gutterBottom>
                                Reset Password
                            </Typography>
                            <Typography variant="body1" color="text.secondary">
                                Enter your email and we'll send you reset instructions
                            </Typography>
                        </Box>

                        <form onSubmit={handleSubmit(onSubmit)}>
                            <Stack spacing={3}>
                                <TextField
                                    fullWidth
                                    label="Email Address"
                                    placeholder="e.g. admin@university.edu"
                                    variant="outlined"
                                    {...register('email')}
                                    error={!!errors.email}
                                    helperText={errors.email?.message}
                                    sx={{ 
                                        '& .MuiOutlinedInput-root': { borderRadius: 3 },
                                        bgcolor: 'rgba(255, 255, 255, 0.5)'
                                    }}
                                />
                                <Button
                                    fullWidth
                                    size="large"
                                    type="submit"
                                    variant="contained"
                                    disabled={mutation.isPending}
                                    sx={{ 
                                        py: 1.8, 
                                        borderRadius: 3, 
                                        textTransform: 'none', 
                                        fontSize: '1.1rem',
                                        fontWeight: 700,
                                        boxShadow: '0 10px 20px rgba(26, 115, 232, 0.3)'
                                    }}
                                >
                                    {mutation.isPending ? 'Sending...' : 'Send Reset Link'}
                                </Button>

                                <Box sx={{ textAlign: 'center' }}>
                                    <Link href="/login" style={{ textDecoration: 'none' }}>
                                        <Typography 
                                            variant="body2" 
                                            sx={{ 
                                                color: 'primary.main', 
                                                fontWeight: 700,
                                                '&:hover': { textDecoration: 'underline' }
                                            }}
                                        >
                                            Return to Sign In
                                        </Typography>
                                    </Link>
                                </Box>
                            </Stack>
                        </form>
                    </Stack>
                </Card>
            </Container>
        </Box>
    );
}
