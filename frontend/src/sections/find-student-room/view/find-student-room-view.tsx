"use client";

import React, { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as zod from 'zod';
import dayjs from 'dayjs';
import {
    Box,
    Button,
    Card,
    Container,
    TextField,
    Typography,
    Stack,
    Paper,
    Grid,
    InputAdornment,
    Fade
} from '@mui/material';
import {
    Search as SearchIcon,
    CalendarMonth as CalendarIcon
} from '@mui/icons-material';
import { StudentRoomService } from 'services';
import { StudentRoomModel } from 'models';
import ResultCard from '../result-card';
import ResultSkeleton from '../result-skeleton';

const searchSchema = zod.object({
    regNo: zod.string().min(1, 'Registration number is required'),
    date: zod.string().min(1, 'Date is required'),
});

type SearchFormValues = zod.infer<typeof searchSchema>;

export default function FindStudentRoomView() {
    const [result, setResult] = useState<StudentRoomModel | null>(null);
    const [searched, setSearched] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<SearchFormValues>({
        resolver: zodResolver(searchSchema),
        defaultValues: {
            date: dayjs().format('YYYY-MM-DD'),
        },
    });

    const mutation = useMutation({
        mutationFn: (data: SearchFormValues) => StudentRoomService.findStudentRoom(data),
        onSuccess: (res) => {
            setSearched(true);
            if (res.success && res.data) {
                setResult(res.data);
            } else {
                setResult(null);
            }
        },
        onError: (error: any) => {
            setSearched(true);
            setResult(null);
        },
    });

    const onSubmit = (data: SearchFormValues) => {
        setSearched(false); // Reset search state to show skeleton
        mutation.mutate(data);
    };

    return (
        <Box sx={{
            minHeight: '100vh',
            bgcolor: '#000',
            backgroundImage: `url('/assets/bg-student.png')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundAttachment: 'fixed',
            py: { xs: 4, md: 8 },
            px: { xs: 2, md: 0 },
            display: 'flex',
            alignItems: 'center',
            position: 'relative',
            '&::before': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                bgcolor: 'rgba(255, 255, 255, 0.8)', // More transparent overlay
                backdropFilter: 'blur(3px)'
            }
        }}>
            <Container maxWidth="sm" sx={{ position: 'relative', zIndex: 1 }}>
                <Stack spacing={4}>
                    <Box sx={{ textAlign: 'center' }}>
                        <Typography
                            variant="h3"
                            component="h1"
                            fontWeight={900}
                            sx={{
                                color: '#000',
                                fontSize: { xs: '2.5rem', sm: '3rem', md: '3.5rem' },
                                letterSpacing: -2,
                                mb: 1,
                                textShadow: '0 2px 15px rgba(255,255,255,0.8)'
                            }}
                        >
                            Room Finder
                        </Typography>
                        <Box sx={{ width: 40, height: 4, bgcolor: 'primary.main', mx: 'auto', borderRadius: 2, mb: 2 }} />
                        <Typography
                            variant="body1"
                            color="text.primary"
                            sx={{
                                maxWidth: 320,
                                mx: 'auto',
                                lineHeight: 1.4,
                                fontSize: '1.2rem',
                                fontWeight: 800
                            }}
                        >
                            Find your examination room assignment in seconds.
                        </Typography>
                    </Box>

                    <Paper elevation={0} sx={{
                        p: { xs: 3, md: 5 },
                        width: '100%',
                        background: 'rgba(255, 255, 255, 0.2)', // High transparency
                        backdropFilter: 'blur(30px) saturate(200%)',
                        WebkitBackdropFilter: 'blur(30px) saturate(200%)',
                        borderRadius: 6,
                        border: '1px solid rgba(255, 255, 255, 0.4)',
                        boxShadow: '0 7px 15px -3px rgba(0,0,0,0.3)',
                    }}>
                        <form onSubmit={handleSubmit(onSubmit)}>
                            <Stack spacing={3}>
                                <TextField
                                    fullWidth
                                    label="Registration No"
                                    placeholder="Enter details"
                                    {...register('regNo')}
                                    error={!!errors.regNo}
                                    helperText={errors.regNo?.message}
                                    slotProps={{
                                        inputLabel: {
                                            sx: {
                                                color: 'rgba(0,0,0,0.7)',
                                                fontWeight: 600,
                                            }
                                        },
                                        input: {
                                            startAdornment: (
                                                <InputAdornment position="start">
                                                    <SearchIcon sx={{ color: 'primary.main', fontSize: 22 }} />
                                                </InputAdornment>
                                            ),
                                        }
                                    }}
                                    sx={{
                                        '& .MuiOutlinedInput-root': {
                                            borderRadius: 4,
                                            bgcolor: 'rgba(255,255,255,0.2)', // Transparent inputs
                                            backdropFilter: 'blur(10px)',
                                            '&:hover': { bgcolor: 'rgba(255,255,255,0.3)' }
                                        },
                                        '& .MuiInputLabel-root': { color: 'rgba(0,0,0,0.7)', fontWeight: 600 }
                                    }}
                                />

                                <TextField
                                    fullWidth
                                    label="Exam Date"
                                    type="date"
                                    InputLabelProps={{ shrink: true }}
                                    {...register('date')}
                                    error={!!errors.date}
                                    helperText={errors.date?.message}
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <CalendarIcon color="action" sx={{ fontSize: 20 }} />
                                            </InputAdornment>
                                        ),
                                    }}
                                    sx={{
                                        '& .MuiOutlinedInput-root': { borderRadius: 3, bgcolor: '#F8FAFC' },
                                        '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(0,0,0,0.08)' }
                                    }}
                                />

                                <Button
                                    fullWidth
                                    size="large"
                                    type="submit"
                                    variant="contained"
                                    disabled={mutation.isPending}
                                    disableElevation
                                    sx={{
                                        height: '54px',
                                        borderRadius: 3,
                                        fontSize: '0.95rem',
                                        fontWeight: 700,
                                        textTransform: 'none',
                                        bgcolor: '#1A1A1A',
                                        '&:hover': { bgcolor: '#333' }
                                    }}
                                >
                                    {mutation.isPending ? 'Searching...' : 'Find My Room'}
                                </Button>
                            </Stack>
                        </form>
                    </Paper>

                    {mutation.isPending && <ResultSkeleton />}

                    {searched && !mutation.isPending && !result && (
                        <Fade in={true}>
                            <Box sx={{
                                p: 6,
                                textAlign: 'center',
                                borderRadius: 4,
                                background: 'rgba(255, 255, 255, 0.2)', // High transparency
                                backdropFilter: 'blur(30px) saturate(200%)',
                                WebkitBackdropFilter: 'blur(30px) saturate(200%)',
                                border: '1px solid rgba(255, 255, 255, 0.4)',
                                boxShadow: '0 7px 15px -3px rgba(0,0,0,0.3)',
                            }}>
                                <Typography variant="h6" fontWeight={700} color="text.primary" gutterBottom>No Assignment Found</Typography>
                                <Typography variant="body2" color="text.secondary">We couldn't find any room allotment for the provided data. Please check your Registration No.</Typography>
                            </Box>
                        </Fade>
                    )}

                    {result && !mutation.isPending && (
                        <ResultCard result={result} />
                    )}
                </Stack>
            </Container>
        </Box>
    );
}
