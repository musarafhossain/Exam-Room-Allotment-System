"use client";
import React, { useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as zod from 'zod';
import {
    Box,
    Button,
    TextField,
    Stack,
    InputAdornment,
    Skeleton,
} from '@mui/material';
import {
    Search as SearchIcon,
} from '@mui/icons-material';

export const getSearchSchema = (label: string) => zod.object({
    regNo: zod.string().min(1, `${label} is required`).max(20, 'Maximum 20 digits allowed'),
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
        formState: { errors },
    } = useForm<SearchFormValues>({
        resolver: zodResolver(schema)
    });

    return (
        <Box sx={{ width: '100%' }}>
            <form onSubmit={handleSubmit(onSubmit)}>
                <Stack spacing={3}>
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
                                fontSize: '1.5rem',
                                py: 2
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
                        {isPending ? 'Searching...' : 'Find My Room'}
                    </Button>
                </Stack>
            </form>
        </Box>
    );
}
