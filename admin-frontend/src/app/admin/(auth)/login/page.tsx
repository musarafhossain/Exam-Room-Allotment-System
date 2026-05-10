'use client';

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
    Alert,
    CircularProgress,
} from '@mui/material';
import { useRouter } from 'next/navigation';
import { useAuth } from 'hooks';
import { AuthService } from 'services';
import toast from 'react-hot-toast';

const loginSchema = zod.object({
    email: zod.email('Invalid email address'),
    password: zod.string().min(6, 'Password must be at least 6 characters'),
});

type LoginFormValues = zod.infer<typeof loginSchema>;

export default function LoginPage() {
    const router = useRouter();
    const { login, isAuthenticated } = useAuth();

    // Redirect if already authenticated
    if (isAuthenticated) {
        router.replace('/admin/dashboard');
    }

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<LoginFormValues>({
        resolver: zodResolver(loginSchema),
    });

    const mutation = useMutation({
        mutationFn: (data: LoginFormValues) => AuthService.login(data),
        onSuccess: (res) => {
            if (res.success) {
                login(res?.data!.user, res?.data!.token);
                toast.success('Login successful!');
                router.push('/admin/dashboard');
            } else {
                toast.error(res.message || 'Login failed');
            }
        },
        onError: (error: any) => {
            toast.error(error?.response?.data?.message || 'Something went wrong');
        },
    });

    const onSubmit = (data: LoginFormValues) => {
        mutation.mutate(data);
    };

    return (
        <Container maxWidth="sm">
                <Box
                    sx={{
                    mt: 8,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                    }}
                >
                <Card sx={{ p: 4, width: '100%', boxShadow: 3 }}>
                        <Stack spacing={3}>
                        <Typography variant="h4" textAlign="center" gutterBottom>
                                Admin Login
                            </Typography>

                            {mutation.isError && (
                                <Alert severity="error">
                                    {(mutation.error as any)?.response?.data?.message || 'Login failed'}
                                </Alert>
                            )}

                            <form onSubmit={handleSubmit(onSubmit)}>
                                <Stack spacing={3}>
                                    <TextField
                                        fullWidth
                                        label="Email Address"
                                        {...register('email')}
                                        error={!!errors.email}
                                        helperText={errors.email?.message}
                                    />
                                    <TextField
                                        fullWidth
                                        label="Password"
                                        type="password"
                                        {...register('password')}
                                        error={!!errors.password}
                                        helperText={errors.password?.message}
                                    />
                                    <Button
                                        fullWidth
                                        size="large"
                                        type="submit"
                                        variant="contained"
                                        disabled={mutation.isPending}
                                        startIcon={mutation.isPending && <CircularProgress size={20} />}
                                    >
                                        {mutation.isPending ? 'Signing in...' : 'Sign In'}
                                    </Button>
                                </Stack>
                            </form>
                        </Stack>
                    </Card>
                </Box>
            </Container>
    );
}
