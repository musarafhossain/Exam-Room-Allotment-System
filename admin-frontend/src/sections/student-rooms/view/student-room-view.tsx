"use client";

import React, { useState, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Box,
  Tabs,
  Tab,
  TextField,
  Autocomplete
} from '@mui/material';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { StudentRoomService, FloorService, SubjectService, PaperService, BuildingService } from 'services';
import { StudentRoomModel } from 'models';
import DataTable from 'components/common/DataTable';
import ManagementModal from 'components/common/ManagementModal';
import toast from 'react-hot-toast';
import dayjs from 'dayjs';
import ConfirmDialog from 'components/common/ConfirmDialog';
import StudentRoomNewEditForm, { roomSchema, getBulkRoomSchema, type RoomFormValues } from 'sections/student-rooms/student-room-new-edit-form';
import StudentRoomBulkEditForm from 'sections/student-rooms/student-room-bulk-edit-form';

export function StudentRoomView() {
  const queryClient = useQueryClient();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(25);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState<StudentRoomModel | null>(null);
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);
  const [bulkDeleteTargetIds, setBulkDeleteTargetIds] = useState<string[] | null>(null);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [isBulkConfirmOpen, setIsBulkConfirmOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'UG/PG' | 'Others'>('UG/PG');

  const [isBulkEditModalOpen, setIsBulkEditModalOpen] = useState(false);
  const [bulkEditRooms, setBulkEditRooms] = useState<StudentRoomModel[]>([]);
  const [initialLockedFields, setInitialLockedFields] = useState<Record<string, boolean>>({});
  const [unlockedFields, setUnlockedFields] = useState<Record<string, boolean>>({});

  const [filterFloor, setFilterFloor] = useState<string[]>([]);
  const [filterBuilding, setFilterBuilding] = useState<string[]>([]);
  const [filterSubject, setFilterSubject] = useState<string[]>([]);
  const [filterPaper, setFilterPaper] = useState<string[]>([]);
  const [filterSemester, setFilterSemester] = useState<number[]>([]);
  const [filterDate, setFilterDate] = useState<string>('');
  const [filterTime, setFilterTime] = useState<string>('');
  const [clearSelectionTrigger, setClearSelectionTrigger] = useState(0);

  // Fetch data
  const stuRoomQuery = useQuery({
    queryKey: ['student-rooms', page, rowsPerPage, searchTerm, activeTab, filterFloor, filterBuilding, filterSubject, filterPaper, filterSemester, filterDate, filterTime],
    queryFn: () => StudentRoomService.getList({
      page: page + 1,
      limit: rowsPerPage,
      search: searchTerm,
      examType: activeTab,
      floor: filterFloor.length > 0 ? filterFloor.join(',') : undefined,
      building: filterBuilding.length > 0 ? filterBuilding.join(',') : undefined,
      subject: filterSubject.length > 0 ? filterSubject.join(',') : undefined,
      paper: filterPaper.length > 0 ? filterPaper.join(',') : undefined,
      semester: filterSemester.length > 0 ? filterSemester.join(',') : undefined,
      date: filterDate || undefined,
      time: filterTime || undefined
    }),
  });

  const floorQuery = useQuery({
    queryKey: ['floors-all'],
    queryFn: () => FloorService.getList({ page: 1, limit: 1000 }),
  });

  const subjectQuery = useQuery({
    queryKey: ['subjects-all'],
    queryFn: () => SubjectService.getList({ page: 1, limit: 1000 }),
  });

  const paperQuery = useQuery({
    queryKey: ['papers-all'],
    queryFn: () => PaperService.getList({ page: 1, limit: 1000 }),
  });

  const buildingQuery = useQuery({
    queryKey: ['buildings-all'],
    queryFn: () => BuildingService.getList({ page: 1, limit: 1000 }),
  });

  const filterOptionsQuery = useQuery({
    queryKey: ['student-room-filter-options', activeTab],
    queryFn: () => StudentRoomService.getFilterOptions({ examType: activeTab }),
  });

  // More robust data extraction
  const rooms = stuRoomQuery?.data?.items || [];
  const totalCount = stuRoomQuery?.data?.total || rooms.length || 0;

  const floors = floorQuery?.data?.items || [];
  const subjects = subjectQuery?.data?.items || [];
  const papers = paperQuery?.data?.items || [];
  const buildings = buildingQuery?.data?.items || [];

  const filterDates = filterOptionsQuery?.data?.data?.dates || [];
  const filterTimes = filterOptionsQuery?.data?.data?.times || [];

  // Form setup
  const methods = useForm<RoomFormValues>({
    resolver: zodResolver(roomSchema),
    defaultValues: useMemo(() => {
      if (selectedRoom) {
        return {
          examType: selectedRoom.examType || 'UG/PG',
          examName: selectedRoom.examName || '',
          roomNo: selectedRoom.roomNo,
          floor: selectedRoom.floor || '',
          building: selectedRoom.building || '',
          subject: selectedRoom.subject || '',
          paper: selectedRoom.paper || '',
          semester: selectedRoom.semester ?? 1,
          time: selectedRoom.time || '10:00',
          date: selectedRoom.date ? selectedRoom.date.split('T')[0] : '',
          regNoFrom: selectedRoom.regNoFrom,
          regNoTo: selectedRoom.regNoTo
        };
      }
      return {
        examType: 'UG/PG', examName: '',
        semester: 1,
        roomNo: '', floor: '', building: '', subject: '', paper: '',
        time: '10:00', date: '', regNoFrom: '', regNoTo: ''
      };
    }, [selectedRoom])
  });

  const { handleSubmit, reset } = methods;

  const dynamicBulkSchema = useMemo(() => {
    return getBulkRoomSchema(initialLockedFields, unlockedFields);
  }, [initialLockedFields, unlockedFields]);

  const bulkEditMethods = useForm<RoomFormValues>({
    resolver: zodResolver(dynamicBulkSchema) as any,
  });
  const { handleSubmit: handleBulkSubmit } = bulkEditMethods;

  // Mutations
  const createMutation = useMutation({
    mutationFn: (newRoom: RoomFormValues) => StudentRoomService.create(newRoom),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['student-rooms'] });
      toast.success('Room assignment created');
      // handleCloseModal();
    },
    onError: (err: any) => toast.error(err.message || 'Error creating room'),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string, data: RoomFormValues }) => StudentRoomService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['student-rooms'] });
      toast.success('Room assignment updated');
      handleCloseModal();
    },
    onError: (err: any) => toast.error(err.message || 'Error updating room'),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => StudentRoomService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['student-rooms'] });
      toast.success('Room assignment deleted');
      setIsConfirmOpen(false);
    },
    onError: (err: any) => toast.error(err.message || 'Error deleting room'),
  });

  const bulkDeleteMutation = useMutation({
    mutationFn: (ids: string[]) => StudentRoomService.bulkDelete(ids),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['student-rooms'] });
      toast.success('Assignments deleted successfully');
      setIsBulkConfirmOpen(false);
    },
    onError: (err: any) => toast.error(err.message || 'Error during bulk delete'),
  });

  const bulkUpdateMutation = useMutation({
    mutationFn: (payload: { ids: string[], updateData: Partial<RoomFormValues> }) => StudentRoomService.bulkUpdate(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['student-rooms'] });
      toast.success('Room assignments updated successfully');
      setIsBulkEditModalOpen(false);
      setBulkEditRooms([]);
      setClearSelectionTrigger(prev => prev + 1);
    },
    onError: (err: any) => toast.error(err.message || 'Error during bulk update'),
  });

  const handleOpenModal = (room: StudentRoomModel | null = null) => {
    setSelectedRoom(room);
    if (room) {
      reset({
        examType: room.examType || activeTab,
        examName: room.examName || '',
        roomNo: room.roomNo,
        floor: room.floor,
        building: room.building,
        subject: room.subject,
        paper: room.paper,
        semester: room.semester ?? 1,
        time: room.time || '10:00',
        date: room.date ? room.date.split('T')[0] : '',
        regNoFrom: room.regNoFrom,
        regNoTo: room.regNoTo
      });
    } else {
      reset({
        examType: activeTab, examName: '',
        semester: 1,
        roomNo: '', floor: '', building: '', subject: '', paper: '',
        time: '10:00', date: '', regNoFrom: '', regNoTo: ''
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedRoom(null);
    reset();
  };

  const onSubmit = (formData: RoomFormValues) => {
    const rowId = selectedRoom?._id || selectedRoom?.id;
    if (rowId) {
      updateMutation.mutate({ id: rowId, data: formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  const handleOpenBulkEdit = (selectedIds: string[]) => {
    const selected = rooms.filter(r => selectedIds.includes(r._id || r.id || ''));
    setBulkEditRooms(selected);

    const fieldsToCompare: (keyof RoomFormValues)[] = ['examType', 'examName', 'roomNo', 'floor', 'building', 'subject', 'paper', 'semester', 'time', 'date', 'regNoFrom', 'regNoTo'];
    const locked: Record<string, boolean> = {};
    const commonValues: Partial<RoomFormValues> = {};

    fieldsToCompare.forEach(field => {
      if (selected.length === 0) return;
      const firstVal = selected[0][field as keyof StudentRoomModel];

      const isAllSame = selected.every(r => {
        let val = r[field as keyof StudentRoomModel];
        if (field === 'date' && val) val = (val as string).split('T')[0];
        let fVal = firstVal;
        if (field === 'date' && fVal) fVal = (fVal as string).split('T')[0];
        return val === fVal;
      });

      if (isAllSame) {
        locked[field] = false;
        let val = firstVal;
        if (field === 'date' && val) val = (val as string).split('T')[0] as any;
        commonValues[field] = val as any;
      } else {
        locked[field] = true;
        commonValues[field] = '' as any;
      }
    });

    setInitialLockedFields(locked);
    setUnlockedFields({});

    bulkEditMethods.reset({
      examType: (commonValues.examType as any) || activeTab,
      examName: commonValues.examName || '',
      roomNo: commonValues.roomNo || '',
      floor: commonValues.floor || '',
      building: commonValues.building || '',
      subject: commonValues.subject || '',
      paper: commonValues.paper || '',
      semester: commonValues.semester ?? 1,
      time: commonValues.time || '10:00',
      date: commonValues.date || '',
      regNoFrom: commonValues.regNoFrom || '',
      regNoTo: commonValues.regNoTo || '',
    });

    setIsBulkEditModalOpen(true);
  };

  const onBulkEditSubmit = (formData: RoomFormValues) => {
    const updateData: Partial<RoomFormValues> = {};
    const fields: (keyof RoomFormValues)[] = ['examType', 'examName', 'roomNo', 'floor', 'building', 'subject', 'paper', 'semester', 'time', 'date', 'regNoFrom', 'regNoTo'];

    fields.forEach(field => {
      if (!initialLockedFields[field] || unlockedFields[field]) {
        updateData[field] = formData[field] as any;
      }
    });

    if (Object.keys(updateData).length === 0) {
      toast.error('No fields were modified');
      return;
    }

    const ids = bulkEditRooms.map(r => (r._id || r.id) as string);
    bulkUpdateMutation.mutate({ ids, updateData });
  };

  const columns = activeTab === 'UG/PG' ? [
    { id: 'roomNo', label: 'Room', minWidth: 80 },
    { id: 'building', label: 'Building', minWidth: 100 },
    { id: 'semester', label: 'Semester', minWidth: 60 },
    { id: 'subject', label: 'Subject', minWidth: 150 },
    { id: 'date', label: 'Date', minWidth: 120, format: (value: string) => value ? dayjs(value).format('DD/MM/YYYY') : '-' },
    { id: 'time', label: 'Time', minWidth: 100, format: (value: string) => value ? dayjs(`2000-01-01 ${value}`).format('hh:mm A') : '-' },
    { id: 'regNoFrom', label: 'Reg From', minWidth: 100 },
    { id: 'regNoTo', label: 'Reg To', minWidth: 100 },
  ] : [
    { id: 'roomNo', label: 'Room', minWidth: 80 },
    { id: 'building', label: 'Building', minWidth: 100 },
    { id: 'examName', label: 'Exam Name', minWidth: 150 },
    { id: 'date', label: 'Date', minWidth: 120, format: (value: string) => value ? dayjs(value).format('DD/MM/YYYY') : '-' },
    { id: 'time', label: 'Time', minWidth: 100, format: (value: string) => value ? dayjs(`2000-01-01 ${value}`).format('hh:mm A') : '-' },
    { id: 'regNoFrom', label: 'Reg From', minWidth: 100 },
    { id: 'regNoTo', label: 'Reg To', minWidth: 100 },
  ];


  return (
    <Box>
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs
          value={activeTab}
          onChange={(_, newVal) => {
            setActiveTab(newVal);
            setPage(0);
          }}
          aria-label="exam type tabs"
        >
          <Tab label="UG/PG Exams" value="UG/PG" />
          <Tab label="Others Exams" value="Others" />
        </Tabs>
      </Box>

      <Box sx={{
        mb: 3,
        p: 2,
        bgcolor: 'background.paper',
        borderRadius: 2,
        boxShadow: '0px 2px 10px rgba(0,0,0,0.05)',
        border: '1px solid',
        borderColor: 'divider',
        display: 'flex',
        gap: 2,
        flexWrap: 'wrap'
      }}>
        {activeTab === 'UG/PG' && (
          <Autocomplete
            multiple
            limitTags={2}
            disableCloseOnSelect
            options={[1, 2, 3, 4, 5, 6, 7, 8]}
            getOptionLabel={(option) => option.toString()}
            value={filterSemester}
            onChange={(_, newValue) => { setFilterSemester(newValue); setPage(0); }}
            renderInput={(params) => <TextField {...params} label="Filter Semester" size="small" />}
            sx={{ minWidth: 150, flex: 1 }}
          />
        )}
        <Autocomplete
          multiple
          limitTags={2}
          disableCloseOnSelect
          options={floors.map((f) => f.name)}
          value={filterFloor}
          onChange={(_, newValue) => { setFilterFloor(newValue); setPage(0); }}
          renderInput={(params) => <TextField {...params} label="Filter Floor" size="small" />}
          sx={{ minWidth: 150, flex: 1 }}
        />
        <Autocomplete
          multiple
          limitTags={2}
          disableCloseOnSelect
          options={buildings.map((b) => b.name)}
          value={filterBuilding}
          onChange={(_, newValue) => { setFilterBuilding(newValue); setPage(0); }}
          renderInput={(params) => <TextField {...params} label="Filter Building" size="small" />}
          sx={{ minWidth: 150, flex: 1 }}
        />
        <Autocomplete
          options={filterDates}
          value={filterDate || null}
          onChange={(_, newValue) => { setFilterDate(newValue || ''); setPage(0); }}
          renderInput={(params) => <TextField {...params} label="Filter Date" size="small" />}
          sx={{ minWidth: 150, flex: 1 }}
        />
        <Autocomplete
          options={filterTimes}
          value={filterTime || null}
          onChange={(_, newValue) => { setFilterTime(newValue || ''); setPage(0); }}
          renderInput={(params) => <TextField {...params} label="Filter Time" size="small" />}
          sx={{ minWidth: 150, flex: 1 }}
        />
        {activeTab === 'UG/PG' && (
          <>
            <Autocomplete
              multiple
              limitTags={2}
              disableCloseOnSelect
              options={subjects.map((s) => s.name)}
              value={filterSubject}
              onChange={(_, newValue) => { setFilterSubject(newValue); setPage(0); }}
              renderInput={(params) => <TextField {...params} label="Filter Subject" size="small" />}
              sx={{ minWidth: 150, flex: 1 }}
            />
            <Autocomplete
              multiple
              limitTags={2}
              disableCloseOnSelect
              options={papers.map((p) => p.name)}
              value={filterPaper}
              onChange={(_, newValue) => { setFilterPaper(newValue); setPage(0); }}
              renderInput={(params) => <TextField {...params} label="Filter Paper" size="small" />}
              sx={{ minWidth: 150, flex: 1 }}
            />
          </>
        )}
      </Box>

      <DataTable
        title={activeTab === 'UG/PG' ? "UG/PG Student Rooms" : "Other Exam Student Rooms"}
        columns={columns}
        data={rooms}
        isLoading={stuRoomQuery.isLoading}
        totalCount={totalCount}
        page={page}
        rowsPerPage={rowsPerPage}
        onPageChange={setPage}
        onRowsPerPageChange={setRowsPerPage}
        onSearch={setSearchTerm}
        onAdd={() => handleOpenModal()}
        onEdit={(row) => handleOpenModal(row)}
        onBulkEdit={handleOpenBulkEdit}
        clearSelectionTrigger={clearSelectionTrigger}
        onDelete={(row) => {
          setDeleteTargetId(row._id);
          setIsConfirmOpen(true);
        }}
        onBulkDelete={(ids) => {
          setBulkDeleteTargetIds(ids);
          setIsBulkConfirmOpen(true);
        }}
        addButtonLabel="Add Room Assignment"
      />

      <ConfirmDialog
        open={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={() => {
          if (deleteTargetId) {
            deleteMutation.mutate(deleteTargetId);
          }
        }}
        title="Delete Assignment"
        content="Are you sure you want to delete this room assignment? This action cannot be undone."
        confirmLabel="Delete"
        isLoading={deleteMutation.isPending}
      />

      <ConfirmDialog
        open={isBulkConfirmOpen}
        onClose={() => setIsBulkConfirmOpen(false)}
        onConfirm={() => {
          if (bulkDeleteTargetIds) {
            bulkDeleteMutation.mutate(bulkDeleteTargetIds);
          }
        }}
        title="Delete Selected"
        content={`Are you sure you want to delete ${bulkDeleteTargetIds?.length} assignments?`}
        confirmLabel="Delete All"
        isLoading={bulkDeleteMutation.isPending}
      />

      <ManagementModal
        open={isModalOpen}
        onClose={handleCloseModal}
        title={selectedRoom ? 'Edit Assignment' : 'New Room Assignment'}
        onSubmit={handleSubmit(onSubmit)}
        isSaving={createMutation.isPending || updateMutation.isPending}
      >
        <StudentRoomNewEditForm methods={methods} floors={floors} subjects={subjects} papers={papers} buildings={buildings} />
      </ManagementModal>

      <ManagementModal
        open={isBulkEditModalOpen}
        onClose={() => { setIsBulkEditModalOpen(false); setBulkEditRooms([]); }}
        title="Bulk Edit Assignments"
        onSubmit={handleBulkSubmit(onBulkEditSubmit)}
        isSaving={bulkUpdateMutation.isPending}
      >
        <StudentRoomBulkEditForm
          methods={bulkEditMethods}
          floors={floors}
          subjects={subjects}
          papers={papers}
          buildings={buildings}
          initialLockedFields={initialLockedFields}
          unlockedFields={unlockedFields}
          onUnlockField={(field) => setUnlockedFields(prev => ({ ...prev, [field]: true }))}
        />
      </ManagementModal>
    </Box>
  );
}
