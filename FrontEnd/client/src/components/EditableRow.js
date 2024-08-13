import React, { useEffect, useState } from 'react';
import { TableRow, TableCell, IconButton, TextField } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import axios from 'axios';
import DeleteRequest from './DeleteRequest';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import { priorityMap, finalDecisionMap } from '../utils/utils';
import { quarters } from '../config/quarters';

const EditableRow = ({ row, columns, onSave, emailRequestor,handleDeleteRequest
  , formatDate, showGroupColumns, groups, getStatusBackgroundColor, rowIndex, onDrop }) => {
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

    fetchStatuses();
    fetchPriorities();
  }, []);

  const handleToggleEdit = async () => {
    if (isEditing) {
        console.log('Updated Row Data:', editData); // שורת בדיקה
        try {
            if (editData.priority !== row.priority) {
                const response = await axios.put(`http://localhost:3001/api/requests/${editData.ID}/priority`, { priority: priorityMap[editData.priority] });
                onSave(response.data);
            }
            if (editData.finalDecision !== row.finalDecision) {
                const response = await axios.put(`http://localhost:3001/api/requests/updateFinalDecision/${editData.ID}`, { finalDecision: editData.finalDecision });
                onSave(response.data);
            }
            if (editData.planned !== row.planned) {
                const response = await axios.put(`http://localhost:3001/api/requests/${editData.ID}/planned`, { planned: editData.planned });
                onSave(response.data);
            }
            const response = await axios.put(`http://localhost:3001/api/requests/${editData.ID}`, {
                title: editData.title,
                description: editData.description,
                comments: editData.comments
            });
            onSave(response.data);
            //}
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

  const handleStatusChange = (e, groupId) => {
    const updatedStatuses = (editData.statuses || []).map(status =>
        status.groupId === groupId ? { ...status, status: statuses.find(s => s.status === e.target.value) } : status
    );
    setEditData({ ...editData, statuses: updatedStatuses });
    console.log('Updated statuses:', updatedStatuses); // שורת בדיקה
};

const getBackgroundColor = (value) => {
    if (value === 'true') return 'lightgreen';
    if (value === 'false') return 'lightcoral';
    return 'inherit';
};

const getPriorityBackgroundColor = (priority) => {
    switch (priority) {
        case 'Critical':
            return '#FFCCCB';
        case 'High':
            return '#FFDAB9';
        case 'Medium':
            return 'lemonchiffon';
        case 'Low':
            return '#E0FFE0';
        default:
            return null;
    }
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
      <DeleteRequest id={row.ID} email={emailRequestor} handleDeleteRequest={handleDeleteRequest} />
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
                  ) : column.id === 'planned' ?
                      (
                          <Select
                              value={editData[column.id] || ''}
                              onChange={(e) => handleChange(e, column.id)}
                              // onBlur={handleBlur}
                              autoFocus
                          >
                              {quarters.map((quarter, index) => (
                                  <MenuItem key={index} value={quarter}>
                                      {quarter}
                                  </MenuItem>
                              ))}
                          </Select>
                      ) : column.id === 'finalDecision' ?
                          (
                              <Select
                                  value={editData[column.id] !== undefined ? String(editData[column.id]) : ''}
                                  onChange={(e) => handleChange(e, column.id)}
                                  // onBlur={handleBlur}
                                  autoFocus
                              >
                                  {Object.entries(finalDecisionMap).map(([key, finalDecision]) => (
                                      <MenuItem
                                          key={key}
                                          value={key}
                                      >
                                          {finalDecision}
                                      </MenuItem>
                                  ))}
                              </Select>
                          ) : column.id === 'dateTime' ? (
                              formatDate(row[column.id])
                          ) : column.id === 'finalDecision' ? (
                              finalDecisionMap[editData[column.id]] || editData[column.id]
                          ) : (
                              row[column.id]
                          )
              ) : column.id === 'dateTime' ? (
                  formatDate(row[column.id])
              ) : column.id === 'priority' ? (
                  <span style={{
                      backgroundColor: getPriorityBackgroundColor(priorityMap[editData[column.id]] || editData[column.id]),
                      padding: '0 4px' // מעט padding כדי שהרקע יראה טוב יותר
                  }}>
                      {priorityMap[editData[column.id]] || editData[column.id]}
                  </span>
              ) : column.id === 'finalDecision' ? (
                  <span style={{
                      backgroundColor: editData[column.id] === true ? 'lightgreen' : editData[column.id] === false ? 'lightcoral' : null,
                      padding: '0 4px' // מעט padding כדי שהרקע יראה טוב יותר
                  }}>
                      {finalDecisionMap[editData[column.id]] || editData[column.id]}
                  </span>
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
              showGroupColumns ? (
                  <TableCell
                      key={group.id}
                  // style={{ backgroundColor: getStatusBackgroundColor(statusDescription), ...cellStyle }}
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
                          <span style={{
                              backgroundColor: getStatusBackgroundColor(statusDescription), ...cellStyle,
                              padding: '0 4px' // מעט padding כדי שהרקע יראה טוב יותר
                          }}>
                              {statusDescription}
                          </span>
                          // 
                      )}
                  </TableCell>
              ) : null
          );
      })}
  </TableRow>
);
};

export default EditableRow;

