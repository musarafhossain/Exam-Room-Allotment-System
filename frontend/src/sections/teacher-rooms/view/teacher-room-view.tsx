"use client";

import React, { useState, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  Box, 
} from '@mui/material';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { TeacherRoomService } from 'services';
import { TeacherRoomModel } from 'models';
import DataTable from 'components/common/DataTable';
import ManagementModal from 'components/common/ManagementModal';
import toast from 'react-hot-toast';
import dayjs from 'dayjs';
import ConfirmDialog from 'components/common/ConfirmDialog';
import TeacherRoomNewEditForm, { teacherRoomSchema, type TeacherRoomFormValues } from 'sections/teacher-rooms/teacher-room-new-edit-form';

export function TeacherRoomView() {
  const queryClient = useQueryClient();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState<TeacherRoomModel | null>(null);
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);
  const [bulkDeleteTargetIds, setBulkDeleteTargetIds] = useState<string[] | null>(null);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [isBulkConfirmOpen, setIsBulkConfirmOpen] = useState(false);

  // Fetch data
  const teacherRoomQuery = useQuery({
    queryKey: ['teacher-rooms', page, rowsPerPage, searchTerm],
    queryFn: () => TeacherRoomService.getList({ page: page + 1, limit: rowsPerPage, search: searchTerm }),
  });

  const rooms = teacherRoomQuery?.data?.items || [];
  const totalCount = teacherRoomQuery?.data?.total || rooms.length || 0;

  // Form setup
  const methods = useForm<TeacherRoomFormValues>({
    resolver: zodResolver(teacherRoomSchema),
    defaultValues: useMemo(() => {
      if (selectedRoom) {
        return {
          name: selectedRoom.name || '',
          roomNo: selectedRoom.roomNo,
          floor: selectedRoom.floor || '',
          building: selectedRoom.building || '',
          time: selectedRoom.time || '10:00',
          date: selectedRoom.date ? selectedRoom.date.split('T')[0] : '',
        };
      }
      return {
        name: '',
        roomNo: '', 
        floor: '', 
        building: '', 
        time: '10:00', 
        date: '',
      };
    }, [selectedRoom])
  });

  const { handleSubmit, reset } = methods;

  // Mutations
  const createMutation = useMutation({
    mutationFn: (newRoom: TeacherRoomFormValues) => TeacherRoomService.create(newRoom),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['teacher-rooms'] });
      toast.success('Room assignment created');
      handleCloseModal();
    },
    onError: (err: any) => toast.error(err.message || 'Error creating room'),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string, data: TeacherRoomFormValues }) => TeacherRoomService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['teacher-rooms'] });
      toast.success('Room assignment updated');
      handleCloseModal();
    },
    onError: (err: any) => toast.error(err.message || 'Error updating room'),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => TeacherRoomService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['teacher-rooms'] });
      toast.success('Room assignment deleted');
      setIsConfirmOpen(false);
    },
    onError: (err: any) => toast.error(err.message || 'Error deleting room'),
  });

  const bulkDeleteMutation = useMutation({
    mutationFn: (ids: string[]) => TeacherRoomService.bulkDelete(ids),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['teacher-rooms'] });
      toast.success('Assignments deleted successfully');
      setIsBulkConfirmOpen(false);
    },
    onError: (err: any) => toast.error(err.message || 'Error during bulk delete'),
  });

  const handleOpenModal = (room: TeacherRoomModel | null = null) => {
    setSelectedRoom(room);
    if (room) {
      reset({
        name: room.name,
        roomNo: room.roomNo,
        floor: room.floor,
        building: room.building,
        time: room.time || '10:00',
        date: room.date ? room.date.split('T')[0] : '',
      });
    } else {
      reset({
        name: '', roomNo: '', floor: '', building: '', 
        time: '10:00', date: '',
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedRoom(null);
    reset();
  };

  const onSubmit = (formData: TeacherRoomFormValues) => {
    const rowId = selectedRoom?._id || selectedRoom?.id;
    if (rowId) {
      updateMutation.mutate({ id: rowId, data: formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  const columns = [
    { id: 'name', label: 'Teacher Name', minWidth: 150 },
    { id: 'roomNo', label: 'Room', minWidth: 80 },
    { id: 'floor', label: 'Floor', minWidth: 100 },
    { id: 'building', label: 'Building', minWidth: 150 },
    { id: 'date', label: 'Date', minWidth: 120, format: (value: string) => value ? dayjs(value).format('DD/MM/YYYY') : '-' },
    { id: 'time', label: 'Time', minWidth: 100 },
  ];

  return (
    <Box>
      <DataTable
        title="Teacher Room Management"
        columns={columns}
        data={rooms}
        isLoading={teacherRoomQuery.isLoading}
        totalCount={totalCount}
        page={page}
        rowsPerPage={rowsPerPage}
        onPageChange={setPage}
        onRowsPerPageChange={setRowsPerPage}
        onSearch={setSearchTerm}
        onAdd={() => handleOpenModal()}
        onEdit={(row) => handleOpenModal(row)}
        onDelete={(row) => {
          setDeleteTargetId(row._id || row.id);
          setIsConfirmOpen(true);
        }}
        onBulkDelete={(ids) => {
          setBulkDeleteTargetIds(ids);
          setIsBulkConfirmOpen(true);
        }}
        addButtonLabel="Add Teacher Assignment"
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
        title={selectedRoom ? 'Edit Assignment' : 'New Teacher Assignment'}
        onSubmit={handleSubmit(onSubmit)}
        isSaving={createMutation.isPending || updateMutation.isPending}
      >
        <TeacherRoomNewEditForm methods={methods} />
      </ManagementModal>
    </Box>
  );
}
