"use client";

import React, { useState, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Box } from '@mui/material';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { SubjectService } from 'services';
import { SubjectModel } from 'models';
import DataTable from 'components/common/DataTable';
import ManagementModal from 'components/common/ManagementModal';
import toast from 'react-hot-toast';
import ConfirmDialog from 'components/common/ConfirmDialog';
import SubjectNewEditForm, { subjectSchema, type SubjectFormValues } from 'sections/subjects/subject-new-edit-form';

export function SubjectView() {
  const queryClient = useQueryClient();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState<SubjectModel | null>(null);
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);
  const [bulkDeleteTargetIds, setBulkDeleteTargetIds] = useState<string[] | null>(null);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [isBulkConfirmOpen, setIsBulkConfirmOpen] = useState(false);

  // Fetch data
  const subjectQuery = useQuery({
    queryKey: ['subjects', page, rowsPerPage, searchTerm],
    queryFn: () => SubjectService.getList({ page: page + 1, limit: rowsPerPage, search: searchTerm }),
  });

  // More robust data extraction
  const subjects = subjectQuery?.data?.items || [];
  const totalCount = subjectQuery?.data?.total || subjects.length || 0;

  // Form setup
  const methods = useForm<SubjectFormValues>({
    resolver: zodResolver(subjectSchema),
    defaultValues: useMemo(() => {
      if (selectedSubject) {
        return {
          name: selectedSubject.name || '',
        };
      }
      return {
        name: '',
      };
    }, [selectedSubject])
  });

  const { handleSubmit, reset } = methods;

  // Mutations
  const createMutation = useMutation({
    mutationFn: (newSubject: SubjectFormValues) => SubjectService.create(newSubject),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['subjects'] });
      toast.success('Subject created');
      handleCloseModal();
    },
    onError: (err: any) => toast.error(err.message || 'Error creating subject'),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string, data: SubjectFormValues }) => SubjectService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['subjects'] });
      toast.success('Subject updated');
      handleCloseModal();
    },
    onError: (err: any) => toast.error(err.message || 'Error updating subject'),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => SubjectService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['subjects'] });
      toast.success('Subject deleted');
      setIsConfirmOpen(false);
    },
    onError: (err: any) => toast.error(err.message || 'Error deleting subject'),
  });

  const bulkDeleteMutation = useMutation({
    mutationFn: (ids: string[]) => SubjectService.bulkDelete(ids),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['subjects'] });
      toast.success('Subjects deleted successfully');
      setIsBulkConfirmOpen(false);
    },
    onError: (err: any) => toast.error(err.message || 'Error during bulk delete'),
  });

  const handleOpenModal = (subject: SubjectModel | null = null) => {
    setSelectedSubject(subject);
    if (subject) {
      reset({
        name: subject.name,
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
    setSelectedSubject(null);
    reset();
  };

  const onSubmit = (formData: SubjectFormValues) => {
    // SubjectModel usually extends BaseModel which might have _id or id
    const rowId = selectedSubject?._id || selectedSubject?.id;
    if (rowId) {
      updateMutation.mutate({ id: rowId, data: formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  const columns = [
    { id: 'name', label: 'Subject Name', minWidth: 150 },
  ];

  return (
    <Box>
      <DataTable
        title="Subject Management"
        columns={columns}
        data={subjects}
        isLoading={subjectQuery.isLoading}
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
        addButtonLabel="Add Subject"
      />

      <ConfirmDialog
        open={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={() => {
          if (deleteTargetId) {
            deleteMutation.mutate(deleteTargetId);
          }
        }}
        title="Delete Subject"
        content="Are you sure you want to delete this subject? This action cannot be undone."
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
        content={`Are you sure you want to delete ${bulkDeleteTargetIds?.length} subjects?`}
        confirmLabel="Delete All"
        isLoading={bulkDeleteMutation.isPending}
      />

      <ManagementModal
        open={isModalOpen}
        onClose={handleCloseModal}
        title={selectedSubject ? 'Edit Subject' : 'New Subject'}
        onSubmit={handleSubmit(onSubmit)}
        isSaving={createMutation.isPending || updateMutation.isPending}
      >
        <SubjectNewEditForm methods={methods} />
      </ManagementModal>
    </Box>
  );
}
