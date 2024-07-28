
// import React, { useState, useEffect } from 'react';
// import TableCell from '@mui/material/TableCell';
// import TableRow from '@mui/material/TableRow';
// import IconButton from '@mui/material/IconButton';
// import EditIcon from '@mui/icons-material/Edit';
// import SaveIcon from '@mui/icons-material/Save';
// import TextField from '@mui/material/TextField';
// import Select from '@mui/material/Select';
// import MenuItem from '@mui/material/MenuItem';
// import axios from 'axios';


// const EditableRow = ({ row, columns, groups, statuses, onUpdate/*, updateRequest */ }) => {
//   const [isEditing, setIsEditing] = useState(false);
//   const [rowData, setRowData] = useState(row);
//   const [editCell, setEditCell] = useState(null);

//   useEffect(() => {
//     setRowData(row);
//   }, [row]);


//   const handleToggleEdit = async () => {
//     setIsEditing(!isEditing);
//     if (isEditing) {
//       console.log('Updated Row Data:', rowData); // Debugging Line
//       try {
//         const response = await axios.put(`http://localhost:3001/api/requests/${rowData.ID}`, rowData); // Updated URL to match the Postman example
//         onUpdate(response.data);
//       } catch (err) {
//         console.error('Error updating request:', err);
//       }
//     }
//   };

//   const handleDoubleClick = (columnId) => {
//     if (isEditing) {
//       setEditCell(columnId);
//     }
//   };

//   const handleChange = (e, columnId) => {
//     setRowData({ ...rowData, [columnId]: e.target.value });
//   };

//   const handleBlur = () => {
//     setEditCell(null);
//   };


//   return (
//     <TableRow hover role="checkbox" tabIndex={-1}>
//       <TableCell>
//         <IconButton onClick={handleToggleEdit} color={isEditing ? "primary" : "default"}>
//           {isEditing ? <SaveIcon /> : <EditIcon />}
//         </IconButton>
//       </TableCell>
//       {columns.map(column => (
//         <TableCell
//           key={column.id}
//           onDoubleClick={() => handleDoubleClick(column.id)}
//         >
//           {editCell === column.id ? (
//             <TextField
//               value={rowData[column.id]}
//               onChange={(e) => handleChange(e, column.id)}
//               onBlur={handleBlur}
//               autoFocus
//             />
//           ) : (
//             rowData[column.id]
//           )}
//         </TableCell>
//       ))}
//       {groups.map(group => (
//         <TableCell key={group.id}>
//           {isEditing ? (
//             <Select
//               value={rowData[group.id] || ''}
//               onChange={(e) => handleChange(e, group.id)}
//             >
//               {statuses.map(status => (
//                 <MenuItem key={status} value={status}>
//                   {status}
//                 </MenuItem>
//               ))}
//             </Select>
//           ) : (
//             rowData[group.id] || 'Not Required'
//           )}
//         </TableCell>
//       ))}
//     </TableRow>
//   );
// };

// export default EditableRow;
import React, { useState, useEffect } from 'react';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import IconButton from '@mui/material/IconButton';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import TextField from '@mui/material/TextField';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import axios from 'axios';

const EditableRow = ({ row, columns, groups, statuses, onUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [rowData, setRowData] = useState(row);
  const [editCell, setEditCell] = useState(null);

  useEffect(() => {
    setRowData(row);
  }, [row]);

  const handleToggleEdit = async () => {
    setIsEditing(!isEditing);
    if (isEditing) {
      console.log('Updated Row Data:', rowData);
      try {
        const response = await axios.put(`http://localhost:3001/api/requests/${rowData.ID}`, rowData);
        onUpdate(response.data);
      } catch (err) {
        console.error('Error updating request:', err);
      }
    }
  };

  const handleDoubleClick = (columnId) => {
    if (isEditing) {
      setEditCell(columnId);
    }
  };

  const handleChange = (e, columnId) => {
    setRowData({ ...rowData, [columnId]: e.target.value });
  };

  const handleBlur = () => {
    setEditCell(null);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Pending Response':
        return 'yellow';
      case 'Not Required':
        return 'gray';
      case 'In Q':
        return 'green';
      case 'Not in Q':
        return 'red';
      default:
        return 'transparent';
    }
  };

  return (
    <TableRow hover role="checkbox" tabIndex={-1}>
      <TableCell>
        <IconButton onClick={handleToggleEdit} color={isEditing ? "primary" : "default"}>
          {isEditing ? <SaveIcon /> : <EditIcon />}
        </IconButton>
      </TableCell>
      {columns.map(column => (
        <TableCell
          key={column.id}
          onDoubleClick={() => handleDoubleClick(column.id)}
        >
          {editCell === column.id ? (
            <TextField
              value={rowData[column.id]}
              onChange={(e) => handleChange(e, column.id)}
              onBlur={handleBlur}
              autoFocus
            />
          ) : (
            rowData[column.id]
          )}
        </TableCell>
      ))}
      {groups.map(group => (
        <TableCell
          key={group.id}
          style={{ backgroundColor: getStatusColor(rowData[group.id]) }}
        >
          {isEditing ? (
            <Select
              value={rowData[group.id] || ''}
              onChange={(e) => handleChange(e, group.id)}
            >
              {statuses.map(status => (
                <MenuItem key={status} value={status}>
                  {status}
                </MenuItem>
              ))}
            </Select>
          ) : (
            rowData[group.id] || 'Not Required'
          )}
        </TableCell>
      ))}
    </TableRow>
  );
};

export default EditableRow;
