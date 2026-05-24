import React, { useState } from 'react';
import { Grid, TextField, MenuItem, Autocomplete, Box, Tooltip } from '@mui/material';
import { TimePicker } from '@mui/x-date-pickers';
import dayjs from 'dayjs';
import { UseFormReturn, Controller } from 'react-hook-form';
import LockIcon from '@mui/icons-material/Lock';
import ConfirmDialog from 'components/common/ConfirmDialog';
import { RoomFormValues } from './student-room-new-edit-form';

interface Props {
  methods: UseFormReturn<RoomFormValues>;
  floors: { name: string }[];
  subjects: { name: string }[];
  papers: { name: string }[];
  buildings: { name: string }[];
  initialLockedFields: Record<string, boolean>;
  onUnlockField: (field: string) => void;
  unlockedFields: Record<string, boolean>;
}

const FieldOverlay = ({ isLocked, onUnlock }: { isLocked: boolean; onUnlock: () => void }) => {
  if (!isLocked) return null;
  
  return (
    <Box
      onClick={onUnlock}
      sx={{
        position: 'absolute',
        top: 0, left: 0, right: 0, bottom: 0,
        bgcolor: 'rgba(255, 255, 255, 0.6)',
        backdropFilter: 'blur(1px)',
        zIndex: 10,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        borderRadius: 1,
        border: '1px dashed',
        borderColor: 'divider',
        transition: 'all 0.2s',
        '&:hover': {
          bgcolor: 'rgba(255, 255, 255, 0.8)',
          borderColor: 'primary.main',
        }
      }}
    >
      <Tooltip title="Click to unlock and overwrite all selected items">
        <LockIcon color="action" />
      </Tooltip>
    </Box>
  );
};

export default function StudentRoomBulkEditForm({ methods, floors, subjects, papers, buildings, initialLockedFields, onUnlockField, unlockedFields }: Props) {
  const { register, control, watch, formState: { errors } } = methods;
  const examType = watch('examType') || 'UG/PG';

  const [confirmUnlockField, setConfirmUnlockField] = useState<string | null>(null);

  const handleUnlockClick = (field: string) => {
    setConfirmUnlockField(field);
  };

  const confirmUnlock = () => {
    if (confirmUnlockField) {
      onUnlockField(confirmUnlockField);
    }
    setConfirmUnlockField(null);
  };

  const isFieldLocked = (field: string) => {
    return initialLockedFields[field] && !unlockedFields[field];
  };

  const renderField = (name: keyof RoomFormValues, component: React.ReactNode) => {
    return (
      <Box sx={{ position: 'relative', width: '100%' }}>
        {component}
        <FieldOverlay isLocked={isFieldLocked(name)} onUnlock={() => handleUnlockClick(name)} />
      </Box>
    );
  };

  return (
    <Box sx={{ width: '100%' }}>
      <ConfirmDialog
        open={!!confirmUnlockField}
        onClose={() => setConfirmUnlockField(null)}
        onConfirm={confirmUnlock}
        title="Unlock Field"
        content="Are you sure you want to unlock this field? If you edit this, ALL selected records will be overwritten with the new value."
        confirmLabel="Unlock & Overwrite"
      />

      <Grid container spacing={2}>
        {examType === 'Others' && (
          <Grid size={{ xs: 12 }}>
            {renderField('examName', (
              <TextField 
                fullWidth 
                label="Exam Name (e.g., Railway, SSC)" 
                {...register('examName')} 
                error={!!errors.examName} 
                helperText={errors.examName?.message} 
                disabled={isFieldLocked('examName')}
              />
            ))}
          </Grid>
        )}

        <Grid size={{ xs: 12, md: 6 }}>
          {renderField('roomNo', (
            <TextField fullWidth label="Room No" {...register('roomNo')} error={!!errors.roomNo} helperText={errors.roomNo?.message} disabled={isFieldLocked('roomNo')} />
          ))}
        </Grid>
        
        <Grid size={{ xs: 12, md: 6 }}>
          {renderField('floor', (
            <Controller
              name="floor"
              control={control}
              render={({ field: { value, onChange, ...field } }) => (
                <Autocomplete
                  {...field}
                  options={floors.map((f) => f.name)}
                  value={value || null}
                  onChange={(_, newValue) => onChange(newValue || '')}
                  disabled={isFieldLocked('floor')}
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
          ))}
        </Grid>
        
        <Grid size={{ xs: 12, md: 6 }}>
          {renderField('building', (
            <Controller
              name="building"
              control={control}
              render={({ field: { value, onChange, ...field } }) => (
                <Autocomplete
                  {...field}
                  options={buildings.map((b) => b.name)}
                  value={value || null}
                  onChange={(_, newValue) => onChange(newValue || '')}
                  disabled={isFieldLocked('building')}
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
          ))}
        </Grid>
        
        {examType === 'UG/PG' && (
          <>
            <Grid size={{ xs: 12, md: 6 }}>
              {renderField('semester', (
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
                      SelectProps={{ native: false }}
                      disabled={isFieldLocked('semester')}
                    >
                      {[1, 2, 3, 4, 5, 6, 7, 8].map((option) => (
                        <MenuItem key={option} value={option}>
                          {option}
                        </MenuItem>
                      ))}
                    </TextField>
                  )}
                />
              ))}
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              {renderField('subject', (
                <Controller
                  name="subject"
                  control={control}
                  render={({ field: { value, onChange, ...field } }) => (
                    <Autocomplete
                      {...field}
                      options={subjects.map((s) => s.name)}
                      value={value || null}
                      onChange={(_, newValue) => onChange(newValue || '')}
                      disabled={isFieldLocked('subject')}
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
              ))}
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              {renderField('paper', (
                <Controller
                  name="paper"
                  control={control}
                  render={({ field: { value, onChange, ...field } }) => (
                    <Autocomplete
                      {...field}
                      options={papers.map((p) => p.name)}
                      value={value || null}
                      onChange={(_, newValue) => onChange(newValue || '')}
                      disabled={isFieldLocked('paper')}
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
              ))}
            </Grid>
          </>
        )}

        <Grid size={{ xs: 12, md: 6 }}>
          {renderField('date', (
            <TextField fullWidth label="Date" type="date" InputLabelProps={{ shrink: true }} {...register('date')} error={!!errors.date} helperText={errors.date?.message} disabled={isFieldLocked('date')} />
          ))}
        </Grid>
        
        <Grid size={{ xs: 12, md: 6 }}>
          {renderField('time', (
            <Controller
              name="time"
              control={control}
              render={({ field }) => (
                <TimePicker
                  {...field}
                  label="Time"
                  ampm
                  disabled={isFieldLocked('time')}
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
          ))}
        </Grid>
        
        <Grid size={{ xs: 12, md: 6 }}>
          {renderField('regNoFrom', (
            <TextField fullWidth label="Reg No From" {...register('regNoFrom')} error={!!errors.regNoFrom} helperText={errors.regNoFrom?.message} disabled={isFieldLocked('regNoFrom')} />
          ))}
        </Grid>
        
        <Grid size={{ xs: 12, md: 6 }}>
          {renderField('regNoTo', (
            <TextField fullWidth label="Reg No To" {...register('regNoTo')} error={!!errors.regNoTo} helperText={errors.regNoTo?.message} disabled={isFieldLocked('regNoTo')} />
          ))}
        </Grid>
      </Grid>
    </Box>
  );
}
