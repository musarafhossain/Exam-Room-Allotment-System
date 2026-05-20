import React from 'react';
import { Grid, TextField, MenuItem, Autocomplete, Box } from '@mui/material';
import { TimePicker } from '@mui/x-date-pickers';
import dayjs from 'dayjs';
import { UseFormReturn, Controller } from 'react-hook-form';
import * as zod from 'zod';

export const roomSchema = zod.object({
    examType: zod.enum(['UG/PG', 'Others']),
    examName: zod.string().optional(),
    roomNo: zod.string().min(1, 'Room number is required'),
    floor: zod.string().optional(),
    building: zod.string().optional(),
    subject: zod.string().optional(),
    paper: zod.string().optional(),
    semester: zod.number().optional(),
    time: zod.string().min(1, 'Time is required'),
    date: zod.string().min(1, 'Date is required'),
    regNoFrom: zod.string().min(1, 'Starting registration number is required'),
    regNoTo: zod.string().min(1, 'Ending registration number is required'),
  }).refine((data) => {
      f (!data.regNoFrom || !data.regNoTo) return true;
        return Number(data.regNoTo) >= Number(data.regNoFrom);
      }, {
          message: 'End registration number must be greater than or equal to start registration number',
          path: ['regNoTo'],
     });

export type RoomFormValues = zod.infer<typeof roomSchema>;

interface Props {
  methods: UseFormReturn<RoomFormValues>;
  floors: { name: string }[];
  subjects: { name: string }[];
  papers: { name: string }[];
  buildings: { name: string }[];
}

export default function StudentRoomNewEditForm({ methods, floors, subjects, papers, buildings }: Props) {
  const { register, control, watch, setValue, formState: { errors } } = methods;

  const examType = watch('examType') || 'UG/PG';

  return (
    <Box sx={{ width: '100%' }}>

      <Grid container spacing={2}>
        {examType === 'Others' && (
          <Grid size={{ xs: 12 }}>
            <TextField 
              fullWidth 
              label="Exam Name (e.g., Railway, SSC)" 
              {...register('examName')} 
              error={!!errors.examName} 
              helperText={errors.examName?.message} 
            />
          </Grid>
        )}

        <Grid size={{ xs: 12, md: 6 }}>
        <TextField fullWidth label="Room No" {...register('roomNo')} error={!!errors.roomNo} helperText={errors.roomNo?.message} />
      </Grid>
      <Grid size={{ xs: 12, md: 6 }}>
        <Controller
          name="floor"
          control={control}
          render={({ field: { value, onChange, ...field } }) => (
            <Autocomplete
              {...field}
              options={floors.map((f) => f.name)}
              value={value || null}
              onChange={(_, newValue) => onChange(newValue || '')}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Floor"
                  error={!!errors.floor}
                  helperText={errors.floor?.message}
                />
              )}
            />
          )}
        />
      </Grid>
      <Grid size={{ xs: 12, md: 6 }}>
        <Controller
          name="building"
          control={control}
          render={({ field: { value, onChange, ...field } }) => (
            <Autocomplete
              {...field}
              options={buildings.map((b) => b.name)}
              value={value || null}
              onChange={(_, newValue) => onChange(newValue || '')}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Building"
                  error={!!errors.building}
                  helperText={errors.building?.message}
                />
              )}
            />
          )}
        />
        </Grid>
        
        {examType === 'UG/PG' && (
          <>
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
              <Controller
                name="subject"
                control={control}
                render={({ field: { value, onChange, ...field } }) => (
                  <Autocomplete
                    {...field}
                    options={subjects.map((s) => s.name)}
                    value={value || null}
                    onChange={(_, newValue) => onChange(newValue || '')}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Subject"
                        error={!!errors.subject}
                        helperText={errors.subject?.message}
                      />
                    )}
                  />
                )}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <Controller
                name="paper"
                control={control}
                render={({ field: { value, onChange, ...field } }) => (
                  <Autocomplete
                    {...field}
                    options={papers.map((p) => p.name)}
                    value={value || null}
                    onChange={(_, newValue) => onChange(newValue || '')}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Paper"
                        error={!!errors.paper}
                        helperText={errors.paper?.message}
                      />
                    )}
                  />
                )}
              />
            </Grid>
          </>
        )}

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
    </Box>
  );
}

