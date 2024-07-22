import React, { useState } from 'react';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableSortLabel from '@mui/material/TableSortLabel';
import IconButton from '@mui/material/IconButton';
import EditIcon from '@mui/icons-material/Edit';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import EditableTableHeader from './EditableTableHeader';
import EditPopup from './EditPopup'; // נניח שהפופאפ לעריכה נמצא באותה תיקייה

const columns = [
  { id: 'title', label: 'Title', minWidth: 100 },
  { id: 'requestorName', label: 'Requestor Name', minWidth: 100 },
  // המשך...
];

export default function MainTable() {
  const [rows, setRows] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [editingColumn, setEditingColumn] = useState(null);
  const [editPopupOpen, setEditPopupOpen] = useState(false);
  const [newLabel, setNewLabel] = useState('');

  const handleEditClick = (columnId) => {
    const column = columns.find(col => col.id === columnId);
    setEditingColumn(column);
    setNewLabel(column.label);
    setEditPopupOpen(true);
  };

  const handleSave = (newLabel) => {
    const newColumns = columns.map(col => col.id === editingColumn.id ? { ...col, label: newLabel } : col);
    setColumns(newColumns);
  };

  return (
    <Paper sx={{ width: '100%', overflow: 'hidden' }}>
      <TableContainer sx={{ maxHeight: 440 }}>
        <Table stickyHeader aria-label="sticky table">
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <EditableTableHeader key={column.id} column={column} onEditClick={handleEditClick} />
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {/* הצגת השורות */}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[10, 25, 100]}
        component="div"
        count={rows.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={(event, newPage) => setPage(newPage)}
        onRowsPerPageChange={(event) => setRowsPerPage(+event.target.value)}
      />
      <EditPopup 
        open={editPopupOpen} 
        handleClose={() => setEditPopupOpen(false)} 
        value={newLabel} 
        onSave={handleSave} 
      />
    </Paper>
  );
}

export default EditableTableHeader;
