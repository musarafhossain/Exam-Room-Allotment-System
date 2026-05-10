"use client";

import React, { useState, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Box } from '@mui/material';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { FloorService } from 'services';
import { FloorModel } from 'models';
import DataTable from 'components/common/DataTable';
import ManagementModal from 'components/common/ManagementModal';
import toast from 'react-hot-toast';
import ConfirmDialog from 'components/common/ConfirmDialog';
import FloorNewEditForm, { floorSchema, type FloorFormValues } from 'sections/floors/floor-new-edit-form';

export function FloorView() {
  const queryClient = useQueryClient();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedFloor, setSelectedFloor] = useState<FloorModel | null>(null);
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);
  const [bulkDeleteTargetIds, setBulkDeleteTargetIds] = useState<string[] | null>(null);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [isBulkConfirmOpen, setIsBulkConfirmOpen] = useState(false);

  // Fetch data
  const floorQuery = useQuery({
    queryKey: ['floors', page, rowsPerPage, searchTerm],
    queryFn: () => FloorService.getList({ page: page + 1, limit: rowsPerPage, search: searchTerm }),
  });

  // More robust data extraction
  const floors = floorQuery?.data?.items || [];
  const totalCount = floorQuery?.data?.total || floors.length || 0;

  // Form setup
  const methods = useForm<FloorFormValues>({
    resolver: zodResolver(floorSchema),
    defaultValues: useMemo(() => {
      if (selectedFloor) {
        return {
          name: selectedFloor.name || '',
        };
      }
      return {
        name: '',
      };
    }, [selectedFloor])
  });

  const { handleSubmit, reset } = methods;

  // Mutations
  const createMutation = useMutation({
    mutationFn: (newFloor: FloorFormValues) => FloorService.create(newFloor),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['floors'] });
      toast.success('Floor created');
      handleCloseModal();
    },
    onError: (err: any) => toast.error(err.message || 'Error creating floor'),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string, data: FloorFormValues }) => FloorService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['floors'] });
      toast.success('Floor updated');
      handleCloseModal();
    },
    onError: (err: any) => toast.error(err.message || 'Error updating floor'),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => FloorService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['floors'] });
      toast.success('Floor deleted');
      setIsConfirmOpen(false);
    },
    onError: (err: any) => toast.error(err.message || 'Error deleting floor'),
  });

  const bulkDeleteMutation = useMutation({
    mutationFn: (ids: string[]) => FloorService.bulkDelete(ids),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['floors'] });
      toast.success('Floors deleted successfully');
      setIsBulkConfirmOpen(false);
    },
    onError: (err: any) => toast.error(err.message || 'Error during bulk delete'),
  });

  const handleOpenModal = (floor: FloorModel | null = null) => {
    setSelectedFloor(floor);
    if (floor) {
      reset({
        name: floor.name,
      });
    } else {
      reset({
        name: '',
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedFloor(null);
    reset();
  };

  const onSubmit = (formData: FloorFormValues) => {
    const rowId = selectedFloor?._id || selectedFloor?.id;
    if (rowId) {
      updateMutation.mutate({ id: rowId, data: formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  const columns = [
    { id: 'name', label: 'Floor Name', minWidth: 150 },
  ];

  return (
    <Box>
      <DataTable
        title="Floor Management"
        columns={columns}
        data={floors}
        isLoading={floorQuery.isLoading}
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
        addButtonLabel="Add Floor"
      />

      <ConfirmDialog
        open={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={() => {
          if (deleteTargetId) {
            deleteMutation.mutate(deleteTargetId);
          }
        }}
        title="Delete Floor"
        content="Are you sure you want to delete this floor? This action cannot be undone."
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
        content={`Are you sure you want to delete ${bulkDeleteTargetIds?.length} floors?`}
        confirmLabel="Delete All"
        isLoading={bulkDeleteMutation.isPending}
      />

      <ManagementModal
        open={isModalOpen}
        onClose={handleCloseModal}
        title={selectedFloor ? 'Edit Floor' : 'New Floor'}
        onSubmit={handleSubmit(onSubmit)}
        isSaving={createMutation.isPending || updateMutation.isPending}
      >
        <FloorNewEditForm methods={methods} />
      </ManagementModal>
    </Box>
  );
}
