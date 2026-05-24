"use client";

import React, { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TablePagination,
  Box,
  Checkbox,
  IconButton,
  Tooltip,
  Typography,
  Toolbar,
  TextField,
  InputAdornment,
  Button,
  Chip,
  Skeleton,
  Stack
} from '@mui/material';
import {
  Delete as DeleteIcon,
  Edit as EditIcon,
  Search as SearchIcon,
  FilterList as FilterIcon,
  Add as AddIcon,
  MoreVert as MoreVertIcon
} from '@mui/icons-material';

interface ColumnDef {
  id: string;
  label: string;
  minWidth?: number;
  align?: 'right' | 'left' | 'center';
  format?: (value: any, row: any) => React.ReactNode;
}

interface DataTableProps {
  columns: ColumnDef[];
  data: any[];
  isLoading?: boolean;
  totalCount: number;
  page: number;
  rowsPerPage: number;
  onPageChange: (newPage: number) => void;
  onRowsPerPageChange: (newRowsPerPage: number) => void;
  onEdit?: (row: any) => void;
  onDelete?: (row: any) => void;
  onBulkDelete?: (selectedIds: string[]) => void;
  onBulkEdit?: (selectedIds: string[]) => void;
  onSearch?: (term: string) => void;
  onAdd?: () => void;
  title: string;
  addButtonLabel?: string;
  clearSelectionTrigger?: number;
}

