"use client";

import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  Box, 
  TextField, 
  Stack, 
  Typography, 
  IconButton, 
  InputAdornment,
  Grid
} from '@mui/material';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as zod from 'zod';
import { UserService } from 'services';
import { UserModel } from 'models';
import DataTable from 'components/common/DataTable';
import ManagementModal from 'components/common/ManagementModal';
import toast from 'react-hot-toast';

const userSchema = zod.object({
  name: zod.string().min(2, 'Name must be at least 2 characters'),
  email: zod.string().email('Invalid email address'),
  password: zod.string().min(6, 'Password must be at least 6 characters').optional().or(zod.literal('')),
});

type UserFormValues = zod.infer<typeof userSchema>;

export default function UsersPage() {
  const queryClient = useQueryClient();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserModel | null>(null);

  // Fetch users
  const { data, isLoading } = useQuery({
    queryKey: ['users', page, rowsPerPage, searchTerm],
    queryFn: () => UserService.getList({ page: page + 1, limit: rowsPerPage, search: searchTerm }),
  });

  const users = data?.items || (Array.isArray(data?.data) ? data.data : []);
  const totalCount = data?.total || users.length || 0;

  // Form setup
  const { register, handleSubmit, reset, formState: { errors } } = useForm<UserFormValues>({
    resolver: zodResolver(userSchema),
  });

  // Mutations
  const createMutation = useMutation({
    mutationFn: (newUser: UserFormValues) => UserService.create(newUser),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      toast.success('User created successfully');
      handleCloseModal();
    },
    onError: (err: any) => toast.error(err.message || 'Error creating user'),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string, data: UserFormValues }) => UserService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      toast.success('User updated successfully');
      handleCloseModal();
    },
    onError: (err: any) => toast.error(err.message || 'Error updating user'),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => UserService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      toast.success('User deleted successfully');
    },
    onError: (err: any) => toast.error(err.message || 'Error deleting user'),
  });

  const bulkDeleteMutation = useMutation({
    mutationFn: (ids: string[]) => UserService.bulkDelete(ids),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      toast.success('Users deleted successfully');
    },
    onError: (err: any) => toast.error(err.message || 'Error during bulk delete'),
  });

  const handleOpenModal = (user: UserModel | null = null) => {
    setSelectedUser(user);
    if (user) {
      reset({ name: user.name, email: user.email, password: '' });
    } else {
      reset({ name: '', email: '', password: '' });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedUser(null);
    reset();
  };

  const onSubmit = (formData: UserFormValues) => {
    const rowId = selectedUser?._id || selectedUser?.id;
    if (rowId) {
      updateMutation.mutate({ id: rowId, data: formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  const columns = [
    { id: 'name', label: 'Name', minWidth: 170 },
    { id: 'email', label: 'Email', minWidth: 170 },
  ];

  return (
    <Box>
      <DataTable
        title="Users Management"
        columns={columns}
        data={users}
        isLoading={isLoading}
        totalCount={totalCount}
        page={page}
        rowsPerPage={rowsPerPage}
        onPageChange={setPage}
        onRowsPerPageChange={setRowsPerPage}
        onSearch={setSearchTerm}
        onAdd={() => handleOpenModal()}
        onEdit={(row) => handleOpenModal(row)}
        onDelete={(row) => {
          if (window.confirm('Are you sure you want to delete this user?')) {
            const rowId = row._id || row.id;
            deleteMutation.mutate(rowId);
          }
        }}
        onBulkDelete={(ids) => {
           if (window.confirm(`Are you sure you want to delete ${ids.length} users?`)) {
             bulkDeleteMutation.mutate(ids);
           }
        }}
        addButtonLabel="Add User"
      />

      <ManagementModal
        open={isModalOpen}
        onClose={handleCloseModal}
        title={selectedUser ? 'Edit User' : 'Add New User'}
        onSubmit={handleSubmit(onSubmit)}
        isSaving={createMutation.isPending || updateMutation.isPending}
      >
        <Stack spacing={3}>
          <TextField
            fullWidth
            label="Full Name"
            {...register('name')}
            error={!!errors.name}
            helperText={errors.name?.message}
          />
          <TextField
            fullWidth
            label="Email Address"
            {...register('email')}
            error={!!errors.email}
            helperText={errors.email?.message}
          />
          <TextField
            fullWidth
            label="Password"
            type="password"
            autoComplete="new-password"
            {...register('password')}
            error={!!errors.password}
            helperText={selectedUser ? "Leave empty to keep current password" : errors.password?.message}
          />
        </Stack>
      </ManagementModal>
    </Box>
  );
}
