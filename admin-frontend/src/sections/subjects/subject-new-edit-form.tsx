import React from 'react';
import { Grid, TextField } from '@mui/material';
import { UseFormReturn } from 'react-hook-form';
import * as zod from 'zod';

export const subjectSchema = zod.object({
  name: zod.string().min(1, 'Subject name is required'),
});

export type SubjectFormValues = zod.infer<typeof subjectSchema>;

interface Props {
  methods: UseFormReturn<SubjectFormValues>;
}

export default function SubjectNewEditForm({ methods }: Props) {
  const { register, formState: { errors } } = methods;

  return (
    <Grid container spacing={2}>
      <Grid size={{ xs: 12 }}>
        <TextField 
          fullWidth 
          label="Subject Name" 
          {...register('name')} 
          error={!!errors.name} 
          helperText={errors.name?.message} 
        />
      </Grid>
    </Grid>
  );
}
