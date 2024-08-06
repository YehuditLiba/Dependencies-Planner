// EditableRow.js
import React, { useEffect, useState } from 'react';
import { TableRow, TableCell, IconButton, TextField } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import axios from 'axios';
import DeleteRequest from './DeleteRequest'; // Add this line
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import { priorityMap } from '../utils/utils';



const EditableRow = ({ row, columns, onSave, emailRequestor,
    handleDeleteRequest, formatDate, showGroupColumns, groups,
    getStatusBackgroundColor, getGroupStatus, handleStatusChange,
    rowIndex, onDrop
}) => {
    console.log("EditableRow row:", row); // הוסף את השורה הזו לבדוק את ה-row המתקבל
    const [isEditing, setIsEditing] = useState(false);
    const [editData, setEditData] = useState(row);
    const [statuses, setStatuses] = useState([]);
    const [priorities, setPriorities] = useState([]);

    useEffect(() => {
        setEditData(row);
    }, [row]);


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

        const fetchPriorities = async () => {
            try {
                const response = await axios.get('http://localhost:3001/api/priority');
                setPriorities(response.data);
            } catch (err) {
                console.error('Error fetching priorities:', err);
            }
        };

        fetchStatuses()
        fetchPriorities();
    }, [])

    const handleToggleEdit = async () => {
        if (isEditing) {
            console.log('Updated Row Data:', editData); // Debugging Line
            try {
                // אם העדכון הוא עבור priority
                if (editData.priority !== row.priority) {
                    const response = await axios.put(`http://localhost:3001/api/requests/${editData.ID}/priority`, { priority: priorityMap[editData.priority] });
                    onSave(response.data);
                } else {
                    const response = await axios.put(`http://localhost:3001/api/requests/${editData.ID}`,{
                        title: editData.title,
                        description: editData.description,
                        comments: editData.comments
                        } ); // Updated URL to match the Postman example
                    onSave(response.data);
                }
            } catch (error) {
                console.error('Error updating row:', error);
            }
        }
        setIsEditing(!isEditing);
    };

    const onDragStart = (e, rowIndex) => {
        e.dataTransfer.setData('rowIndex', rowIndex);
    };

    const onDragOver = (e) => {
        e.preventDefault();
    };

    const handleChange = (e, columnId) => {
        setEditData({ ...editData, [columnId]: e.target.value });
    };


    return (
        <TableRow
            hover
            role="checkbox"
            tabIndex={-1}
            draggable
            onDragStart={(e) => onDragStart(e, rowIndex)}
            onDragOver={onDragOver}
            onDrop={(e) => onDrop(e, rowIndex)}>
            <TableCell>
                <DeleteRequest id={row.ID} emailRequestor={emailRequestor} onDelete={handleDeleteRequest} />
                <IconButton onClick={handleToggleEdit}>
                    {isEditing ? <SaveIcon /> : <EditIcon />}
                </IconButton>
            </TableCell>
            {columns.slice(1).map((column) => (
                <TableCell key={column.id} style={{ minWidth: column.minWidth }}>
                    {isEditing ? (
                        column.id === 'title' || column.id === 'description' || column.id === 'comments' ? (
                            <TextField
                                value={editData[column.id] || ''}
                                onChange={(e) => setEditData({ ...editData, [column.id]: e.target.value })}
                            />
                        ) : column.id === 'priority' ? (
                            <Select
                                value={editData[column.id] || ''}
                                onChange={(e) => handleChange(e, column.id)}
                                // onBlur={handleBlur}
                                autoFocus
                            >
                                {priorities.map(priority => (
                                    <MenuItem key={priority.id} value={priority.id}>
                                        {priorityMap[priority.id]}
                                    </MenuItem>
                                ))}
                            </Select>
                        ) : column.id === 'dateTime' ? (
                            formatDate(row[column.id])
                        ) : row[column.id]
                    ) : column.id === 'dateTime' ? (
                        formatDate(row[column.id])
                    ) : column.id === 'priority' ? (
                        priorityMap[editData[column.id]] || editData[column.id]
                    ) : (
                        row[column.id]
                    )}
                </TableCell>
            ))}
            {groups.map((group) => {
                console.log(row.statuses.find(status => status.groupId === group.id))
                const status = row.statuses.find(status => status.groupId === group.id);
                const statusDescription = status ? status.status.status : 'Not Required';
                // הגדרת סגנון התא
                let cellStyle = {};
                if (statusDescription === 'Not Required') {
                    cellStyle = { color: 'gray' }; // צבע אפור ל-'Not Required'
                }
                return (
                    <TableCell
                        key={group.id}
                        style={{ backgroundColor: getStatusBackgroundColor(getGroupStatus(row, group.id)), ...cellStyle }}
                    >
                        {/* {isEditing ? (
                            <Select
                                value={statusDescription}
                                onChange={(e) => setEditData({ ...editData, [group.id]: e.target.value })}
                            >
                                {statuses.map(status => (
                                    <MenuItem key={status.id} value={status.status}>
                                        {status.status}
                                    </MenuItem>
                                ))}
                            </Select>
                        ) : (
                            statusDescription
                        )} */}
            {statusDescription}
                    </TableCell>
                );
            })}
        </TableRow>
    );
};

export default EditableRow;
