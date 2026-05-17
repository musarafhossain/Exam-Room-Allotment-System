"use client";

import React, { useState, useEffect } from 'react';
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
  InputLabel,
  CircularProgress,
  Skeleton
} from '@mui/material';
import { 
  Add as AddIcon, 
  Delete as DeleteIcon, 
  Download as DownloadIcon, 
  Upload as UploadIcon, 
  FileDownloadOutlined as FileDownloadIcon,
  Cancel as CancelIcon 
} from '@mui/icons-material';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
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
  const queryClient = useQueryClient();

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

  const { data: listData, isLoading } = useQuery({
    queryKey: ['teacher-rooms'],
    queryFn: () => TeacherRoomService.getList(),
  });

  useEffect(() => {
    if (listData?.items && listData.items.length > 0) {
      const uniqueDatesMap = new Map<string, DateColumn>();
      listData.items.forEach((item: any) => {
        const dateStr = dayjs(item.date).format('YYYY-MM-DD');
        if (!uniqueDatesMap.has(dateStr)) {
          uniqueDatesMap.set(dateStr, {
            date: dateStr,
            shift1Start: item.shift1Start || '10:00',
            shift1End: item.shift1End || '13:00',
            shift2Start: item.shift2Start || '14:00',
            shift2End: item.shift2End || '17:00'
          });
        }
      });
      
      const sortedDates = Array.from(uniqueDatesMap.values()).sort((a, b) => a.date.localeCompare(b.date));
      if (sortedDates.length > 0) {
        setDates(sortedDates);
      }

      const teacherMap = new Map<string, TeacherRow>();
      
      listData.items.forEach((item: any) => {
        if (!teacherMap.has(item.name)) {
          const assignments = sortedDates.map(() => ({ shift1: false, shift2: false }));
          teacherMap.set(item.name, {
            name: item.name,
            assignments
          });
        }

        const tRow = teacherMap.get(item.name)!;
        const dateStr = dayjs(item.date).format('YYYY-MM-DD');
        const dateIdx = sortedDates.findIndex(d => d.date === dateStr);
        if (dateIdx !== -1) {
          tRow.assignments[dateIdx] = {
            shift1: !!item.shift1,
            shift2: !!item.shift2
          };
        }
      });

      if (teacherMap.size > 0) {
        setRows(Array.from(teacherMap.values()));
      }
    }
  }, [listData]);

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
    onSuccess: () => {
        toast.success('Data sent successfully');
        queryClient.invalidateQueries({ queryKey: ['teacher-rooms'] });
    },
    onError: (err: any) => toast.error(err.message || 'Error sending data'),
  });

  const handleSubmit = () => {
    // Find valid date columns and identify their active array indexes.
    const validDateIndices = dates.map((d, i) => d.date ? i : -1).filter(i => i !== -1);
    
    // Extrapolate the valid date records
    const filteredDates = validDateIndices.map(i => dates[i]);
    
    // Ensure the teacher has a name, and sync their assignments array lengths alongside our mapped valid dates array
    const validTeachers = rows
      .filter(r => r.name && r.name.trim() !== '')
      .map(r => ({
        name: r.name,
        assignments: validDateIndices.map(i => r.assignments[i])
      }));

    if (filteredDates.length === 0 || validTeachers.length === 0) {
      toast.error('Please fill out at least one valid date and one teacher name before submitting.');
      return;
    }

    const payload = {
      dates: filteredDates,
      teachers: validTeachers
    };
    submitMutation.mutate(payload);
  };

  const exportCSV = () => {
    // Header logic
    const headerCols = ["Teacher Name"];
    dates.forEach(d => {
      if (d.date) {
        headerCols.push(`${d.date}|S1|${d.shift1Start}-${d.shift1End}`);
        headerCols.push(`${d.date}|S2|${d.shift2Start}-${d.shift2End}`);
      }
    });

    const rowsCSV = [headerCols.join(",")];
    
    rows.forEach(row => {
      if (!row.name || row.name.trim() === '') return;
      
      const rowCols = [row.name];
      row.assignments.forEach((assignment, idx) => {
        if (!dates[idx].date) return;
        rowCols.push(assignment.shift1 ? 'Yes' : 'No');
        rowCols.push(assignment.shift2 ? 'Yes' : 'No');
      });
      rowsCSV.push(rowCols.join(","));
    });
    
    const csvContent = "data:text/csv;charset=utf-8," + encodeURIComponent(rowsCSV.join("\n"));
    const link = document.createElement("a");
    link.setAttribute("href", csvContent);
    link.setAttribute("download", "teacher_room_assignments.csv");
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  const downloadDummyCSV = () => {
    const header = "Teacher Name,2026-04-15|S1|10:00-13:00,2026-04-15|S2|14:00-17:00\n";
    const dummy = "John Doe,Yes,No\nJane Smith,No,Yes";
    const csvContent = "data:text/csv;charset=utf-8," + encodeURIComponent(header + dummy);
    const link = document.createElement("a");
    link.setAttribute("href", csvContent);
    link.setAttribute("download", "teacher_room_template.csv");
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  const importCSV = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      const lines = text.split("\n");
      if (lines.length < 2) return;
      
      const headerParts = lines[0].trim().split(",");
      if (headerParts.length < 2) {
        toast.error("Invalid CSV Format");
        return;
      }

      const parsedDates: DateColumn[] = [];
      const shiftHeaders: Array<{ dateIdx: number, shiftNo: number }> = [];

      let currentDateIdx = -1;
      let lastDate = "";
      
      for (let i = 1; i < headerParts.length; i++) {
        const h = headerParts[i].split('|'); 
        if (h.length < 3) continue;
        
        const dateStr = h[0].trim();
        const shiftStr = h[1].trim();
        const timesStr = h[2].split('-'); 
        const startTime = timesStr[0]?.trim();
        const endTime = timesStr[1]?.trim();
        
        if (dateStr !== lastDate || currentDateIdx === -1) {
          lastDate = dateStr;
          currentDateIdx++;
          parsedDates.push({
            date: dateStr,
            shift1Start: '10:00',
            shift1End: '13:00',
            shift2Start: '14:00',
            shift2End: '17:00'
          });
        }
        
        if (shiftStr === 'S1') {
          parsedDates[currentDateIdx].shift1Start = startTime || '10:00';
          parsedDates[currentDateIdx].shift1End = endTime || '13:00';
          shiftHeaders.push({ dateIdx: currentDateIdx, shiftNo: 1 });
        } else if (shiftStr === 'S2') {
          parsedDates[currentDateIdx].shift2Start = startTime || '14:00';
          parsedDates[currentDateIdx].shift2End = endTime || '17:00';
          shiftHeaders.push({ dateIdx: currentDateIdx, shiftNo: 2 });
        }
      }

      if (parsedDates.length === 0) {
          toast.error("No valid dates found in header.");
          return;
      }

      const parsedTeachers: TeacherRow[] = [];

      for (let i = 1; i < lines.length; i++) {
        const line = lines[i].trim();
        if (!line) continue;
        const parts = line.split(",");
        const name = parts[0].trim();
        if (!name) continue;

        const assignments = parsedDates.map(() => ({ shift1: false, shift2: false }));
        
        for (let j = 1; j < parts.length; j++) {
          if (j - 1 < shiftHeaders.length) {
            const h = shiftHeaders[j - 1];
            const valStr = parts[j] ? parts[j].trim().toLowerCase() : '';
            const val = valStr === 'yes' || valStr === '1' || valStr === 'y' || valStr === 'true';
            if (h.shiftNo === 1) {
              assignments[h.dateIdx].shift1 = val;
            } else if (h.shiftNo === 2) {
              assignments[h.dateIdx].shift2 = val;
            }
          }
        }
        
        parsedTeachers.push({
          name,
          assignments
        });
      }

      if (parsedDates.length > 0) {
        // Merge dates: find dates in CSV that aren't in current state
        const existingDateStrs = dates.map(d => d.date);
        const newDatesFromCSV = parsedDates.filter(pd => !existingDateStrs.includes(pd.date));
        
        const updatedDates = [...dates, ...newDatesFromCSV];
        setDates(updatedDates);

        // Merge Teachers
        const updatedRows = [...rows];
        
        // First, expand existing rows' assignments to the new total date count
        updatedRows.forEach(row => {
          const additionalAssignments = newDatesFromCSV.map(() => ({ shift1: false, shift2: false }));
          row.assignments = [...row.assignments, ...additionalAssignments];
        });

        parsedTeachers.forEach(pt => {
          const existingRowIdx = updatedRows.findIndex(r => r.name.trim().toLowerCase() === pt.name.trim().toLowerCase());
          
          if (existingRowIdx !== -1) {
            // Teacher exists, update their assignments for the dates present in CSV
            parsedDates.forEach((pd, pdIdx) => {
              const dateIdxInState = updatedDates.findIndex(d => d.date === pd.date);
              if (dateIdxInState !== -1) {
                updatedRows[existingRowIdx].assignments[dateIdxInState] = pt.assignments[pdIdx];
              }
            });
          } else {
            // New teacher, create row and fill assignments for all dates
            const fullAssignments = updatedDates.map(() => ({ shift1: false, shift2: false }));
            // Fill with CSV assignments where matching
            parsedDates.forEach((pd, pdIdx) => {
              const dateIdxInState = updatedDates.findIndex(d => d.date === pd.date);
              if (dateIdxInState !== -1) {
                fullAssignments[dateIdxInState] = pt.assignments[pdIdx];
              }
            });
            updatedRows.push({
              name: pt.name,
              assignments: fullAssignments
            });
          }
        });

        setRows(updatedRows);
      }
      toast.success("CSV Data Appended. Review and click Submit Data to save.");
      
    };
    reader.readAsText(file);
    event.target.value = '';
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

      <Stack direction="row" spacing={2} sx={{ mb: 3 }}>
        <input 
          accept=".csv"
          style={{ display: 'none' }}
          id="csv-upload-button"
          type="file"
          onChange={importCSV}
        />
        <label htmlFor="csv-upload-button">
          <Button variant="outlined" color="primary" component="span" startIcon={<UploadIcon />}>
            Import CSV
          </Button>
        </label>
        <Button variant="outlined" color="success" onClick={exportCSV} startIcon={<DownloadIcon />}>
          Export CSV
        </Button>
        <Button variant="text" color="info" onClick={downloadDummyCSV} startIcon={<FileDownloadIcon />}>
          Download Template
        </Button>
      </Stack>

      <TableContainer component={Paper} sx={{
        maxHeight: '100dvh',
        overflow: 'auto',
        width: '100%',
        boxShadow: '0px 4px 20px rgba(0,0,0,0.08)',
        borderRadius: 2,
        '&::-webkit-scrollbar': {
          width: '8px',
          height: '8px',
        },
        '&::-webkit-scrollbar-track': {
          background: 'rgba(0,0,0,0.03)',
          borderRadius: '10px',
        },
        '&::-webkit-scrollbar-thumb': {
          background: 'rgba(26, 115, 232, 0.2)',
          borderRadius: '10px',
          border: '2px solid transparent',
          backgroundClip: 'padding-box',
          '&:hover': {
            background: 'rgba(26, 115, 232, 0.4)',
            backgroundClip: 'padding-box',
          },
        },
      }}>
        <Table stickyHeader size="small">
          <TableHead>
            <TableRow>
              <TableCell sx={{
                minWidth: 250,
                fontWeight: 'bold',
                backgroundColor: '#fff',
                zIndex: 10,
                position: 'sticky',
                left: 0,
                top: 0,
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
                    minWidth: 175,
                    maxWidth: 175,
                    width: 175,
                    p: 1.5,
                    position: 'sticky', // Fixed from relative
                    zIndex: 10,
                    top: 0
                  }}
                >
                  <Tooltip title="Delete Date Column">
                    <IconButton
                      size="small"
                      onClick={() => deleteDate(idx)}
                      sx={{
                        position: 'absolute',
                        top: 4,
                        right: 4,
                        color: 'error.main',
                        bgcolor: 'rgba(244, 67, 54, 0.08)',
                        '&:hover': { bgcolor: 'rgba(244, 67, 54, 0.15)' },
                        zIndex: 10
                      }}
                    >
                      <CancelIcon sx={{ fontSize: 18 }} />
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
                        <Stack direction="column" spacing={0.5}>
                          <TextField
                            type="time"
                            size="small"
                            value={dateCol.shift1Start}
                            onChange={(e) => handleDateChange(idx, 'shift1Start', e.target.value)}
                            sx={{ width: '100%', bgcolor: 'white', '& .MuiInputBase-input': { p: 0.7, fontSize: 11 } }}
                          />
                          <TextField
                            type="time"
                            size="small"
                            value={dateCol.shift1End}
                            onChange={(e) => handleDateChange(idx, 'shift1End', e.target.value)}
                            sx={{ width: '100%', bgcolor: 'white', '& .MuiInputBase-input': { p: 0.7, fontSize: 11 } }}
                          />
                        </Stack>
                      </Box>

                      <Box sx={{ width: '50%' }}>
                        <Typography sx={{ fontWeight: 'bold', fontSize: 10, color: 'secondary.main', textAlign: 'center', mb: 0.5 }}>
                          SHIFT 2
                        </Typography>
                        <Stack direction="column" spacing={0.5}>
                          <TextField
                            type="time"
                            size="small"
                            value={dateCol.shift2Start}
                            onChange={(e) => handleDateChange(idx, 'shift2Start', e.target.value)}
                            sx={{ width: '100%', bgcolor: 'white', '& .MuiInputBase-input': { p: 0.7, fontSize: 11 } }}
                          />
                          <TextField
                            type="time"
                            size="small"
                            value={dateCol.shift2End}
                            onChange={(e) => handleDateChange(idx, 'shift2End', e.target.value)}
                            sx={{ width: '100%', bgcolor: 'white', '& .MuiInputBase-input': { p: 0.7, fontSize: 11 } }}
                          />
                        </Stack>
                      </Box>
                    </Stack>
                  </Stack>
                </TableCell>
              ))}
              <TableCell sx={{
                minWidth: 60,
                width: 60,
                fontWeight: 'bold',
                backgroundColor: '#fff',
                zIndex: 10,
                position: 'sticky',
                right: 0,
                top: 0,
                borderLeft: '1px solid #e0e0e0',
                textAlign: 'center',
                px: 1
              }}>
                Total
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {isLoading ? (
              Array.from(new Array(3)).map((_, rowIndex) => (
                <TableRow key={`skeleton-row-${rowIndex}`}>
                  <TableCell sx={{ minWidth: 200, position: 'sticky', left: 0, bgcolor: 'white', zIndex: 1, borderRight: '1px solid #e0e0e0', py: 2 }}>
                    <Stack direction="row" spacing={1} alignItems="center">
                      <Skeleton variant="circular" width={24} height={24} sx={{ bgcolor: 'rgba(0,0,0,0.04)' }} />
                      <Skeleton variant="rectangular" height={32} sx={{ flexGrow: 1, borderRadius: 1, bgcolor: 'rgba(0,0,0,0.04)' }} />
                    </Stack>
                  </TableCell>
                  {dates.map((_, colIndex) => (
                    <TableCell key={`skeleton-col-${colIndex}`} align="center" sx={{ borderLeft: '1px solid #e0e0e0', p: 0 }}>
                       <Stack direction="row" sx={{ width: '100%', height: '100%' }}>
                         <Box sx={{ flex: 1, py: 3, display: 'flex', flexDirection: 'column', alignItems: 'center', borderRight: '1px solid #f0f0f0' }}>
                           <Skeleton variant="text" width={20} height={16} sx={{ mb: 0.5 }} />
                           <Skeleton variant="rectangular" width={20} height={20} sx={{ borderRadius: 0.5 }} />
                         </Box>
                         <Box sx={{ flex: 1, py: 3, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                           <Skeleton variant="text" width={20} height={16} sx={{ mb: 0.5 }} />
                           <Skeleton variant="rectangular" width={20} height={20} sx={{ borderRadius: 0.5 }} />
                         </Box>
                       </Stack>
                    </TableCell>
                  ))}
                  <TableCell sx={{ minWidth: 60, width: 60, position: 'sticky', right: 0, bgcolor: 'white', zIndex: 1, borderLeft: '1px solid #e0e0e0', p: 1 }} align="center">
                    <Skeleton variant="circular" width={32} height={32} sx={{ mx: 'auto', bgcolor: 'rgba(0,0,0,0.04)' }} />
                  </TableCell>
                </TableRow>
              ))
            ) : (
            rows.map((row, rowIndex) => (
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
                        sx={{ 
                          color: 'error.main',
                          bgcolor: 'rgba(244, 67, 54, 0.08)',
                          '&:hover': { bgcolor: 'rgba(244, 67, 54, 0.15)' },
                          mr: 1
                        }}
                      >
                        <CancelIcon fontSize="small" />
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
                <TableCell sx={{
                  minWidth: 60,
                  width: 60,
                  position: 'sticky',
                  right: 0,
                  bgcolor: 'white',
                  zIndex: 1,
                  borderLeft: '1px solid #e0e0e0',
                  textAlign: 'center',
                  verticalAlign: 'middle',
                  px: 1
                }}>
                  <Box sx={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: 36,
                    height: 36,
                    borderRadius: '50%',
                    bgcolor: 'primary.main',
                    color: 'primary.contrastText',
                    fontWeight: 'bold'
                  }}>
                    {row.assignments.reduce((sum, current) => sum + (current.shift1 ? 1 : 0) + (current.shift2 ? 1 : 0), 0)}
                  </Box>
                </TableCell>
              </TableRow>
            ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
        <Button
          variant="contained"
          color="primary"
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

