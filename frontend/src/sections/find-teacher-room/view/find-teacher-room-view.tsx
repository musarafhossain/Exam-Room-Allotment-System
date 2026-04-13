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
    Person as PersonIcon, 
    CalendarMonth as CalendarIcon
} from '@mui/icons-material';
import { TeacherRoomService } from 'services';
import { TeacherRoomModel } from 'models';
import toast from 'react-hot-toast';
import ResultCard from '../result-card';
import ResultSkeleton from '../result-skeleton';

const searchSchema = zod.object({
    name: zod.string().min(1, 'Teacher name is required'),
    date: zod.string().min(1, 'Date is required'),
});

type SearchFormValues = zod.infer<typeof searchSchema>;

export default function FindTeacherRoomView() {
    const [result, setResult] = useState<TeacherRoomModel[] | null>(null);
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
        mutationFn: (data: SearchFormValues) => TeacherRoomService.findTeacherRoom(data),
        onSuccess: (res) => {
            setSearched(true);
            if (res.success && res.data) {
                setResult(Array.isArray(res.data) ? res.data : [res.data]);
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
        setSearched(false);
        mutation.mutate(data);
    };

    const splitShifts = (items: TeacherRoomModel[]) => {
        const entries: { item: TeacherRoomModel, shift: 1 | 2 }[] = [];
        items.forEach(item => {
            if (item.shift1) entries.push({ item, shift: 1 });
            if (item.shift2) entries.push({ item, shift: 2 });
        });
        return entries;
    };

    const displayResults = result ? splitShifts(result) : [];

    return (
        <Box sx={{ 
            minHeight: '100vh', 
            bgcolor: '#000',
            backgroundImage: `url('/assets/bg-teacher.jpg')`,
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
                bgcolor: 'rgba(255, 255, 255, 0.2)', 
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
                        <Box sx={{ width: 40, height: 4, bgcolor: 'error.main', mx: 'auto', borderRadius: 2, mb: 2 }} />
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
                            Find your examination duty assignments in seconds.
                        </Typography>
                    </Box>

                    <Paper elevation={0} sx={{ 
                        p: { xs: 3, md: 5 }, 
                        width: '100%', 
                        background: 'rgba(255, 255, 255, 0.2)',
                        backdropFilter: 'blur(30px) saturate(200%)',
                        WebkitBackdropFilter: 'blur(30px) saturate(200%)',
                        borderRadius: 6,
                        border: '1px solid rgba(255, 255, 255, 0.4)',
                        boxShadow: '0 30px 60px -12px rgba(0,0,0,0.3)',
                    }}>
                        <form onSubmit={handleSubmit(onSubmit)}>
                            <Stack spacing={3}>
                                <TextField
                                    fullWidth
                                    label="Name"
                                    placeholder="Enter your full name"
                                    {...register('name')}
                                    error={!!errors.name}
                                    helperText={errors.name?.message}
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <PersonIcon sx={{ color: 'error.main', fontSize: 22 }} />
                                            </InputAdornment>
                                        ),
                                    }}
                                    sx={{ 
                                        '& .MuiOutlinedInput-root': { 
                                            borderRadius: 4, 
                                            bgcolor: 'rgba(255,255,255,0.2)',
                                            backdropFilter: 'blur(10px)',
                                            '&:hover': { bgcolor: 'rgba(255,255,255,0.3)' }
                                        },
                                        '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255,255,255,0.3)' },
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
                                    {mutation.isPending ? 'Searching...' : 'Check My Duty'}
                                </Button>
                            </Stack>
                        </form>
                    </Paper>

                    {mutation.isPending && <ResultSkeleton />}

                    {searched && !mutation.isPending && displayResults.length === 0 && (
                        <Fade in={true}>
                            <Box sx={{ 
                                p: 6, 
                                textAlign: 'center', 
                                borderRadius: 4, 
                                border: '1px dashed rgba(0,0,0,0.1)',
                                bgcolor: 'rgba(255,255,255,0.5)'
                            }}>
                                <Typography variant="h6" fontWeight={700} color="text.primary" gutterBottom>No Duties Found</Typography>
                                <Typography variant="body2" color="text.secondary">We couldn't find any assignments for these details. Please double-check the spelling of your name.</Typography>
                            </Box>
                        </Fade>
                    )}

                    {displayResults.length > 0 && !mutation.isPending && (
                        <Stack spacing={2.5} sx={{ width: '100%' }}>
                            <Typography variant="overline" color="text.disabled" fontWeight={800} sx={{ textAlign: 'center', letterSpacing: 2 }}>
                                {displayResults.length} {displayResults.length === 1 ? 'Duty' : 'Duties'} Found
                            </Typography>
                             {displayResults.map((entry, idx) => (
                                 <ResultCard key={idx} result={entry.item} shiftType={entry.shift} />
                             ))}
                        </Stack>
                    )}
                </Stack>
            </Container>
        </Box>
    );
}
