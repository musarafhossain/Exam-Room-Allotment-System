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
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Checkbox,
  FormControlLabel,
  Slider,
  FormGroup
} from '@mui/material';
import { Visibility, VisibilityOff, Autorenew } from '@mui/icons-material';
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
  email: zod.email('Invalid email address'),
  password: zod.string().min(6, 'Password must be at least 6 characters').optional().or(zod.literal('')),
});

type UserFormValues = zod.infer<typeof userSchema>;

export default function UsersPage() {
  const queryClient = useQueryClient();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(25);
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
  const { register, handleSubmit, reset, setValue, watch, formState: { errors } } = useForm<UserFormValues>({
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

  const [showPassword, setShowPassword] = useState(false);
  const passwordValue = watch('password');

  // Password Generator States
  const [isGenModalOpen, setIsGenModalOpen] = useState(false);
  const [genLength, setGenLength] = useState(12);
  const [genIncludeUppercase, setGenIncludeUppercase] = useState(true);
  const [genIncludeLowercase, setGenIncludeLowercase] = useState(true);
  const [genIncludeNumbers, setGenIncludeNumbers] = useState(true);
  const [genIncludeSymbols, setGenIncludeSymbols] = useState(true);
  const [previewPassword, setPreviewPassword] = useState('');

  const generatePreviewPassword = React.useCallback(() => {
    const lowercase = "abcdefghijklmnopqrstuvwxyz";
    const uppercase = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const numbers = "0123456789";
    const symbols = "!@#$%^&*()_+~`|}{[]:;?><,./-=";
    
    let charPool = "";
    let guaranteed = [];

    if (genIncludeLowercase) {
      charPool += lowercase;
      guaranteed.push(lowercase.charAt(Math.floor(Math.random() * lowercase.length)));
    }
    if (genIncludeUppercase) {
      charPool += uppercase;
      guaranteed.push(uppercase.charAt(Math.floor(Math.random() * uppercase.length)));
    }
    if (genIncludeNumbers) {
      charPool += numbers;
      guaranteed.push(numbers.charAt(Math.floor(Math.random() * numbers.length)));
    }
    if (genIncludeSymbols) {
      charPool += symbols;
      guaranteed.push(symbols.charAt(Math.floor(Math.random() * symbols.length)));
    }

    if (charPool.length === 0) {
      setPreviewPassword('');
      return;
    }

    let generated = [...guaranteed];
    for (let i = generated.length; i < genLength; i++) {
      generated.push(charPool.charAt(Math.floor(Math.random() * charPool.length)));
    }

    // Shuffle the characters
    const shuffled = generated.sort(() => 0.5 - Math.random()).join('');
    setPreviewPassword(shuffled);
  }, [genLength, genIncludeUppercase, genIncludeLowercase, genIncludeNumbers, genIncludeSymbols]);

  React.useEffect(() => {
    if (isGenModalOpen) {
      generatePreviewPassword();
    }
  }, [isGenModalOpen, generatePreviewPassword]);

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
            type={showPassword ? 'text' : 'password'}
            autoComplete="new-password"
            {...register('password')}
            error={!!errors.password}
            helperText={selectedUser ? "Leave empty to keep current password" : errors.password?.message}
            InputLabelProps={{
              shrink: passwordValue ? true : undefined,
            }}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={() => setShowPassword(!showPassword)}
                    edge="end"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          <Button
            variant="outlined"
            onClick={() => setIsGenModalOpen(true)}
            sx={{ alignSelf: 'flex-end' }}
          >
            Generate Password
          </Button>
        </Stack>
      </ManagementModal>

      <Dialog 
        open={isGenModalOpen} 
        onClose={() => setIsGenModalOpen(false)}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle sx={{ pb: 1 }}>Generate Secure Password</DialogTitle>
        <DialogContent>
          <Stack spacing={3} sx={{ mt: 1 }}>
            <Box>
              <Typography gutterBottom variant="subtitle2" color="text.secondary">
                Password Length: <strong>{genLength}</strong> characters
              </Typography>
              <Slider
                value={genLength}
                onChange={(_, newValue) => setGenLength(newValue as number)}
                min={6}
                max={20}
                valueLabelDisplay="auto"
                sx={{ mt: 1 }}
              />
            </Box>

            <Box>
              <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                Character Requirements
              </Typography>
              <FormGroup sx={{ pl: 1 }}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={genIncludeUppercase}
                      onChange={(e) => setGenIncludeUppercase(e.target.checked)}
                      size="small"
                    />
                  }
                  label="Uppercase Letters (A-Z)"
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={genIncludeLowercase}
                      onChange={(e) => setGenIncludeLowercase(e.target.checked)}
                      size="small"
                    />
                  }
                  label="Lowercase Letters (a-z)"
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={genIncludeNumbers}
                      onChange={(e) => setGenIncludeNumbers(e.target.checked)}
                      size="small"
                    />
                  }
                  label="Numbers (0-9)"
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={genIncludeSymbols}
                      onChange={(e) => setGenIncludeSymbols(e.target.checked)}
                      size="small"
                    />
                  }
                  label="Special Symbols (!@#$%^&*)"
                />
              </FormGroup>
            </Box>

            <Box>
              <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                Generated Preview
              </Typography>
              <TextField
                fullWidth
                variant="outlined"
                value={previewPassword}
                placeholder="Select at least one requirement"
                error={!previewPassword}
                InputProps={{
                  readOnly: true,
                  endAdornment: (
                    <InputAdornment position="end">
                      <Tooltip title="Regenerate Password">
                        <span>
                          <IconButton 
                            onClick={generatePreviewPassword} 
                            edge="end"
                            disabled={!genIncludeUppercase && !genIncludeLowercase && !genIncludeNumbers && !genIncludeSymbols}
                          >
                            <Autorenew />
                          </IconButton>
                        </span>
                      </Tooltip>
                    </InputAdornment>
                  ),
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    fontFamily: 'monospace',
                    fontSize: '1.1rem',
                    letterSpacing: '0.05em',
                  }
                }}
              />
            </Box>
          </Stack>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button onClick={() => setIsGenModalOpen(false)} color="inherit">
            Cancel
          </Button>
          <Button 
            onClick={() => {
              if (previewPassword) {
                setValue('password', previewPassword, { shouldValidate: true });
                setShowPassword(true);
                setIsGenModalOpen(false);
              } else {
                toast.error('Please select at least one character type');
              }
            }} 
            variant="contained" 
            color="primary"
            disabled={!previewPassword}
          >
            Apply Password
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
