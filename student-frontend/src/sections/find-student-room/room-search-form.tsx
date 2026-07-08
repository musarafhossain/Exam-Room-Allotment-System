"use client";
import { useMemo } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as zod from 'zod';
import {
    Box,
    Button,
    TextField,
    Stack,
    InputAdornment,
    Autocomplete,
} from '@mui/material';
import {
    Search as SearchIcon,
} from '@mui/icons-material';
import { useQuery } from '@tanstack/react-query';
import { SubjectService } from 'services';

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
    examType: string;
}

export default function RoomSearchForm({
    onSubmit,
    isPending,
    studentLabel,
    examType
}: RoomSearchFormProps) {
    const schema = useMemo(() => getSearchSchema(studentLabel || 'Registration Number'), [studentLabel]);

    const {
        register,
        handleSubmit,
        control,
        formState: { errors },
    } = useForm<SearchFormValues>({
        resolver: zodResolver(schema),
        defaultValues: {
            regNo: '',
            examType: examType || 'test',
            subject: ''
        }
    });

    const showSubjectField = useMemo(() => {
        return examType === 'test';
    }, [examType]);

    // Fetch subjects from the backend using SubjectService
    const { data: subjectsResponse, isPending: isLoadingSubjects } = useQuery({
        queryKey: ['exam-subjects-list'],
        queryFn: () => SubjectService.getExamSubjects({ limit: 1000 }),
        enabled: showSubjectField,
    });

    const subjects = useMemo(() => {
        if (!subjectsResponse?.data) return [];
        return subjectsResponse.data;
    }, [subjectsResponse]);

    return (
        <Box sx={{ width: '100%' }}>
            <form onSubmit={handleSubmit(onSubmit)}>
                <Stack spacing={3}>
                    <TextField
                        fullWidth
                        label={studentLabel || 'Registration Number'}
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

                    {showSubjectField && (
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
                    )}

                    <Button
                        fullWidth
                        size="large"
                        type="submit"
                        variant="contained"
                        loading={isPending}
                        disabled={isPending}
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
