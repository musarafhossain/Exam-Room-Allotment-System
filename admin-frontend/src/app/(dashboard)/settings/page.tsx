"use client";

import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as zod from 'zod';
import {
    Box,
    Typography,
    TextField,
    Button,
    Stack,
    Grid,
    Skeleton,
    CircularProgress,
    Card,
    CardContent,
} from '@mui/material';
import { Save as SaveIcon } from '@mui/icons-material';
import { SettingService } from 'services';
import toast from 'react-hot-toast';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

const settingSchema = zod.object({
    studentLabel: zod.string().max(50, 'Label is too long'),
});

type SettingFormValues = zod.infer<typeof settingSchema>;

export default function SettingsPage() {
    const queryClient = useQueryClient();

    const {
        register,
        handleSubmit,
        setValue,
        formState: { errors },
    } = useForm<SettingFormValues>({
        resolver: zodResolver(settingSchema),
        defaultValues: {
            studentLabel: '',
        }
    });

    // Fetch student-label setting specifically
    const { data: settingResponse, isLoading } = useQuery({
        queryKey: ['setting', 'student-label'],
        queryFn: () => SettingService.getSettingByKey('student-label'),
    });

    useEffect(() => {
        if (settingResponse?.success && settingResponse.data) {
            setValue('studentLabel', settingResponse.data.value);
        }
    }, [settingResponse, setValue]);

    // Mutation for updating setting
    const mutation = useMutation({
        mutationFn: (params: { key: string, value: string }) => SettingService.updateSetting(params),
        onSuccess: (res) => {
            if (res.success) {
                toast.success('Label updated successfully!');
                queryClient.invalidateQueries({ queryKey: ['setting', 'student-label'] });
            } else {
                toast.error(res.message || 'Failed to update label');
            }
        },
        onError: (error: any) => {
            toast.error(error?.response?.data?.message || 'Something went wrong');
        }
    });

    const onSubmit = (data: SettingFormValues) => {
        mutation.mutate({ key: 'student-label', value: data.studentLabel });
    };

    // Loading state is now handled inline for better UX
    const isPageLoading = isLoading;

    return (
        <Box sx={{ pb: 5 }}>
            <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 4 }}>
                <Box>
                    <Typography variant="h4" fontWeight={900} sx={{ letterSpacing: -1 }}>
                        Settings
                    </Typography>
                </Box>
            </Stack>

            <Grid container spacing={4}>
                <Grid size={{ xs: 12 }}>
                    <Card sx={{ borderRadius: 4, border: '1px solid', borderColor: 'divider', boxShadow: 'none' }}>
                        <CardContent sx={{ p: 4 }}>
                            <form onSubmit={handleSubmit(onSubmit)}>
                                <Stack 
                                    direction={{ xs: 'column', md: 'row' }} 
                                    spacing={3} 
                                    alignItems={{ md: 'flex-start' }}
                                >
                                    <Box sx={{ flexGrow: 1 }}>
                                        <Typography variant="subtitle1" fontWeight={700} gutterBottom>
                                            Student Section Input Label
                                        </Typography>
                                        {isPageLoading ? (
                                            <Skeleton variant="rectangular" height={56} sx={{ borderRadius: 3 }} />
                                        ) : (
                                            <TextField
                                                fullWidth
                                                variant="outlined"
                                                placeholder="e.g. Registration Number / Roll Number"
                                                {...register('studentLabel')}
                                                error={!!errors.studentLabel}
                                                helperText={errors.studentLabel?.message}
                                                sx={{ 
                                                    '& .MuiOutlinedInput-root': { borderRadius: 3 } 
                                                }}
                                            />
                                        )}
                                    </Box>

                                    <Box sx={{ pt: { xs: 0, md: 4 }, minWidth: { md: 240 } }}>
                                        {isPageLoading ? (
                                            <Skeleton variant="rectangular" height={56} sx={{ borderRadius: '12px' }} />
                                        ) : (
                                            <Button
                                                fullWidth
                                                variant="contained"
                                                color="error"
                                                size="large"
                                                type="submit"
                                                startIcon={mutation.isPending ? <CircularProgress size={20} color="inherit" /> : <SaveIcon />}
                                                disabled={mutation.isPending}
                                                sx={{ 
                                                    borderRadius: '12px', 
                                                    px: 6,
                                                    py: 1.8, 
                                                    textTransform: 'none',
                                                    fontWeight: 700,
                                                    whiteSpace: 'nowrap'
                                                }}
                                            >
                                                {mutation.isPending ? 'Saving...' : 'Save Setting'}
                                            </Button>
                                        )}
                                    </Box>
                                </Stack>
                            </form>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </Box>
    );
}
