"use client";

import React, { useState, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  Box, 
  Tabs,
  Tab 
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
import StudentRoomNewEditForm, { roomSchema, type RoomFormValues } from 'sections/student-rooms/student-room-new-edit-form';

export function StudentRoomView() {
  const queryClient = useQueryClient();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState<StudentRoomModel | null>(null);
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);
  const [bulkDeleteTargetIds, setBulkDeleteTargetIds] = useState<string[] | null>(null);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [isBulkConfirmOpen, setIsBulkConfirmOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'UG/PG' | 'Others'>('UG/PG');

  // Fetch data
  const stuRoomQuery = useQuery({
    queryKey: ['student-rooms', page, rowsPerPage, searchTerm, activeTab],
    queryFn: () => StudentRoomService.getList({ page: page + 1, limit: rowsPerPage, search: searchTerm, examType: activeTab }),
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

  // More robust data extraction
  const rooms = stuRoomQuery?.data?.items || [];
  const totalCount = stuRoomQuery?.data?.total || rooms.length || 0;

  const floors = floorQuery?.data?.items || [];
  const subjects = subjectQuery?.data?.items || [];
  const papers = paperQuery?.data?.items || [];
  const buildings = buildingQuery?.data?.items || [];

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

  // Mutations
  const createMutation = useMutation({
    mutationFn: (newRoom: RoomFormValues) => StudentRoomService.create(newRoom),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['student-rooms'] });
      toast.success('Room assignment created');
      handleCloseModal();
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
    </Box>
  );
}
