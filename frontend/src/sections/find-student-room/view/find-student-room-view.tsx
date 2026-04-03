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
            bgcolor: 'background.default',
            background: 'linear-gradient(180deg, rgba(26, 115, 232, 0.05) 0%, rgba(26, 115, 232, 0) 100%)',
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
                                background: 'linear-gradient(45deg, #1a73e8 30%, #64b5f6 90%)',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                                fontSize: { xs: '2.25rem', sm: '3rem', md: '3.75rem' },
                                letterSpacing: -1.5,
                                lineHeight: 1.1
                            }}
                        >
                            Exam Room Finder
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
                            Quickly locate your assigned examination room. Just enter your details below.
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
                                        label="Registration Number"
                                        placeholder="e.g. 2021000123"
                                        {...register('regNo')}
                                        error={!!errors.regNo}
                                        helperText={errors.regNo?.message}
                                        InputProps={{
                                            startAdornment: (
                                                <InputAdornment position="start">
                                                    <SearchIcon color="action" />
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
                                <Grid size={{ xs: 12, md: 6 }}>
                                    <Button
                                        fullWidth
                                        size="large"
                                        type="submit"
                                        variant="contained"
                                        disabled={mutation.isPending}
                                        sx={{ 
                                            height: '56px', 
                                            borderRadius: 3, 
                                            fontSize: '1rem', 
                                            fontWeight: 700,
                                            boxShadow: '0px 10px 20px rgba(26, 115, 232, 0.3)',
                                            textTransform: 'none'
                                        }}
                                    >
                                        Find My Room
                                    </Button>
                                </Grid>
                            </Grid>
                        </form>
                    </Card>

                    {mutation.isPending && <ResultSkeleton />}

                    {searched && !mutation.isPending && !result && (
                        <Fade in={true}>
                            <Paper sx={{ p: 5, width: '100%', textAlign: 'center', borderRadius: 4, bgcolor: 'rgba(255,255,255,0.8)' }}>
                                <Typography variant="h5" fontWeight={700} color="error" gutterBottom>No Data Found</Typography>
                                <Typography color="text.secondary">We couldn't find any room allotment for the provided details. Please check your registration number and date.</Typography>
                            </Paper>
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
