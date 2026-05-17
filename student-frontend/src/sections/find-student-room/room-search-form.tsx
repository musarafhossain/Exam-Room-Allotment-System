"use client";
import React, { useMemo, useEffect } from 'react';
import { useForm, Controller, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as zod from 'zod';
import {
    Box,
    Button,
    TextField,
    Stack,
    InputAdornment,
    Skeleton,
    Autocomplete,
    Fade,
} from '@mui/material';
import {
    Search as SearchIcon,
} from '@mui/icons-material';
import { useQuery } from '@tanstack/react-query';
import { SubjectService, SettingService } from 'services';

export const getSearchSchema = (label: string) => zod.object({
    regNo: zod.string().min(1, `${label} is required`).max(20, 'Maximum 20 digits allowed'),
    examType: zod.string().min(1, 'Exam type is required'),
    subject: zod.string().optional(),
}).refine((data) => {
    if (data.examType === 'test' && !data.subject) {
        return false;
    }
    return true;
}, {
    message: 'Subject is required',
    path: ['subject']
});

export type SearchFormValues = zod.infer<ReturnType<typeof getSearchSchema>>;

interface RoomSearchFormProps {
    onSubmit: (data: SearchFormValues) => void;
    isPending: boolean;
    studentLabel?: string;
    isLoadingLabel?: boolean;
}

export default function RoomSearchForm({
    onSubmit,
    isPending,
    studentLabel,
    isLoadingLabel
}: RoomSearchFormProps) {
    const schema = useMemo(() => getSearchSchema(studentLabel || 'Registration Number'), [studentLabel]);

    const {
        register,
        handleSubmit,
        control,
        setValue,
        formState: { errors },
    } = useForm<SearchFormValues>({
        resolver: zodResolver(schema),
        defaultValues: {
            regNo: '',
            examType: 'test',
            subject: ''
        }
    });

    const examType = useWatch({ control, name: 'examType' });

    // Fetch exam-type setting dynamically
    const { data: examTypeResponse, isPending: isLoadingExamType } = useQuery({
        queryKey: ['setting', 'exam-type'],
        queryFn: () => SettingService.getSettingByKey('exam-type'),
    });

    const activeExamType = useMemo(() => {
        return examTypeResponse?.data?.value || 'test';
    }, [examTypeResponse]);

    // Update active selection when dynamic exam type loads
    useEffect(() => {
        setValue('examType', activeExamType);
    }, [activeExamType, setValue]);

    const showSubjectField = useMemo(() => {
        return examType === 'test';
    }, [examType]);

    // Fetch subjects from the backend using SubjectService
    const { data: subjectsResponse, isPending: isLoadingSubjects } = useQuery({
        queryKey: ['subjects-list'],
        queryFn: () => SubjectService.getList({ limit: 1000 }),
    });

    const subjects = useMemo(() => {
        if (!subjectsResponse?.items) return [];
        return subjectsResponse.items
            .map((s: { name?: string }) => s.name)
            .filter((name): name is string => !!name)
            .sort((a, b) => a.localeCompare(b));
    }, [subjectsResponse]);

    return (
        <Box sx={{ width: '100%' }}>
            <form onSubmit={handleSubmit(onSubmit)}>
                <Stack spacing={3}>
                    {isLoadingExamType ? (
                        <Skeleton
                            variant="rectangular"
                            height={56}
                            animation="wave"
                            sx={{
                                borderRadius: 4,
                            }}
                        />
                    ) : (
                        showSubjectField && (
                            <Fade in={showSubjectField} timeout={400}>
                                <Box>
                                    <Controller
                                        name="subject"
                                        control={control}
                                        render={({ field: { value, onChange, ...field } }) => (
                                            <Autocomplete
                                                {...field}
                                                options={subjects}
                                                getOptionLabel={(option) => option}
                                                loading={isLoadingSubjects}
                                                disabled={isLoadingSubjects}
                                                value={value || null}
                                                onChange={(_, newValue) => onChange(newValue || '')}
                                                renderInput={(params) => (
                                                    <TextField
                                                        {...params}
                                                        label="Subject"
                                                        placeholder="Select Subject"
                                                        error={!!errors.subject}
                                                        helperText={errors.subject?.message}
                                                        slotProps={{
                                                            inputLabel: {
                                                                shrink: true,
                                                                sx: {
                                                                    color: 'rgba(0,0,0,0.7)',
                                                                    fontWeight: 600,
                                                                }
                                                            }
                                                        }}
                                                        sx={{
                                                            '& .MuiOutlinedInput-root': {
                                                                borderRadius: 4,
                                                                bgcolor: 'rgba(255,255,255,0.2)',
                                                                backdropFilter: 'blur(10px)',
                                                                '&:hover': { bgcolor: 'rgba(255,255,255,0.3)' }
                                                            },
                                                            '& .MuiOutlinedInput-input': {
                                                                fontWeight: 600,
                                                                color: '#000',
                                                                fontSize: { xs: '1rem', sm: '1.2rem' },
                                                                py: { xs: 0.8, sm: 1 }
                                                            },
                                                        }}
                                                    />
                                                )}
                                            />
                                        )}
                                    />
                                </Box>
                            </Fade>
                        )
                    )}

                    <TextField
                        fullWidth
                        label={
                            isLoadingLabel ? (
                                <Box component="span" sx={{ position: 'relative', display: 'inline-flex', alignItems: 'center' }}>
                                    <Box component="span" sx={{ opacity: 0 }}>Registration Number</Box>
                                    <Skeleton
                                        variant="rectangular"
                                        animation="pulse"
                                        sx={{
                                            position: 'absolute',
                                            left: 0,
                                            width: '100%',
                                            height: 18,
                                            borderRadius: 2,
                                            bgcolor: 'rgba(0,0,0,0.12)',
                                        }}
                                    />
                                </Box>
                            ) : (
                                studentLabel || 'Registration Number'
                            )
                        }
                        placeholder="Enter here"
                        {...register('regNo')}
                        error={!!errors.regNo}
                        helperText={errors.regNo?.message}
                        slotProps={{
                            inputLabel: {
                                shrink: true,
                                sx: {
                                    color: 'rgba(0,0,0,0.7)',
                                    fontWeight: 600,
                                }
                            },
                            input: {
                                type: 'number',
                                inputProps: { maxLength: 20 },
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
                                bgcolor: 'rgba(255,255,255,0.2)',
                                backdropFilter: 'blur(10px)',
                                '&:hover': { bgcolor: 'rgba(255,255,255,0.3)' }
                            },
                            '& .MuiOutlinedInput-input': {
                                fontWeight: 600,
                                color: '#000',
                                fontSize: { xs: '1.2rem', sm: '1.5rem' },
                                py: 1.7
                            },
                        }}
                    />
                    <Button
                        fullWidth
                        size="large"
                        type="submit"
                        variant="contained"
                        loading={isPending}
                        disabled={isPending || isLoadingExamType}
                        disableElevation
                        sx={{
                            height: { xs: '48px', sm: '54px' },
                            borderRadius: 3,
                            fontSize: { xs: '1rem', sm: '1.1rem' },
                            fontWeight: 700,
                            textTransform: 'none',
                            bgcolor: '#1A1A1A',
                        }}
                        disableRipple
                    >
                        {isPending ? 'Searching...' : 'Find My Room'}
                    </Button>
                </Stack>
            </form>
        </Box>
    );
}
