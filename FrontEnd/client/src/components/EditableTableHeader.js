// EditableTableHeader.js
import React from 'react';
import TableCell from '@mui/material/TableCell';
import TableSortLabel from '@mui/material/TableSortLabel';
import IconButton from '@mui/material/IconButton';
import EditIcon from '@mui/icons-material/Edit';

function EditableTableHeader({ column, onEditClick }) {
  return (
    <TableCell
      key={column.id}
      align={column.align || 'left'}
      style={{ minWidth: column.minWidth }}
    >
      <TableSortLabel>
        {column.label}
        <IconButton onClick={() => onEditClick(column.id)} size="small">
          <EditIcon fontSize="small" />
        </IconButton>
      </TableSortLabel>
    </TableCell>
  );
}

export default EditableTableHeader;
