"use client";

import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as zod from 'zod';
import {
    Box,
    Button,
    TextField,
    Stack,
    InputAdornment,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';
import {
    Person as PersonIcon,
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
        control,
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

                    <Controller
                        name="date"
                        control={control}
                        render={({ field }) => (
                            <DatePicker
                                label="Duty Date"
                                format="DD/MM/YYYY"
                                value={field.value ? dayjs(field.value) : null}
                                onChange={(date) => field.onChange(date?.format('YYYY-MM-DD') ?? '')}
                                sx={{
                                    width: '100%',
                                    '& .MuiOutlinedInput-root, & .MuiPickersOutlinedInput-root': {
                                        borderRadius: 4,
                                        bgcolor: 'rgba(255,255,255,0.2)',
                                        backdropFilter: 'blur(10px)',
                                        '&:hover': { bgcolor: 'rgba(255,255,255,0.3)' }
                                    },
                                    '& .MuiPickersOutlinedInput-notchedOutline': {
                                        borderRadius: 'inherit',
                                    },
                                    '& .MuiOutlinedInput-input, & .MuiPickersInputBase-input': {
                                        fontWeight: 600,
                                        color: '#000',
                                        fontSize: '1.25rem',
                                        py: 1.8
                                    },
                                }}
                                slotProps={{
                                    textField: {
                                        fullWidth: true,
                                        error: !!errors.date,
                                        helperText: errors.date?.message,
                                        slotProps: {
                                            inputLabel: {
                                                shrink: true,
                                                sx: {
                                                    color: 'rgba(0,0,0,0.7)',
                                                    fontWeight: 600,
                                                }
                                            },
                                        },
                                        sx: {
                                            '& .MuiOutlinedInput-root, & .MuiPickersOutlinedInput-root': {
                                                borderRadius: 4,
                                                bgcolor: 'rgba(255,255,255,0.2)',
                                                backdropFilter: 'blur(10px)',
                                                '&:hover': { bgcolor: 'rgba(255,255,255,0.3)' }
                                            },
                                            '& .MuiPickersOutlinedInput-notchedOutline': {
                                                borderRadius: 'inherit',
                                            },
                                            '& .MuiOutlinedInput-input, & .MuiPickersInputBase-input': {
                                                fontWeight: 600,
                                                color: '#000',
                                                fontSize: '1.25rem',
                                                py: 1.8
                                            },
                                        },
                                    },
                                }}
                            />
                        )}
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
