import React from 'react';
import { Grid, TextField } from '@mui/material';
import { UseFormReturn } from 'react-hook-form';
import * as zod from 'zod';

export const floorSchema = zod.object({
  name: zod.string().min(1, 'Floor name is required'),
});

export type FloorFormValues = zod.infer<typeof floorSchema>;

interface Props {
  methods: UseFormReturn<FloorFormValues>;
}

export default function FloorNewEditForm({ methods }: Props) {
  const { register, formState: { errors } } = methods;

  return (
    <Grid container spacing={2}>
      <Grid size={{ xs: 12 }}>
        <TextField 
          fullWidth 
          label="Floor Name" 
          {...register('name')} 
          error={!!errors.name} 
          helperText={errors.name?.message} 
        />
      </Grid>
    </Grid>
  );
}
