import React from 'react';
import { Grid, TextField } from '@mui/material';
import { UseFormReturn } from 'react-hook-form';
import * as zod from 'zod';

export const buildingSchema = zod.object({
  name: zod.string().min(1, 'Building name is required'),
});

export type BuildingFormValues = zod.infer<typeof buildingSchema>;

interface Props {
  methods: UseFormReturn<BuildingFormValues>;
}

export default function BuildingNewEditForm({ methods }: Props) {
  const { register, formState: { errors } } = methods;

  return (
    <Grid container spacing={2}>
      <Grid size={{ xs: 12 }}>
        <TextField 
          fullWidth 
          label="Building Name" 
          {...register('name')} 
          error={!!errors.name} 
          helperText={errors.name?.message} 
        />
      </Grid>
    </Grid>
  );
}
