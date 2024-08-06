import React, { useEffect, useState } from 'react';
import { TableRow, TableCell, IconButton, TextField } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import axios from 'axios';
import DeleteRequest from './DeleteRequest';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import { priorityMap } from '../utils/utils';

const EditableRow = ({ row, columns, onSave, emailRequestor, handleDeleteRequest, formatDate, showGroupColumns, groups, getStatusBackgroundColor, rowIndex, onDrop }) => {
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
                setStatuses(response.data);
                console.log('Fetched statuses:', response.data); // לוג כאן
            } catch (error) {
                console.error('Failed to fetch statuses', error);
            }
        };

        const fetchPriorities = async () => {
            try {
                const response = await axios.get('http://localhost:3001/api/priority');
                setPriorities(response.data);
                console.log('Fetched priorities:', response.data); // לוג כאן
            } catch (err) {
                console.error('Error fetching priorities:', err);
            }
        };

        fetchStatuses();
        fetchPriorities();
    }, []);

    const handleToggleEdit = async () => {
        if (isEditing) {
            try {
                const updateData = {
                    title: editData.title,
                    description: editData.description,
                    comments: editData.comments,
                    priority: editData.priority,
                    statuses: editData.statuses.map(status => ({
                        groupId: status.groupId,
                        status: status.status.id // נשלח את הסטטוס לפי ה-ID שלו
                    }))
                };
    
                console.log('Sending updateData:', updateData); // לוג כאן
    
                const response = await axios.put(`http://localhost:3001/api/requests/${editData.ID}`, updateData);
                console.log('Received response:', response.data); // לוג כאן
                onSave(response.data);
                console.log('Row updated in table:', response.data); // לוג נוסף כאן
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

    const getGroupStatus = (row, groupId) => {
        if (!row.statuses) {
            return 'Not Required';
        }
        const status = row.statuses.find(status => status.groupId === groupId);
        return status ? status.status.status : 'Not Required';
    };

    const handleStatusChange = (e, groupId) => {
        const updatedStatuses = (editData.statuses || []).map(status =>
            status.groupId === groupId ? { ...status, status: statuses.find(s => s.status === e.target.value) } : status
        );
        setEditData({ ...editData, statuses: updatedStatuses });
        console.log('Updated statuses:', updatedStatuses); // לוג כאן
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
                const status = (editData.statuses || []).find(status => status.groupId === group.id);
                const statusDescription = status ? status.status.status : 'Not Required';
                     let cellStyle = {};
                if (statusDescription === 'Not Required') {
                    cellStyle = { color: 'gray' };
                }
                return (
                    <TableCell
                        key={group.id}
                        style={{ backgroundColor: getStatusBackgroundColor(statusDescription), ...cellStyle }}
                    >
                        {isEditing ? (
                            <Select
                                value={statusDescription}
                                onChange={(e) => handleStatusChange(e, group.id)}
                                disabled={statusDescription === 'Not Required'}
                            >
                                {statuses.map(status => (
                                    <MenuItem key={status.id} value={status.status}>
                                        {status.status}
                                    </MenuItem>
                                ))}
                            </Select>
                        ) : (
                            statusDescription
                        )}
                    </TableCell>
                );
            })}
        </TableRow>
    );
};

export default EditableRow;
