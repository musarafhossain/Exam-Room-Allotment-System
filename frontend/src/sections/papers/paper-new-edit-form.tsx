import React from 'react';
import { Grid, TextField } from '@mui/material';
import { UseFormReturn } from 'react-hook-form';
import * as zod from 'zod';

export const paperSchema = zod.object({
  name: zod.string().min(1, 'Paper name is required'),
});

export type PaperFormValues = zod.infer<typeof paperSchema>;

interface Props {
  methods: UseFormReturn<PaperFormValues>;
}

export default function PaperNewEditForm({ methods }: Props) {
  const { register, formState: { errors } } = methods;

  return (
    <Grid container spacing={2}>
      <Grid size={{ xs: 12 }}>
        <TextField 
          fullWidth 
          label="Paper Name" 
          {...register('name')} 
          error={!!errors.name} 
          helperText={errors.name?.message} 
        />
      </Grid>
    </Grid>
  );
}