export default function DataTable({
  columns,
  data,
  isLoading,
  totalCount,
  page,
  rowsPerPage,
  onPageChange,
  onRowsPerPageChange,
  onEdit,
  onDelete,
  onBulkDelete,
  onBulkEdit,
  onSearch,
  onAdd,
  title,
  addButtonLabel = "Add New",
  clearSelectionTrigger
}: DataTableProps) {
  const [selected, setSelected] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  React.useEffect(() => {
    if (clearSelectionTrigger !== undefined && clearSelectionTrigger > 0) {
      setSelected([]);
    }
  }, [clearSelectionTrigger]);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
    if (onSearch) onSearch(event.target.value);
  };

  const getRowId = (row: any) => row.id || row._id;

  const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      const newSelecteds = data.map((n) => getRowId(n));
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  const handleClick = (event: React.MouseEvent<unknown>, id: string) => {
    const selectedIndex = selected.indexOf(id);
    let newSelected: string[] = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, id);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1),
      );
    }

    setSelected(newSelected);
  };

  const isSelected = (id: string) => selected.indexOf(id) !== -1;

  const handleBulkDelete = () => {
    if (onBulkDelete) {
      onBulkDelete(selected);
      setSelected([]);
    }
  };

  const numSelected = selected.length;

  return (
    <Paper sx={{ width: '100%', mb: 2, borderRadius: 3, overflow: 'hidden', boxShadow: '0px 2px 10px rgba(0,0,0,0.05)', border: '1px solid', borderColor: 'divider' }}>
      <Toolbar
        sx={{
          pl: { sm: 2 },
          py: 2
        }}
      >
        {numSelected > 0 ? (
          <Typography sx={{ flex: '1 1 100%' }} color="inherit" variant="subtitle1" component="div" fontWeight={600}>
            {numSelected} selected
          </Typography>
        ) : (
          <Box sx={{ flex: '1 1 100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 2, flexWrap: 'wrap' }}>
            <Typography variant="h6" id="tableTitle" component="div" fontWeight={700}>
              {title}
            </Typography>

            <Stack direction="row" spacing={2} sx={{ flexGrow: 1, justifyContent: 'flex-end', alignItems: 'center' }}>
              <TextField
                size="small"
                placeholder="Search..."
                value={searchTerm}
                onChange={handleSearchChange}
                sx={{ width: { xs: '100%', sm: 300 } }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon fontSize="small" />
                    </InputAdornment>
                  ),
                }}
              />

              {onAdd && (
                <Button
                  variant="contained"
                  startIcon={<AddIcon />}
                  onClick={onAdd}
                  sx={{ borderRadius: 2, px: 3, py: 1, textTransform: 'none', fontWeight: 600 }}
                >
                  {addButtonLabel}
                </Button>
              )}
            </Stack>
          </Box>
        )}

        {numSelected > 0 && (
          <Box sx={{ display: 'flex', gap: 1 }}>
            {onBulkEdit && (
              <Tooltip title="Edit Selected">
                <IconButton onClick={() => onBulkEdit(selected)}>
                  <EditIcon color="primary" />
                </IconButton>
              </Tooltip>
            )}
            {onBulkDelete && (
              <Tooltip title="Delete Selected">
                <IconButton onClick={handleBulkDelete}>
                  <DeleteIcon color="error" />
                </IconButton>
              </Tooltip>
            )}
          </Box>
        )}
      </Toolbar>

      <TableContainer>
        <Table sx={{ minWidth: 750 }} aria-labelledby="tableTitle" size="medium">
          <TableHead sx={{ bgcolor: 'background.default' }}>
            <TableRow>
              <TableCell padding="checkbox">
                <Checkbox
                  color="primary"
                  indeterminate={numSelected > 0 && numSelected < data.length}
                  checked={data.length > 0 && numSelected === data.length}
                  onChange={handleSelectAllClick}
                  inputProps={{ 'aria-label': 'select all' }}
                />
              </TableCell>
              {columns.map((column) => (
                <TableCell
                  key={column.id}
                  align={column.align || 'left'}
                  padding="normal"
                  sx={{ fontWeight: 700, color: 'text.secondary', textTransform: 'uppercase', fontSize: 12, py: 2 }}
                >
                  {column.label}
                </TableCell>
              ))}
              <TableCell align="right" sx={{ fontWeight: 700, color: 'text.secondary', py: 2 }}>
                ACTIONS
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {isLoading ? (
              [...Array(5)].map((_, index) => (
                  <TableRow key={index}>
                    <TableCell padding="checkbox" sx={{ pl: 2 }}>
                      <Skeleton variant="rectangular" width={20} height={20} />
                    </TableCell>
                    {columns.map((col, i) => (
                      <TableCell key={i} sx={{ pl: 5 }}>
                        <Skeleton variant="text" width="80%" />
                      </TableCell>
                    ))}
                    <TableCell align="right" sx={{ pr: 2 }}>
                      <Skeleton variant="circular" width={30} height={30} sx={{ ml: 'auto' }} />
                    </TableCell>
                  </TableRow>
              ))
            ) : data.length === 0 ? (
              <TableRow>
                <TableCell colSpan={columns.length + 2} align="center" sx={{ py: 10 }}>
                  <Typography variant="body1" color="text.secondary">No records found</Typography>
                </TableCell>
              </TableRow>
            ) : (
              data.map((row, index) => {
                const rowId = getRowId(row);
                const isItemSelected = isSelected(rowId);
                const labelId = `enhanced-table-checkbox-${index}`;

                return (
                  <TableRow
                    hover
                    onClick={(event) => handleClick(event, rowId)}
                    role="checkbox"
                    aria-checked={isItemSelected}
                    tabIndex={-1}
                    key={rowId}
                    selected={isItemSelected}
                    sx={{ cursor: 'pointer', '&:selected': { bgcolor: 'primary.lighter' } }}
                  >
                    <TableCell padding="checkbox">
                      <Checkbox
                        color="primary"
                        checked={isItemSelected}
                        inputProps={{ 'aria-labelledby': labelId }}
                      />
                    </TableCell>
                    {columns.map((column) => {
                      const value = row[column.id];
                      return (
                        <TableCell key={column.id} align={column.align || 'left'} sx={{ py: 2 }}>
                          {column.format ? column.format(value, row) : value}
                        </TableCell>
                      );
                    })}
                    <TableCell align="right" sx={{ py: 2 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
                        <Tooltip title="Edit">
                          <IconButton
                            size="small"
                            onClick={(e) => { e.stopPropagation(); onEdit?.(row); }}
                            sx={{ bgcolor: 'primary.lighter', color: 'primary.main', '&:hover': { bgcolor: 'primary.light', color: 'white' } }}
                          >
                            <EditIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete">
                          <IconButton
                            size="small"
                            onClick={(e) => { e.stopPropagation(); onDelete?.(row); }}
                            sx={{ bgcolor: 'error.lighter', color: 'error.main', '&:hover': { bgcolor: 'error.light', color: 'white' } }}
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={totalCount}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={(_, newPage) => onPageChange(newPage)}
        onRowsPerPageChange={(event) => onRowsPerPageChange(parseInt(event.target.value, 10))}
        sx={{ borderTop: '1px solid', borderColor: 'divider' }}
      />
    </Paper>
  );
}
