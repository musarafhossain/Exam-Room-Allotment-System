"use client";

import React, { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import {
    Box,
    Container,
    Typography,
    Stack,
} from '@mui/material';
import { TeacherRoomService } from 'services';
import { TeacherRoomModel } from 'models';
import ResultCard from '../result-card';
import ResultSkeleton from '../result-skeleton';
import ResultEmpty from '../result-empty';
import ResultError from '../result-error';
import RoomSearchForm, { SearchFormValues } from '../room-search-form';
import Footer from 'components/common/Footer';
import { AxiosError } from 'axios';

export default function FindTeacherRoomView() {
    const [result, setResult] = useState<TeacherRoomModel[] | null>(null);
    const [searched, setSearched] = useState(false);
    const [lastData, setLastData] = useState<SearchFormValues | null>(null);
    const [isNetworkError, setIsNetworkError] = useState(false);

    const mutation = useMutation({
        mutationFn: (data: SearchFormValues) => TeacherRoomService.findTeacherRoom(data),
        onSuccess: (res) => {
            setSearched(true);
            setIsNetworkError(false);
            if (res.success && res.data) {
                setResult(Array.isArray(res.data) ? res.data : [res.data]);
            } else {
                setResult(null);
            }
        },
        onError: (error: AxiosError) => {
            setSearched(true);
            setResult(null);
            setIsNetworkError(!error.response);
        }
    });

    const onSubmit = (data: SearchFormValues) => {
        setLastData(data);
        setSearched(false);
        const payload = {
            name: data.name,
            ...(data.date ? { date: data.date } : {}),
        };
        mutation.mutate(payload);
    };

    const handleRetry = () => {
        if (lastData) {
            setSearched(false);
            const payload = {
                name: lastData.name,
                ...(lastData.date ? { date: lastData.date } : {}),
            };
            mutation.mutate(payload);
        }
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
            backgroundImage: `url('/assets/images/bg-student.png')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundAttachment: 'fixed',
            py: { xs: 4, md: 8 },
            px: { xs: 2, md: 0 },
            display: 'flex',
            alignItems: 'flex-start',
            position: 'relative',
            '&::before': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                bgcolor: 'rgba(255, 255, 255, 0.8)',
                backdropFilter: 'blur(3px)'
            }
        }}>
            <Container maxWidth="sm" sx={{ position: 'relative', zIndex: 1 }}>
                <Stack sx={{ pb: 10 }}>
                    <Box sx={{ textAlign: 'center', mt: 4 }}>
                        <Box
                            component="img"
                            src="/assets/images/logo.png"
                            alt="Logo"
                            sx={{
                                width: { xs: 80, md: 100 },
                                height: { xs: 80, md: 100 },
                                mb: 2,
                                mx: 'auto',
                                display: 'block',
                            }}
                        />
                        <Typography
                            variant="h3"
                            component="h1"
                            fontWeight={800}
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
                                fontWeight: 600,
                                mb: 4
                            }}
                        >
                            Find your examination duty assignments in seconds.
                        </Typography>
                    </Box>

                    <RoomSearchForm
                        onSubmit={onSubmit}
                        isPending={mutation.isPending}
                    />

                    {mutation.isPending && <ResultSkeleton />}

                    {searched && !mutation.isPending && !isNetworkError && displayResults.length === 0 && (
                        <ResultEmpty />
                    )}

                    {isNetworkError && !mutation.isPending && (
                        <ResultError onRetry={handleRetry} />
                    )}

                    {displayResults.length > 0 && !mutation.isPending && (
                        <Stack spacing={2.5} sx={{ width: '100%', mt: 4 }}>
                            {displayResults.map((entry, idx) => (
                                <ResultCard key={idx} index={idx} result={entry.item} shiftType={entry.shift} />
                            ))}
                        </Stack>
                    )}
                    <Footer />
                </Stack>
            </Container>
        </Box>
    );
}
