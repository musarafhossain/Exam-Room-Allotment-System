"use client";

import React, { useState, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Box } from '@mui/material';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { PaperService } from 'services';
import { PaperModel } from 'models';
import DataTable from 'components/common/DataTable';
import ManagementModal from 'components/common/ManagementModal';
import toast from 'react-hot-toast';
import ConfirmDialog from 'components/common/ConfirmDialog';
import PaperNewEditForm, { paperSchema, type PaperFormValues } from 'sections/papers/paper-new-edit-form';

export function PaperView() {
  const queryClient = useQueryClient();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(25);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPaper, setSelectedPaper] = useState<PaperModel | null>(null);
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);
  const [bulkDeleteTargetIds, setBulkDeleteTargetIds] = useState<string[] | null>(null);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [isBulkConfirmOpen, setIsBulkConfirmOpen] = useState(false);

  // Fetch data
  const paperQuery = useQuery({
    queryKey: ['papers', page, rowsPerPage, searchTerm],
    queryFn: () => PaperService.getList({ page: page + 1, limit: rowsPerPage, search: searchTerm }),
  });

  // More robust data extraction
  const papers = paperQuery?.data?.items || [];
  const totalCount = paperQuery?.data?.total || papers.length || 0;

  // Form setup
  const methods = useForm<PaperFormValues>({
    resolver: zodResolver(paperSchema),
    defaultValues: useMemo(() => {
      if (selectedPaper) {
        return {
          name: selectedPaper.name || '',
        };
      }
      return {
        name: '',
      };
    }, [selectedPaper])
  });

  const { handleSubmit, reset } = methods;

  // Mutations
  const createMutation = useMutation({
    mutationFn: (newPaper: PaperFormValues) => PaperService.create(newPaper),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['papers'] });
      toast.success('Paper created');
      handleCloseModal();
    },
    onError: (err: any) => toast.error(err.message || 'Error creating paper'),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string, data: PaperFormValues }) => PaperService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['papers'] });
      toast.success('Paper updated');
      handleCloseModal();
    },
    onError: (err: any) => toast.error(err.message || 'Error updating paper'),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => PaperService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['papers'] });
      toast.success('Paper deleted');
      setIsConfirmOpen(false);
    },
    onError: (err: any) => toast.error(err.message || 'Error deleting paper'),
  });

  const bulkDeleteMutation = useMutation({
    mutationFn: (ids: string[]) => PaperService.bulkDelete(ids),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['papers'] });
      toast.success('Papers deleted successfully');
      setIsBulkConfirmOpen(false);
    },
    onError: (err: any) => toast.error(err.message || 'Error during bulk delete'),
  });

  const handleOpenModal = (paper: PaperModel | null = null) => {
    setSelectedPaper(paper);
    if (paper) {
      reset({
        name: paper.name,
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
    setSelectedPaper(null);
    reset();
  };

  const onSubmit = (formData: PaperFormValues) => {
    const rowId = selectedPaper?._id || selectedPaper?.id;
    if (rowId) {
      updateMutation.mutate({ id: rowId, data: formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  const columns = [
    { id: 'name', label: 'Paper Name', minWidth: 150 },
  ];

  return (
    <Box>
      <DataTable
        title="Paper Management"
        columns={columns}
        data={papers}
        isLoading={paperQuery.isLoading}
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
        addButtonLabel="Add Paper"
      />

      <ConfirmDialog
        open={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={() => {
          if (deleteTargetId) {
            deleteMutation.mutate(deleteTargetId);
          }
        }}
        title="Delete Paper"
        content="Are you sure you want to delete this paper? This action cannot be undone."
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
        content={`Are you sure you want to delete ${bulkDeleteTargetIds?.length} papers?`}
        confirmLabel="Delete All"
        isLoading={bulkDeleteMutation.isPending}
      />

      <ManagementModal
        open={isModalOpen}
        onClose={handleCloseModal}
        title={selectedPaper ? 'Edit Paper' : 'New Paper'}
        onSubmit={handleSubmit(onSubmit)}
        isSaving={createMutation.isPending || updateMutation.isPending}
      >
        <PaperNewEditForm methods={methods} />
      </ManagementModal>
    </Box>
  );
}
