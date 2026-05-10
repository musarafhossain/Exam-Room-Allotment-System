"use client";

import React, { useState, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Box } from '@mui/material';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { BuildingService } from 'services';
import { BuildingModel } from 'models';
import DataTable from 'components/common/DataTable';
import ManagementModal from 'components/common/ManagementModal';
import toast from 'react-hot-toast';
import ConfirmDialog from 'components/common/ConfirmDialog';
import BuildingNewEditForm, { buildingSchema, type BuildingFormValues } from 'sections/buildings/building-new-edit-form';

export function BuildingView() {
  const queryClient = useQueryClient();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(25);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedBuilding, setSelectedBuilding] = useState<BuildingModel | null>(null);
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);
  const [bulkDeleteTargetIds, setBulkDeleteTargetIds] = useState<string[] | null>(null);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [isBulkConfirmOpen, setIsBulkConfirmOpen] = useState(false);

  // Fetch data
  const buildingQuery = useQuery({
    queryKey: ['buildings', page, rowsPerPage, searchTerm],
    queryFn: () => BuildingService.getList({ page: page + 1, limit: rowsPerPage, search: searchTerm }),
  });

  // More robust data extraction
  const buildings = buildingQuery?.data?.items || [];
  const totalCount = buildingQuery?.data?.total || buildings.length || 0;

  // Form setup
  const methods = useForm<BuildingFormValues>({
    resolver: zodResolver(buildingSchema),
    defaultValues: useMemo(() => {
      if (selectedBuilding) {
        return {
          name: selectedBuilding.name || '',
        };
      }
      return {
        name: '',
      };
    }, [selectedBuilding])
  });

  const { handleSubmit, reset } = methods;

  // Mutations
  const createMutation = useMutation({
    mutationFn: (newBuilding: BuildingFormValues) => BuildingService.create(newBuilding),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['buildings'] });
      toast.success('Building created');
      handleCloseModal();
    },
    onError: (err: any) => toast.error(err.message || 'Error creating building'),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string, data: BuildingFormValues }) => BuildingService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['buildings'] });
      toast.success('Building updated');
      handleCloseModal();
    },
    onError: (err: any) => toast.error(err.message || 'Error updating building'),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => BuildingService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['buildings'] });
      toast.success('Building deleted');
      setIsConfirmOpen(false);
    },
    onError: (err: any) => toast.error(err.message || 'Error deleting building'),
  });

  const bulkDeleteMutation = useMutation({
    mutationFn: (ids: string[]) => BuildingService.bulkDelete(ids),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['buildings'] });
      toast.success('Buildings deleted successfully');
      setIsBulkConfirmOpen(false);
    },
    onError: (err: any) => toast.error(err.message || 'Error during bulk delete'),
  });

  const handleOpenModal = (building: BuildingModel | null = null) => {
    setSelectedBuilding(building);
    if (building) {
      reset({
        name: building.name,
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
    setSelectedBuilding(null);
    reset();
  };

  const onSubmit = (formData: BuildingFormValues) => {
    const rowId = selectedBuilding?._id || selectedBuilding?.id;
    if (rowId) {
      updateMutation.mutate({ id: rowId, data: formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  const columns = [
    { id: 'name', label: 'Building Name', minWidth: 150 },
  ];

  return (
    <Box>
      <DataTable
        title="Building Management"
        columns={columns}
        data={buildings}
        isLoading={buildingQuery.isLoading}
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
        addButtonLabel="Add Building"
      />

      <ConfirmDialog
        open={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={() => {
          if (deleteTargetId) {
            deleteMutation.mutate(deleteTargetId);
          }
        }}
        title="Delete Building"
        content="Are you sure you want to delete this building? This action cannot be undone."
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
        content={`Are you sure you want to delete ${bulkDeleteTargetIds?.length} buildings?`}
        confirmLabel="Delete All"
        isLoading={bulkDeleteMutation.isPending}
      />

      <ManagementModal
        open={isModalOpen}
        onClose={handleCloseModal}
        title={selectedBuilding ? 'Edit Building' : 'New Building'}
        onSubmit={handleSubmit(onSubmit)}
        isSaving={createMutation.isPending || updateMutation.isPending}
      >
        <BuildingNewEditForm methods={methods} />
      </ManagementModal>
    </Box>
  );
}
