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

    return (
        <Box sx={{ 
            minHeight: '100vh', 
            bgcolor: 'background.default',
            background: 'linear-gradient(180deg, rgba(232, 26, 115, 0.05) 0%, rgba(232, 26, 115, 0) 100%)',
            py: { xs: 6, md: 12 },
            px: { xs: 2, md: 0 }
        }}>
            <Container maxWidth="md">
                <Stack spacing={4} alignItems="center">
                    <Box sx={{ textAlign: 'center', mb: { xs: 2, md: 4 } }}>
                        <Typography 
                            variant="h2" 
                            component="h1" 
                            gutterBottom 
                            fontWeight={800} 
                            sx={{ 
                                background: 'linear-gradient(45deg, #d32f2f 30%, #ff5252 90%)',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                                fontSize: { xs: '2.25rem', sm: '3rem', md: '3.75rem' },
                                letterSpacing: -1.5,
                                lineHeight: 1.1
                            }}
                        >
                            Teacher Room Finder
                        </Typography>
                        <Typography 
                          variant="h6" 
                          color="text.secondary" 
                          sx={{ 
                            maxWidth: 600, 
                            mx: 'auto', 
                            fontWeight: 400,
                            fontSize: { xs: '1rem', md: '1.25rem' },
                            lineHeight: 1.6,
                            mt: 1
                          }}
                        >
                            Enter your name and the exam date to find your assigned duty room.
                        </Typography>
                    </Box>

                    <Card sx={{ 
                        p: { xs: 4, md: 6 }, 
                        width: '100%', 
                        boxShadow: '0px 40px 80px rgba(0,0,0,0.08)', 
                        borderRadius: 5,
                        border: '1px solid',
                        borderColor: 'divider',
                        bgcolor: 'background.paper'
                    }}>
                        <form onSubmit={handleSubmit(onSubmit)}>
                            <Grid container spacing={3}>
                                <Grid size={{ xs: 12, md: 6 }}>
                                    <TextField
                                        fullWidth
                                        label="Teacher Name"
                                        placeholder="e.g. John Doe"
                                        {...register('name')}
                                        error={!!errors.name}
                                        helperText={errors.name?.message}
                                        InputProps={{
                                            startAdornment: (
                                                <InputAdornment position="start">
                                                    <PersonIcon color="action" />
                                                </InputAdornment>
                                            ),
                                        }}
                                        sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3 } }}
                                    />
                                </Grid>
                                <Grid size={{ xs: 12, md: 6 }}>
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
                                                    <CalendarIcon color="action" />
                                                </InputAdornment>
                                            ),
                                        }}
                                        sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3 } }}
                                    />
                                </Grid>
                                <Grid size={{ xs: 12 }}>
                                    <Button
                                        fullWidth
                                        size="large"
                                        type="submit"
                                        variant="contained"
                                        disabled={mutation.isPending}
                                        color="error"
                                        sx={{ 
                                            height: '56px', 
                                            borderRadius: 3, 
                                            fontSize: '1rem', 
                                            fontWeight: 700,
                                            boxShadow: '0px 10px 20px rgba(211, 47, 47, 0.3)',
                                            textTransform: 'none'
                                        }}
                                    >
                                        Find My Assignment
                                    </Button>
                                </Grid>
                            </Grid>
                        </form>
                    </Card>

                    {mutation.isPending && <ResultSkeleton />}

                    {searched && !mutation.isPending && (!result || result.length === 0) && (
                        <Fade in={true}>
                            <Paper sx={{ p: 5, width: '100%', textAlign: 'center', borderRadius: 4, bgcolor: 'rgba(255,255,255,0.8)' }}>
                                <Typography variant="h5" fontWeight={700} color="error" gutterBottom>No Assignment Found</Typography>
                                <Typography color="text.secondary">We couldn't find any duty room allotment for the provided name and date.</Typography>
                            </Paper>
                        </Fade>
                    )}

                    {result && !mutation.isPending && (
                        <Stack spacing={3} sx={{ width: '100%' }}>
                             {result.map((item, idx) => (
                                 <ResultCard key={idx} result={item} />
                             ))}
                        </Stack>
                    )}
                </Stack>
            </Container>
        </Box>
    );
}
