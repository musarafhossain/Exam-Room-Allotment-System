"use client";

import React, { useState } from 'react';
import { 
  Box, 
  Button, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow, 
  Paper, 
  TextField, 
  Checkbox, 
  Typography,
  Stack,
  IconButton,
  Tooltip,
  Select,
  MenuItem,
  FormControl,
  InputLabel
} from '@mui/material';
import { Add as AddIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { useMutation } from '@tanstack/react-query';
import { TimePicker } from '@mui/x-date-pickers';
import dayjs from 'dayjs';
import { TeacherRoomService } from 'services';
import toast from 'react-hot-toast';

interface DateColumn {
  date: string;
  shift1Start: string;
  shift1End: string;
  shift2Start: string;
  shift2End: string;
}

interface TeacherRow {
  name: string;
  assignments: {
    shift1: boolean;
    shift2: boolean;
  }[];
}

export function TeacherRoomView() {
  const [dates, setDates] = useState<DateColumn[]>([
    { 
      date: '', 
      shift1Start: '10:00', 
      shift1End: '13:00', 
      shift2Start: '14:00', 
      shift2End: '17:00' 
    }
  ]);
  
  const [rows, setRows] = useState<TeacherRow[]>([
    { name: '', assignments: [{ shift1: false, shift2: false }] }
  ]);

  const addDate = () => {
    setDates([...dates, { 
      date: '', 
      shift1Start: '10:00', 
      shift1End: '13:00', 
      shift2Start: '14:00', 
      shift2End: '17:00' 
    }]);
    setRows(rows.map(row => ({
      ...row,
      assignments: [...row.assignments, { shift1: false, shift2: false }]
    })));
  };

  const addTeacher = () => {
    setRows([...rows, { 
      name: '', 
      assignments: dates.map(() => ({ shift1: false, shift2: false })) 
    }]);
  };

  const handleDateChange = (index: number, field: keyof DateColumn, value: string) => {
    const newDates = [...dates];
    newDates[index] = { ...newDates[index], [field]: value };
    setDates(newDates);
  };

  const handleTeacherNameChange = (index: number, name: string) => {
    const newRows = [...rows];
    newRows[index].name = name;
    setRows(newRows);
  };

  const handleCheckboxChange = (rowIndex: number, dateIndex: number, shift: 'shift1' | 'shift2') => {
    const newRows = [...rows];
    newRows[rowIndex].assignments[dateIndex][shift] = !newRows[rowIndex].assignments[dateIndex][shift];
    setRows(newRows);
  };

  const deleteDate = (index: number) => {
    setDates(dates.filter((_, i) => i !== index));
    setRows(rows.map(row => ({
      ...row,
      assignments: row.assignments.filter((_, i) => i !== index)
    })));
  };

  const deleteRow = (index: number) => {
    setRows(rows.filter((_, i) => i !== index));
  };

  const submitMutation = useMutation({
    mutationFn: (data: any) => TeacherRoomService.create(data), // Using create as a placeholder for bulk submission
    onSuccess: () => toast.success('Data sent successfully'),
    onError: (err: any) => toast.error(err.message || 'Error sending data'),
  });

  const handleSubmit = () => {
    // Transform data for API if needed
    const payload = {
      dates,
      teachers: rows
    };
    submitMutation.mutate(payload);
  };

  return (
    <Box sx={{ p: 3 }}>
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
        <Typography variant="h4">Teacher Room Section</Typography>
        <Stack direction="row" spacing={2}>
          <Button 
            variant="contained" 
            color="primary" 
            startIcon={<AddIcon />}
            onClick={addDate}
          >
            Add Date
          </Button>
          <Button 
            variant="contained" 
            color="secondary" 
            startIcon={<AddIcon />}
            onClick={addTeacher}
          >
            Add Teacher
          </Button>
        </Stack>
      </Stack>


      <TableContainer component={Paper} sx={{ 
        maxHeight: 'calc(100vh - 200px)', 
        overflow: 'auto',
        width: '100%',
        boxShadow: '0px 4px 20px rgba(0,0,0,0.08)',
        borderRadius: 2
      }}>
        <Table stickyHeader size="small">
          <TableHead>
            <TableRow>
              <TableCell sx={{ 
                minWidth: 250, 
                fontWeight: 'bold', 
                backgroundColor: '#fff', 
                zIndex: 3,
                position: 'sticky',
                left: 0,
                borderRight: '1px solid #e0e0e0'
              }}>
                Teacher Name
              </TableCell>
              {dates.map((dateCol, idx) => (
                <TableCell 
                  key={idx} 
                  align="center" 
                  sx={{ 
                    borderLeft: '1px solid #e0e0e0',
                    backgroundColor: '#f8f9fa',
                    width: 250,
                    maxWidth: 250,
                    minWidth: 250,
                    p: 1.5,
                    position: 'relative',
                    zIndex: 2
                  }}
                >
                  <Tooltip title="Delete Date Column">
                    <IconButton 
                      size="small" 
                      onClick={() => deleteDate(idx)}
                      sx={{ 
                        position: 'absolute', 
                        top: 2, 
                        right: 2,
                        color: 'error.main',
                        zIndex: 10
                      }}
                    >
                      <DeleteIcon sx={{ fontSize: 16 }} />
                    </IconButton>
                  </Tooltip>
                  <Stack spacing={1.5} alignItems="center" sx={{ mt: 1 }}>
                    <TextField
                      type="date"
                      size="small"
                      label="Exam Date"
                      InputLabelProps={{ shrink: true }}
                      value={dateCol.date}
                      onChange={(e) => handleDateChange(idx, 'date', e.target.value)}
                      sx={{ width: '100%', bgcolor: 'white' }}
                    />
                    
                    <Stack direction="row" spacing={1} sx={{ width: '100%' }}>
                      <Box sx={{ width: '50%' }}>
                        <Typography sx={{ fontWeight: 'bold', fontSize: 10, color: 'primary.main', textAlign: 'center', mb: 0.5 }}>
                          SHIFT 1
                        </Typography>
                        <Stack direction="row" spacing={0.5}>
                          <TextField
                            type="time"
                            size="small"
                            value={dateCol.shift1Start}
                            onChange={(e) => handleDateChange(idx, 'shift1Start', e.target.value)}
                            sx={{ width: '48%', bgcolor: 'white', '& .MuiInputBase-input': { p: 0.7, fontSize: 11 } }}
                          />
                          <TextField
                            type="time"
                            size="small"
                            value={dateCol.shift1End}
                            onChange={(e) => handleDateChange(idx, 'shift1End', e.target.value)}
                            sx={{ width: '48%', bgcolor: 'white', '& .MuiInputBase-input': { p: 0.7, fontSize: 11 } }}
                          />
                        </Stack>
                      </Box>
                      
                      <Box sx={{ width: '50%' }}>
                        <Typography sx={{ fontWeight: 'bold', fontSize: 10, color: 'secondary.main', textAlign: 'center', mb: 0.5 }}>
                          SHIFT 2
                        </Typography>
                        <Stack direction="row" spacing={0.5}>
                          <TextField
                            type="time"
                            size="small"
                            value={dateCol.shift2Start}
                            onChange={(e) => handleDateChange(idx, 'shift2Start', e.target.value)}
                            sx={{ width: '48%', bgcolor: 'white', '& .MuiInputBase-input': { p: 0.7, fontSize: 11 } }}
                          />
                          <TextField
                            type="time"
                            size="small"
                            value={dateCol.shift2End}
                            onChange={(e) => handleDateChange(idx, 'shift2End', e.target.value)}
                            sx={{ width: '48%', bgcolor: 'white', '& .MuiInputBase-input': { p: 0.7, fontSize: 11 } }}
                          />
                        </Stack>
                      </Box>
                    </Stack>
                  </Stack>
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row, rowIndex) => (
              <TableRow key={rowIndex} sx={{ '&:hover': { bgcolor: 'rgba(0,0,0,0.02)' } }}>
                <TableCell sx={{ 
                  width: 200,
                  maxWidth: 200,
                  minWidth: 200,
                  position: 'sticky', 
                  left: 0, 
                  bgcolor: 'white', 
                  zIndex: 1, 
                  borderRight: '1px solid #e0e0e0' 
                }}>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <Tooltip title="Delete Teacher Row">
                      <IconButton 
                        size="small" 
                        onClick={() => deleteRow(rowIndex)}
                        sx={{ color: 'error.light' }}
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    <TextField
                      fullWidth
                      size="small"
                      placeholder="Enter Name"
                      value={row.name}
                      onChange={(e) => handleTeacherNameChange(rowIndex, e.target.value)}
                    />
                  </Stack>
                </TableCell>
                {row.assignments.map((assignment, dateIndex) => (
                  <TableCell 
                    key={dateIndex} 
                    align="center" 
                    sx={{ 
                      borderLeft: '1px solid #e0e0e0',
                      '&:hover': { bgcolor: '#f5f5f5' },
                      p: 0 // Remove padding for cleaner flex layout
                    }}
                  >
                    <Stack direction="row" sx={{ width: '100%', height: '100%' }}>
                      <Box sx={{ 
                        flex: 1, 
                        py: 2, 
                        display: 'flex', 
                        flexDirection: 'column', 
                        alignItems: 'center',
                        borderRight: '1px solid #f0f0f0' 
                      }}>
                        <Typography variant="caption" sx={{ fontWeight: 'bold', color: 'primary.main', mb: 0.5 }}>S1</Typography>
                        <Checkbox
                          checked={assignment.shift1}
                          onChange={() => handleCheckboxChange(rowIndex, dateIndex, 'shift1')}
                          color="primary"
                          size="small"
                        />
                      </Box>
                      <Box sx={{ 
                        flex: 1, 
                        py: 2, 
                        display: 'flex', 
                        flexDirection: 'column', 
                        alignItems: 'center' 
                      }}>
                        <Typography variant="caption" sx={{ fontWeight: 'bold', color: 'secondary.main', mb: 0.5 }}>S2</Typography>
                        <Checkbox
                          checked={assignment.shift2}
                          onChange={() => handleCheckboxChange(rowIndex, dateIndex, 'shift2')}
                          color="secondary"
                          size="small"
                        />
                      </Box>
                    </Stack>
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
        <Button 
          variant="contained" 
          color="success" 
          size="large"
          onClick={handleSubmit}
          disabled={submitMutation.isPending}
        >
          {submitMutation.isPending ? 'Sending...' : 'Submit Data'}
        </Button>
      </Box>
    </Box>
  );
}

