"use client";

import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  IconButton,
  Typography,
  Box,
  Divider,
  useMediaQuery,
  CircularProgress
} from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';

interface ManagementModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  onSubmit?: () => void;
  submitLabel?: string;
  isSaving?: boolean;
  showFooter?: boolean;
}

export default function ManagementModal({
  open,
  onClose,
  title,
  children,
  onSubmit,
  submitLabel = "Save changes",
  isSaving = false,
  showFooter = true
}: ManagementModalProps) {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'));

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullScreen={fullScreen}
      maxWidth="sm"
      fullWidth
      slotProps={{ paper: { sx: { borderRadius: { md: 4, xs: 0 }, boxShadow: '0px 25px 50px rgba(0,0,0,0.1)' } } }}
    >
      <DialogTitle sx={{ p: 3, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Typography variant="h6" component="span" fontWeight={700}>{title}</Typography>
        <IconButton onClick={onClose} size="small" sx={{ color: 'text.secondary' }}>
          <CloseIcon fontSize="small" />
        </IconButton>
      </DialogTitle>

      <Divider />

      <DialogContent sx={{ p: { xs: 3, md: 4 } }}>
        <Box sx={{ py: 1 }}>{children}</Box>
      </DialogContent>

      {showFooter && (
        <>
          <Divider />
          <DialogActions sx={{ p: 3, bgcolor: 'background.default' }}>
            <Button
              onClick={onClose}
              disabled={isSaving}
              sx={{ borderRadius: 2, px: 3, textTransform: 'none', color: 'text.secondary', fontWeight: 600 }}
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              onClick={onSubmit}
              disabled={isSaving}
              sx={{ borderRadius: 2, px: 4, textTransform: 'none', fontWeight: 700, boxShadow: 'none' }}
              startIcon={isSaving ? <CircularProgress size={20} color="inherit" /> : null}
            >
              {isSaving ? 'Processing...' : submitLabel}
            </Button>
          </DialogActions>
        </>
      )}
    </Dialog>
  );
}
