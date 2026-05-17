"use client";

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as zod from 'zod';
import {
    Box,
    Button,
    TextField,
    Stack,
    InputAdornment,
} from '@mui/material';
import {
    Person as PersonIcon,
    CalendarMonth as CalendarIcon,
} from '@mui/icons-material';

export const searchSchema = zod.object({
    name: zod.string().min(1, 'Teacher name is required'),
    date: zod.string().optional().or(zod.literal('')),
});

export type SearchFormValues = zod.infer<typeof searchSchema>;

interface RoomSearchFormProps {
    onSubmit: (data: SearchFormValues) => void;
    isPending: boolean;
}

export default function RoomSearchForm({ 
    onSubmit, 
    isPending,
}: RoomSearchFormProps) {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<SearchFormValues>({
        resolver: zodResolver(searchSchema),
        defaultValues: {
            name: '',
            date: '',
        },
    });

    return (
        <Box sx={{ width: '100%' }}>
            <form onSubmit={handleSubmit(onSubmit)}>
                <Stack spacing={3}>
                    <TextField
                        fullWidth
                        label="Teacher Name"
                        placeholder="Enter your full name"
                        {...register('name')}
                        error={!!errors.name}
                        helperText={errors.name?.message}
                        slotProps={{
                            inputLabel: {
                                shrink: true,
                                sx: {
                                    color: 'rgba(0,0,0,0.7)',
                                    fontWeight: 600,
                                }
                            },
                            input: {
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <PersonIcon sx={{ color: 'primary.main', fontSize: 22 }} />
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
                                fontSize: '1.25rem',
                                py: 1.8
                            },
                        }}
                    />

                    <TextField
                        fullWidth
                        label="Exam Date"
                        type="date"
                        {...register('date')}
                        error={!!errors.date}
                        helperText={errors.date?.message}
                        slotProps={{
                            inputLabel: {
                                shrink: true,
                                sx: {
                                    color: 'rgba(0,0,0,0.7)',
                                    fontWeight: 600,
                                }
                            },
                            input: {
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <CalendarIcon sx={{ color: 'primary.main', fontSize: 22 }} />
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
                                fontSize: '1.25rem',
                                py: 1.8
                            },
                        }}
                    />

                    <Button
                        fullWidth
                        size="large"
                        type="submit"
                        variant="contained"
                        loading={isPending}
                        loadingPosition="end"
                        disableElevation
                        sx={{
                            height: '54px',
                            borderRadius: 3,
                            fontSize: '1.1rem',
                            fontWeight: 700,
                            textTransform: 'none',
                            bgcolor: '#1A1A1A',
                        }}
                        disableRipple
                    >
                        {isPending ? 'Searching...' : 'Find My Duty'}
                    </Button>
                </Stack>
            </form>
        </Box>
    );
}
