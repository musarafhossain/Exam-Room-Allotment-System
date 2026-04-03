import React from 'react';
import { Grid, TextField, MenuItem } from '@mui/material';
import { TimePicker } from '@mui/x-date-pickers';
import dayjs from 'dayjs';
import { UseFormReturn, Controller } from 'react-hook-form';
import * as zod from 'zod';

export const roomSchema = zod.object({
  roomNo: zod.string().min(1, 'Room number is required'),
  floor: zod.string().optional(),
  building: zod.string().optional(),
  subject: zod.string().min(1, 'Subject is required'),
  paper: zod.string().min(1, 'Paper is required'),
  semester: zod.number().min(1, 'Semester is required'),
  time: zod.string().min(1, 'Time is required'),
  date: zod.string().min(1, 'Date is required'),
  regNoFrom: zod.string().min(1, 'Starting registration number is required'),
  regNoTo: zod.string().min(1, 'Ending registration number is required'),
}).refine((data) => {
  // Simple lexicographical comparison works for many registration formats
  // but if they are strictly numeric or have a specific structure, more logic might be needed.
  if (!data.regNoFrom || !data.regNoTo) return true;
  return data.regNoTo >= data.regNoFrom;
}, {
  message: 'End registration number must be greater than or equal to start registration number',
  path: ['regNoTo'],
});

export type RoomFormValues = zod.infer<typeof roomSchema>;

interface Props {
  methods: UseFormReturn<RoomFormValues>;
}

export default function StudentRoomNewEditForm({ methods }: Props) {
  const { register, control, formState: { errors } } = methods;

  return (
    <Grid container spacing={2}>
      <Grid size={{ xs: 12, md: 6 }}>
        <TextField fullWidth label="Room No" {...register('roomNo')} error={!!errors.roomNo} helperText={errors.roomNo?.message} />
      </Grid>
      <Grid size={{ xs: 12, md: 6 }}>
        <TextField fullWidth label="Floor" {...register('floor')} />
      </Grid>
      <Grid size={{ xs: 12, md: 6 }}>
        <TextField fullWidth label="Building" {...register('building')} />
      </Grid>
      <Grid size={{ xs: 12, md: 6 }}>
        <Controller
          name="semester"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              select
              fullWidth
              label="Semester"
              error={!!errors.semester}
              helperText={errors.semester?.message}
              slotProps={{ select: { native: false } }}
            >
              {[1, 2, 3, 4, 5, 6, 7, 8].map((option) => (
                <MenuItem key={option} value={option}>
                  {option}
                </MenuItem>
              ))}
            </TextField>
          )}
        />
      </Grid>
      <Grid size={{ xs: 12, md: 6 }}>
        <TextField fullWidth label="Subject" {...register('subject')} error={!!errors.subject} helperText={errors.subject?.message} />
      </Grid>
      <Grid size={{ xs: 12, md: 6 }}>
        <TextField fullWidth label="Paper" {...register('paper')} error={!!errors.paper} helperText={errors.paper?.message} />
      </Grid>
      <Grid size={{ xs: 12, md: 6 }}>
        <TextField fullWidth label="Date" type="date" slotProps={{ inputLabel: { shrink: true } }} {...register('date')} error={!!errors.date} helperText={errors.date?.message} />
      </Grid>
      <Grid size={{ xs: 12, md: 6 }}>
        <Controller
          name="time"
          control={control}
          render={({ field }) => (
            <TimePicker
              {...field}
              label="Time"
              ampm
              value={field.value ? dayjs(`2000-01-01T${field.value}`) : null}
              onChange={(newValue) => {
                field.onChange(newValue ? newValue.format('HH:mm') : '');
              }}
              slotProps={{
                textField: {
                  fullWidth: true,
                  error: !!errors.time,
                  helperText: errors.time?.message,
                },
              }}
            />
          )}
        />
      </Grid>
      <Grid size={{ xs: 12, md: 6 }}>
        <TextField fullWidth label="Reg No From" {...register('regNoFrom')} error={!!errors.regNoFrom} helperText={errors.regNoFrom?.message} />
      </Grid>
      <Grid size={{ xs: 12, md: 6 }}>
        <TextField fullWidth label="Reg No To" {...register('regNoTo')} error={!!errors.regNoTo} helperText={errors.regNoTo?.message} />
      </Grid>
    </Grid>
  );
}
