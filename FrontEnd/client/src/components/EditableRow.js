// EditableRow.js
import React, { useEffect, useState } from 'react';
import { TableRow, TableCell, IconButton, TextField } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import axios from 'axios';
import DeleteRequest from './DeleteRequest'; // Add this line
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';




const EditableRow = ({ row, columns, onSave, emailRequestor,
    handleDeleteRequest, formatDate, showGroupColumns, groups,
    getStatusBackgroundColor, getGroupStatus, handleStatusChange
}) => {
    console.log("EditableRow row:", row); // הוסף את השורה הזו לבדוק את ה-row המתקבל
    const [isEditing, setIsEditing] = useState(false);
    const [editData, setEditData] = useState(row);
    const [statuses, setStatuses] = useState([]);


    useEffect(() => {
        const fetchStatuses = async () => {
            try {
                const response = await axios.get('http://localhost:3001/api/status');
                console.log('Statuses fetched from server:', response.data);
                console.log('statuses:', statuses)
                setStatuses(response.data);
                console.log('statuses:', statuses)
            } catch (error) {
                console.error('Failed to fetch statuses', error);
            }
        };
        fetchStatuses()
    }, [])

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
        <TableRow hover role="checkbox" tabIndex={-1}>
            <TableCell>
                <DeleteRequest id={row.ID} emailRequestor={emailRequestor} onDelete={handleDeleteRequest} />
                <IconButton onClick={handleToggleEdit}>
                    {isEditing ? <SaveIcon /> : <EditIcon />}
                </IconButton>
            </TableCell>
            {columns.slice(1).map((column) => (
                <TableCell key={column.id} style={{ minWidth: column.minWidth }}>
                    {isEditing ? (
                        <TextField
                            value={editData[column.id] || ''}
                            onChange={(e) => setEditData({ ...editData, [column.id]: e.target.value })}
                        />
                    ) : (
                        // column.id === 'requestGroup' && !showGroupColumns ? null : (
                        column.id === 'dateTime' ? formatDate(row[column.id]) : row[column.id]
                        // )
                    )}
                </TableCell>
            ))}
            {groups.map((group) => {
                const status = row.statuses.find(status => status.groupId === group.id);
                const statusDescription = status ? status.status.status : 'Not Required';
                // הגדרת סגנון התא
                let cellStyle = {};
                if (statusDescription === 'Not Required') {
                    cellStyle = { color: 'gray' }; // צבע אפור ל-'Not Required'
                }
                return showGroupColumns ? (
                    
                    <Select
                        key={group.id}
                        value={statusDescription}
                        onChange={(e) => setEditData({ ...editData, [group.id]: e.target.value })}
                    >
                        {/* console.warn([`MUI: You have provided an out-of-range value \`${value}\` for the select ${name ? `(name="${name}") ` : ''}component.`, "Consider providing a value that matches one of the available options or ''.", `The available values are ${values.filter(x => x != null).map(x => `\`${x}\``).join(', ') || '""'}.`].join('\n')); */}
                        {console.log('statuses:', statuses)}
                        {statuses.map(status => (
                            <MenuItem key={status.id} value={status.status}>
                                {status.status}
                            </MenuItem>
                        ))}
                    </Select>
                ) : showGroupColumns ? (
                    <TableCell
                        key={group.id}
                        style={{ backgroundColor: getStatusBackgroundColor(getGroupStatus(row, group.id)), ...cellStyle }}
                    // onClick={() => handleStatusChange(row.id, group.id, 'newStatus')}
                    >
                        {statusDescription}
                    </TableCell>
                ) : null;
            })}
        </TableRow>
    );
};

export default EditableRow;
