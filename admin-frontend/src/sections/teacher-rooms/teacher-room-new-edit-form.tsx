import React from 'react';
import { Grid, TextField } from '@mui/material';
import { TimePicker } from '@mui/x-date-pickers';
import dayjs from 'dayjs';
import { UseFormReturn, Controller } from 'react-hook-form';
import * as zod from 'zod';

export const teacherRoomSchema = zod.object({
  name: zod.string().min(1, 'Name is required'),
  roomNo: zod.string().min(1, 'Room number is required'),
  floor: zod.string().optional(),
  building: zod.string().optional(),
  time: zod.string().min(1, 'Time is required'),
  date: zod.string().min(1, 'Date is required'),
});

export type TeacherRoomFormValues = zod.infer<typeof teacherRoomSchema>;

interface Props {
  methods: UseFormReturn<TeacherRoomFormValues>;
}

export default function TeacherRoomNewEditForm({ methods }: Props) {
  const { register, control, formState: { errors } } = methods;

  return (
    <Grid container spacing={2}>
      <Grid size={{ xs: 12, md: 6 }}>
        <TextField fullWidth label="Teacher Name" {...register('name')} error={!!errors.name} helperText={errors.name?.message} />
      </Grid>
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
    </Grid>
  );
}
