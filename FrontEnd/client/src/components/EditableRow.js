// EditableRow.js
import React, { useState } from 'react';
import { TableRow, TableCell, IconButton, TextField } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import axios from 'axios';

const EditableRow = ({ row, columns, onSave }) => {
    console.log("EditableRow row:", row); // הוסף את השורה הזו לבדוק את ה-row המתקבל
    const [isEditing, setIsEditing] = useState(false);
    const [editData, setEditData] = useState(row);

    const handleToggleEdit = async () => {
        if (isEditing) {
            try {
                console.log("Row ID:", row.id); // הוסף את השורה הזו לבדוק אם ה-ID קיים
                console.log("Updating row with ID:", editData.id); // הוסף את השורה הזו לבדוק את ה-ID המועבר
                console.log('EditableRow row:', editData);
                await axios.put(`http://localhost:3001/api/requests/${editData.ID}`, {
                    title: editData.title,
                    description: editData.description,
                    comments: editData.comments
                });
                onSave(editData);
            } catch (error) {
                console.error('Error updating row:', error);
            }
        }
        setIsEditing(!isEditing);
    };




    const handleChange = (columnId, value) => {
        setEditData(prev => ({ ...prev, [columnId]: value }));
    };


    return (
        <TableRow>
            <TableCell>
                <IconButton onClick={handleToggleEdit}>
                    {isEditing ? <SaveIcon /> : <EditIcon />}
                </IconButton>
            </TableCell>
            {columns.slice(1).map((column) => (
                <TableCell key={column.id} onDoubleClick={() => setIsEditing(true)}>
                    {isEditing ? (
                        <TextField
                            value={editData[column.id] || ''}
                            onChange={(e) => setEditData({ ...editData, [column.id]: e.target.value })}
                        />
                    ) : (
                        row[column.id]
                    )}
                </TableCell>
            ))}
        </TableRow>
    );
};

export default EditableRow;
