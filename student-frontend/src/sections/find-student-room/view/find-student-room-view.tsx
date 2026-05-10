"use client";

import React, { useState } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import {
    Box,
    Container,
    Typography,
    Stack,
} from '@mui/material';
import { StudentRoomService, SettingService } from 'services';
import { StudentRoomModel } from 'models';
import ResultCard from '../result-card';
import ResultSkeleton from '../result-skeleton';
import ResultEmpty from '../result-empty';
import ResultError from '../result-error';
import RoomSearchForm, { SearchFormValues } from '../room-search-form';
import Footer from 'components/common/Footer';
import { AxiosError } from 'axios';

export default function FindStudentRoomView() {
    const [result, setResult] = useState<StudentRoomModel | null>(null);
    const [searched, setSearched] = useState(false);
    const [lastData, setLastData] = useState<SearchFormValues | null>(null);
    const [isNetworkError, setIsNetworkError] = useState(false);

    // Fetch student-label setting
    const { data: settingResponse, isPending: isLoadingLabel } = useQuery({
        queryKey: ['setting', 'student-label'],
        queryFn: () => SettingService.getSettingByKey('student-label'),
    });

    const studentLabel = settingResponse?.data?.value;

    const mutation = useMutation({
        mutationFn: (data: SearchFormValues) => StudentRoomService.findStudentRoom(data),
        onSuccess: (res) => {
            setSearched(true);
            setIsNetworkError(false);
            if (res.success && res.data) {
                setResult(res.data);
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
        mutation.mutate(data);
    };

    const handleRetry = () => {
        if (lastData) {
            setSearched(false);
            mutation.mutate(lastData);
        }
    };

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
                                borderRadius: 4,
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
                            Find Room
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
                            Find your examination room assignment in seconds.
                        </Typography>
                    </Box>

                    <RoomSearchForm
                        onSubmit={onSubmit}
                        isPending={mutation.isPending}
                        studentLabel={studentLabel}
                        isLoadingLabel={isLoadingLabel}
                    />

                    {mutation.isPending && <ResultSkeleton />}

                    {searched && !mutation.isPending && !isNetworkError && !result && (
                        <ResultEmpty />
                    )}

                    {isNetworkError && !mutation.isPending && (
                        <ResultError onRetry={handleRetry} />
                    )}

                    {result && !mutation.isPending && (
                        <ResultCard result={result} />
                    )}
                    <Footer />
                </Stack>
            </Container>
        </Box>
    );
}
