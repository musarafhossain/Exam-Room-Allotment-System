"use client";

import React, { useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
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
    MenuItem,
    Radio,
    FormControl,
    FormHelperText,
} from '@mui/material';
import { Save as SaveIcon } from '@mui/icons-material';
import { SettingService } from 'services';
import toast from 'react-hot-toast';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

const settingSchema = zod.object({
    studentLabel: zod.string().max(50, 'Label is too long'),
    examType: zod.enum(['test', 'final', 'others']),
    studentAllotmentDisplayDate: zod.enum(['on_exam_day', 'one_day_before']),
    studentAllotmentDisplayTime: zod.string().regex(/^([01]\d|2[0-3]):?([0-5]\d)$/, 'Invalid time format').min(1, 'Required'),
});

type SettingFormValues = zod.infer<typeof settingSchema>;

export default function SettingsPage() {
    const queryClient = useQueryClient();

    const {
        register,
        handleSubmit,
        setValue,
        control,
        formState: { errors },
    } = useForm<SettingFormValues>({
        resolver: zodResolver(settingSchema),
        defaultValues: {
            studentLabel: '',
            examType: 'test',
            studentAllotmentDisplayDate: 'on_exam_day',
            studentAllotmentDisplayTime: '00:00',
        }
    });

    // Fetch student-label setting specifically
    const { data: settingResponse, isLoading: isLoadingLabel } = useQuery({
        queryKey: ['setting', 'student-label'],
        queryFn: () => SettingService.getSettingByKey('student-label'),
    });

    // Fetch exam-type setting specifically
    const { data: examTypeResponse, isLoading: isLoadingExamType } = useQuery({
        queryKey: ['setting', 'exam-type'],
        queryFn: () => SettingService.getSettingByKey('exam-type'),
    });

    const { data: displayDateResponse, isLoading: isLoadingDisplayDate } = useQuery({
        queryKey: ['setting', 'student-allotment-display-date'],
        queryFn: () => SettingService.getSettingByKey('student-allotment-display-date'),
    });

    const { data: displayTimeResponse, isLoading: isLoadingDisplayTime } = useQuery({
        queryKey: ['setting', 'student-allotment-display-time'],
        queryFn: () => SettingService.getSettingByKey('student-allotment-display-time'),
    });

    useEffect(() => {
        if (settingResponse?.success && settingResponse.data) {
            setValue('studentLabel', settingResponse.data.value);
        }
    }, [settingResponse, setValue]);

    useEffect(() => {
        if (examTypeResponse?.success && examTypeResponse.data) {
            setValue('examType', examTypeResponse.data.value as 'test' | 'final' | 'others');
        } else if (examTypeResponse && !examTypeResponse.success) {
            setValue('examType', 'test');
        }
    }, [examTypeResponse, setValue]);

    useEffect(() => {
        if (displayDateResponse?.success && displayDateResponse.data) {
            setValue('studentAllotmentDisplayDate', displayDateResponse.data.value as 'on_exam_day' | 'one_day_before');
        } else if (displayDateResponse && !displayDateResponse.success) {
            setValue('studentAllotmentDisplayDate', 'on_exam_day');
        }
    }, [displayDateResponse, setValue]);

    useEffect(() => {
        if (displayTimeResponse?.success && displayTimeResponse.data) {
            setValue('studentAllotmentDisplayTime', displayTimeResponse.data.value);
        } else if (displayTimeResponse && !displayTimeResponse.success) {
            setValue('studentAllotmentDisplayTime', '00:00');
        }
    }, [displayTimeResponse, setValue]);

    // Mutation for updating setting
    const mutation = useMutation({
        mutationFn: (params: { key: string, value: string }) => SettingService.updateSetting(params),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['setting'] });
        },
        onError: (error: any) => {
            toast.error(error?.response?.data?.message || 'Something went wrong');
        }
    });

    const onSubmit = async (data: SettingFormValues) => {
        try {
            await mutation.mutateAsync({ key: 'student-label', value: data.studentLabel });
            await mutation.mutateAsync({ key: 'exam-type', value: data.examType });
            await mutation.mutateAsync({ key: 'student-allotment-display-date', value: data.studentAllotmentDisplayDate });
            await mutation.mutateAsync({ key: 'student-allotment-display-time', value: data.studentAllotmentDisplayTime });
            toast.success('Settings updated successfully!');
        } catch {
            toast.error('Failed to update settings');
        }
    };

    const isPageLoading = isLoadingLabel || isLoadingExamType || isLoadingDisplayDate || isLoadingDisplayTime;

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
                                <Stack spacing={4}>
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

                                    <Box sx={{ flexGrow: 1 }}>
                                        <Typography variant="subtitle1" fontWeight={700} gutterBottom>
                                            Active Exam Type
                                        </Typography>
                                        {isPageLoading ? (
                                            <Grid container spacing={2}>
                                                {[1, 2, 3].map((i) => (
                                                    <Grid key={i} size={{ xs: 12, sm: 4 }}>
                                                        <Skeleton variant="rectangular" height={80} sx={{ borderRadius: 3 }} />
                                                    </Grid>
                                                ))}
                                            </Grid>
                                        ) : (
                                            <Controller
                                                name="examType"
                                                control={control}
                                                render={({ field }) => (
                                                    <FormControl error={!!errors.examType} component="fieldset" fullWidth>
                                                        <Grid container spacing={2}>
                                                            {[
                                                                { value: 'test', label: 'Test Exam', desc: 'Short-term or periodic college tests' },
                                                                { value: 'final', label: 'Final Exam', desc: 'End-of-term university final exams' },
                                                                { value: 'others', label: 'Others', desc: 'Special cases, competitive or other exams' }
                                                            ].map((item) => {
                                                                const isSelected = field.value === item.value;
                                                                return (
                                                                    <Grid key={item.value} size={{ xs: 12, sm: 4 }}>
                                                                        <Box
                                                                            onClick={() => field.onChange(item.value)}
                                                                            sx={{
                                                                                border: '1px solid',
                                                                                borderColor: isSelected ? 'primary.main' : 'divider',
                                                                                borderRadius: 3,
                                                                                p: 2,
                                                                                cursor: 'pointer',
                                                                                backgroundColor: isSelected ? 'rgba(26, 115, 232, 0.04)' : 'background.paper',
                                                                                transition: 'all 0.2s ease-in-out',
                                                                                '&:hover': {
                                                                                    borderColor: isSelected ? 'primary.main' : 'text.secondary',
                                                                                    bgcolor: isSelected ? 'rgba(26, 115, 232, 0.06)' : 'rgba(0, 0, 0, 0.02)',
                                                                                },
                                                                                display: 'flex',
                                                                                alignItems: 'flex-start',
                                                                                gap: 1.5
                                                                            }}
                                                                        >
                                                                            <Radio
                                                                                checked={isSelected}
                                                                                onChange={() => field.onChange(item.value)}
                                                                                value={item.value}
                                                                                name="examType"
                                                                                sx={{ 
                                                                                    p: 0, 
                                                                                    color: 'text.secondary', 
                                                                                    '&.Mui-checked': { color: 'primary.main' },
                                                                                    mt: 0.25
                                                                              }}
                                                                            />
                                                                            <Box>
                                                                                <Typography variant="body2" fontWeight={700} color={isSelected ? 'primary.main' : 'text.primary'}>
                                                                                    {item.label}
                                                                                </Typography>
                                                                                <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.5, lineHeight: 1.3 }}>
                                                                                    {item.desc}
                                                                                </Typography>
                                                                            </Box>
                                                                        </Box>
                                                                    </Grid>
                                                                );
                                                            })}
                                                        </Grid>
                                                        {errors.examType?.message && (
                                                            <FormHelperText error sx={{ mt: 1 }}>{errors.examType.message}</FormHelperText>
                                                        )}
                                                    </FormControl>
                                                )}
                                            />
                                        )}
                                    </Box>

                                    <Box sx={{ flexGrow: 1 }}>
                                        <Typography variant="subtitle1" fontWeight={700} gutterBottom>
                                            Schedule Time for Showing Student Room Allotment
                                        </Typography>
                                        {isPageLoading ? (
                                            <Skeleton variant="rectangular" height={56} sx={{ borderRadius: 3 }} />
                                        ) : (
                                            <Grid container spacing={4}>
                                                <Grid size={{ xs: 12, md: 8 }}>
                                                    <Controller
                                                        name="studentAllotmentDisplayDate"
                                                        control={control}
                                                        render={({ field }) => (
                                                            <FormControl error={!!errors.studentAllotmentDisplayDate} component="fieldset" fullWidth>
                                                                <Grid container spacing={2}>
                                                                    {[
                                                                        { value: 'on_exam_day', label: 'On Exam Day', desc: 'Display allotment on the day of the exam' },
                                                                        { value: 'one_day_before', label: 'One Day Before', desc: 'Display allotment starting from the day before the exam' }
                                                                    ].map((item) => {
                                                                        const isSelected = field.value === item.value;
                                                                        return (
                                                                            <Grid key={item.value} size={{ xs: 12, sm: 6 }}>
                                                                                <Box
                                                                                    onClick={() => field.onChange(item.value)}
                                                                                    sx={{
                                                                                        border: '1px solid',
                                                                                        borderColor: isSelected ? 'primary.main' : 'divider',
                                                                                        borderRadius: 3,
                                                                                        p: 2,
                                                                                        cursor: 'pointer',
                                                                                        backgroundColor: isSelected ? 'rgba(26, 115, 232, 0.04)' : 'background.paper',
                                                                                        transition: 'all 0.2s ease-in-out',
                                                                                        '&:hover': {
                                                                                            borderColor: isSelected ? 'primary.main' : 'text.secondary',
                                                                                            bgcolor: isSelected ? 'rgba(26, 115, 232, 0.06)' : 'rgba(0, 0, 0, 0.02)',
                                                                                        },
                                                                                        display: 'flex',
                                                                                        alignItems: 'flex-start',
                                                                                        gap: 1.5
                                                                                    }}
                                                                                >
                                                                                    <Radio
                                                                                        checked={isSelected}
                                                                                        onChange={() => field.onChange(item.value)}
                                                                                        value={item.value}
                                                                                        name="studentAllotmentDisplayDate"
                                                                                        sx={{ 
                                                                                            p: 0, 
                                                                                            color: 'text.secondary', 
                                                                                            '&.Mui-checked': { color: 'primary.main' },
                                                                                            mt: 0.25
                                                                                        }}
                                                                                    />
                                                                                    <Box>
                                                                                        <Typography variant="body2" fontWeight={700} color={isSelected ? 'primary.main' : 'text.primary'}>
                                                                                            {item.label}
                                                                                        </Typography>
                                                                                        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.5, lineHeight: 1.3 }}>
                                                                                            {item.desc}
                                                                                        </Typography>
                                                                                    </Box>
                                                                                </Box>
                                                                            </Grid>
                                                                        );
                                                                    })}
                                                                </Grid>
                                                                {errors.studentAllotmentDisplayDate?.message && (
                                                                    <FormHelperText error sx={{ mt: 1 }}>{errors.studentAllotmentDisplayDate.message}</FormHelperText>
                                                                )}
                                                            </FormControl>
                                                        )}
                                                    />
                                                </Grid>
                                                <Grid size={{ xs: 12, md: 4 }}>
                                                    <TextField
                                                        fullWidth
                                                        variant="outlined"
                                                        type="time"
                                                        label="Display Time"
                                                        {...register('studentAllotmentDisplayTime')}
                                                        error={!!errors.studentAllotmentDisplayTime}
                                                        helperText={errors.studentAllotmentDisplayTime?.message}
                                                        InputLabelProps={{ shrink: true }}
                                                        sx={{ 
                                                            '& .MuiOutlinedInput-root': { borderRadius: 3 } 
                                                        }}
                                                    />
                                                </Grid>
                                            </Grid>
                                        )}
                                    </Box>

                                    <Box sx={{ pt: 2, display: 'flex', justifyContent: 'flex-end' }}>
                                        {isPageLoading ? (
                                            <Skeleton variant="rectangular" width={200} height={56} sx={{ borderRadius: '12px' }} />
                                        ) : (
                                            <Button
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
                                                {mutation.isPending ? 'Saving...' : 'Save Settings'}
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
