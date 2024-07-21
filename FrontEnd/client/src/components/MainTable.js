import * as React from 'react';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import Button from '@mui/material/Button';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';

import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Checkbox from '@mui/material/Checkbox';

import TextField from '@mui/material/TextField';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';

import axios from 'axios';
import RequestForm from './RequestForm';
import EditableTableHeader from './EditableTableHeader';

const columns = [
  { id: 'title', label: 'Title', minWidth: 100 },
  { id: 'requestorName', label: 'Requestor Name', minWidth: 100 },
  { id: 'requestGroup', label: 'Request Group', minWidth: 100 },
  { id: 'description', label: 'Description', minWidth: 150 },
  { id: 'priority', label: 'Priority', minWidth: 70 },
  { id: 'finalDecision', label: 'Final Decision', minWidth: 100 },
  { id: 'planned', label: 'Planned', minWidth: 100 },
  { id: 'comments', label: 'Comments', minWidth: 100 },
  { id: 'jiraLink', label: 'Jira Link', minWidth: 150 },
  { id: 'dateTime', label: 'DateTime', minWidth: 150 }
];

const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

const stylePending = {
  display: 'inline-block',
  backgroundColor: 'rgba(255, 165, 0, 0.1)',
  borderRadius: '4px',
  padding: '2px 6px',
};

const styleNotRequired = {
  display: 'inline-block',
  backgroundColor: 'rgba(128, 128, 128, 0.1)',
  borderRadius: '4px',
  padding: '2px 6px',
};

export default function MainTable() {
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(4);
  const [rows, setRows] = React.useState([]);
  const [totalRows, setTotalRows] = React.useState(0);
  const [groups, setGroups] = React.useState([]);

  const [managers, setManagers] = React.useState([]);
  const [affectedGroups, setAffectedGroups] = React.useState([]);
  const [showGroupColumns, setShowGroupColumns] = React.useState(true);
  const [open, setOpen] = React.useState(false);
  const [anchorElGroup, setAnchorElGroup] = React.useState(null);
  const [anchorElManager, setAnchorElManager] = React.useState(null);
  const [anchorElAffectedGroup, setAnchorElAffectedGroup] = React.useState(null);
  const [selectedGroup, setSelectedGroup] = React.useState('');
  const [selectedManager, setSelectedManager] = React.useState('');
  const [selectedAffectedGroups, setSelectedAffectedGroups] = React.useState([]);

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:3001/api/requests', {
          params: {
            limit: rowsPerPage === -1 ? undefined : rowsPerPage,
            offset: rowsPerPage === -1 ? 0 : page * rowsPerPage,
            requestorGroup: selectedGroup || undefined,
            requestorName: selectedManager || undefined,
            affectedGroupList: selectedAffectedGroups.join(',') || undefined
          }
        });
        setRows(response.data.requests);
        setTotalRows(response.data.totalCount || 0);
      } catch (error) {
        console.error("Failed to fetch data", error);
      }
    };

  const [statuses, setStatuses] = React.useState([]);
  const [showGroupColumns, setShowGroupColumns] = React.useState(true);
  const [open, setOpen] = React.useState(false);
  const [editOpen, setEditOpen] = React.useState(false);
  const [editValue, setEditValue] = React.useState('');
  const [editColumn, setEditColumn] = React.useState('');
  const [editRowId, setEditRowId] = React.useState(null);

  React.useEffect(() => {
    fetchData();
    fetchGroups();
    fetchStatuses();
  }, [page, rowsPerPage]);


    const fetchGroups = async () => {
      try {
        const response = await axios.get('http://localhost:3001/api/groups');
        setGroups(response.data);
      } catch (error) {
        console.error("Failed to fetch groups", error);
      }
    };

    const fetchManagers = async () => {
      try {
        const response = await axios.get('http://localhost:3001/api/productManagers');
        setManagers(response.data);
      } catch (error) {
        console.error("Failed to fetch product managers", error);
      }
    };

    fetchData();
    fetchGroups();
    fetchManagers();
  }, [page, rowsPerPage, selectedGroup, selectedManager, selectedAffectedGroups]);

  const fetchStatuses = async () => {
    try {
      const response = await axios.get('http://localhost:3001/api/status');
      setStatuses(response.data);
    } catch (error) {
      console.error("Failed to fetch statuses", error);
    }
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    const value = event.target.value;
    setRowsPerPage(value === 'all' ? -1 : +value);
    setPage(0);
  };

  const handleToggleColumns = () => {
    setShowGroupColumns(!showGroupColumns);
  };


  const handleOpenMenu = (event, type) => {
    if (type === 'group') {
      setAnchorElGroup(event.currentTarget);
    } else if (type === 'manager') {
      setAnchorElManager(event.currentTarget);
    } else if (type === 'affectedGroup') {
      setAnchorElAffectedGroup(event.currentTarget);
    }
  };

  const handleCloseMenu = (type) => {
    if (type === 'group') {
      setAnchorElGroup(null);
    } else if (type === 'manager') {
      setAnchorElManager(null);
    } else if (type === 'affectedGroup') {
      setAnchorElAffectedGroup(null);
    }
  };

  const handleGroupSelect = (group) => {
    setSelectedGroup(group.id || '');
    handleCloseMenu('group');
  };

  const handleManagerSelect = (manager) => {
    setSelectedManager(manager.name || '');
    handleCloseMenu('manager');
  };

  const handleAffectedGroupSelect = (groupId) => {
    setSelectedAffectedGroups((prev) =>
      prev.includes(groupId) ? prev.filter(id => id !== groupId) : [...prev, groupId]
    );
  };

  const applyFilter = async () => {
    try {
      const response = await axios.get('http://localhost:3001/api/requests', {
        params: {
          affectedGroupList: selectedAffectedGroups.join(','),
          // הוסף כאן פרמטרים נוספים אם נדרשים
        }
      });
      setRows(response.data.requests);
      setTotalRows(response.data.totalCount || 0);
    } catch (error) {
      console.error("Failed to apply filter", error);
    }
    handleCloseMenu('affectedGroup');

  const handleEditClick = (columnId) => {
    setEditColumn(columnId);
  };

  const handleCellDoubleClick = (rowId, columnId) => {
    const row = rows.find((r) => r.ID === rowId);
    const value = row[columnId];
    setEditValue(Array.isArray(value) ? value.join(', ') : value);
    setEditRowId(rowId);
    setEditOpen(true);
  };

  const handleEditSave = async (newValue) => {
    const updatedRows = rows.map((row) => {
      if (row.ID === editRowId) {
        return { ...row, [editColumn]: newValue };
      }
      return row;
    });
    setRows(updatedRows);
    setEditOpen(false);

    // Save to the database
    try {
      await axios.put(`http://localhost:3001/api/requests/${editRowId}`, { [editColumn]: newValue });
    } catch (error) {
      console.error("Failed to save data", error);
    }
  };

  const handleStatusChange = async (rowId, columnId, newValue) => {
    const updatedRows = rows.map((row) => {
      if (row.ID === rowId) {
        return { ...row, [columnId]: newValue };
      }
      return row;
    });
    setRows(updatedRows);

    // Save to the database
    try {
      await axios.put(`http://localhost:3001/api/requests/${rowId}`, { [columnId]: newValue });

      // Update affected group status
      const groupId = columnId.split('_')[1];
      await axios.put(`http://localhost:3001/api/affectedGroups/${groupId}`, { status: newValue });
    } catch (error) {
      console.error("Failed to save data", error);
    }
  };

  const allColumns = [
    ...columns,
    ...groups.map(group => ({
      id: `group_${group.id}`,
      label: group.name,
      minWidth: 100
    }))
  ];

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return `${String(date.getDate()).padStart(2, '0')}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getFullYear()).slice(-2)}`;

  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: 4 }}>
      <Paper sx={{ width: '80%', padding: 2 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Button variant="contained" color="primary" onClick={() => setOpen(true)}>
            הוספת בקשה
          </Button>
          <Button variant="contained" onClick={handleToggleColumns}>
            {showGroupColumns ? 'צמצם עמודות' : 'הרחב עמודות'}
          </Button>
          <Button
            variant="contained"
            onClick={(event) => handleOpenMenu(event, 'group')}
            sx={{ backgroundColor: selectedGroup ? 'lightblue' : 'default' }}
          >
            מיין לפי קבוצה
          </Button>
          <Menu
            anchorEl={anchorElGroup}
            open={Boolean(anchorElGroup)}
            onClose={() => handleCloseMenu('group')}
          >
            <MenuItem onClick={() => handleGroupSelect({ id: '' })}>הצג הכל</MenuItem>
            {groups.map((group) => (
              <MenuItem
                key={group.id}
                onClick={() => handleGroupSelect(group)}
                selected={group.id === selectedGroup}
              >
                {group.name}
              </MenuItem>
            ))}
          </Menu>
          <Button
            variant="contained"
            onClick={(event) => handleOpenMenu(event, 'manager')}
            sx={{ backgroundColor: selectedManager ? 'lightblue' : 'default' }}
          >
            מיין לפי שם מבקש
          </Button>
          <Menu
            anchorEl={anchorElManager}
            open={Boolean(anchorElManager)}
            onClose={() => handleCloseMenu('manager')}
          >
            <MenuItem onClick={() => handleManagerSelect({ name: '' })}>הצג הכל</MenuItem>
            {managers.map((manager) => (
              <MenuItem
                key={manager.id}
                onClick={() => handleManagerSelect(manager)}
                selected={manager.name === selectedManager}
              >
                {manager.name}
              </MenuItem>
            ))}
          </Menu>
          <Button
            variant="contained"
            onClick={(event) => handleOpenMenu(event, 'affectedGroup')}
            sx={{ backgroundColor: selectedAffectedGroups.length > 0 ? 'lightblue' : 'default' }}
          >
            מיין לפי קבוצות מושפעות
          </Button>
          <Menu
            anchorEl={anchorElAffectedGroup}
            open={Boolean(anchorElAffectedGroup)}
            onClose={() => handleCloseMenu('affectedGroup')}
            MenuProps={{ PaperProps: { style: { maxHeight: 400, width: 250 } } }}
          >
            {groups.map((group) => (
              <MenuItem key={group.id} onClick={() => handleAffectedGroupSelect(group.id)}>
                <Checkbox checked={selectedAffectedGroups.includes(group.id)} />
                {group.name}
              </MenuItem>
            ))}
            <MenuItem onClick={applyFilter}>החל פילטר</MenuItem>
          </Menu>
        </Box>
        <TableContainer sx={{ maxHeight: 440 }}>
          <Table stickyHeader>
            <TableHead>
              <TableRow>

                {columns.map((column) => (
                  showGroupColumns || !column.id.includes('group') ? (
                    <TableCell key={column.id} align="left" style={{ minWidth: column.minWidth }}>
                      {column.label}
                    </TableCell>
                  ) : null

                {allColumns.map((column) => (
                  <EditableTableHeader key={column.id} column={column} onEditClick={handleEditClick} />

                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.map((row) => (
                <TableRow hover role="checkbox" tabIndex={-1} key={row.ID}>

                  {columns.map((column) => (
                    showGroupColumns || !column.id.includes('group') ? (
                      <TableCell key={column.id} align="left">
                        {row[column.id] || 'N/A'}
                      </TableCell>
                    ) : null
                  ))}

                  {allColumns.map((column) => {
                    const value = row[column.id] || '';
                    return (
                      <TableCell
                        key={column.id}
                        align={column.align || 'left'}
                        onDoubleClick={() => handleCellDoubleClick(row.ID, column.id)}
                      >
                        {column.id.startsWith('group_') ? (
                          <Select
                            value={value}
                            onChange={(e) => handleStatusChange(row.ID, column.id, e.target.value)}
                            displayEmpty
                          >
                            {statuses.map((status) => (
                              <MenuItem key={status} value={status}>
                                {status}
                              </MenuItem>
                            ))}
                          </Select>
                        ) : (
                          column.id === 'dateTime' ? formatDate(value) : value
                        )}
                      </TableCell>
                    );
                  })}

                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination

          rowsPerPageOptions={[4, 10, 25, { label: 'All', value: 'all' }]}

          rowsPerPageOptions={[4, 10, 25]}

          component="div"
          count={totalRows}
          rowsPerPage={rowsPerPage === -1 ? totalRows : rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>

      <Modal
        open={open}
        onClose={() => setOpen(false)}
      >
        <Box sx={modalStyle}>
          <RequestForm close={() => setOpen(false)} />


      {/* Modal for Request Form */}
      <Modal
        open={open}
        onClose={() => setOpen(false)}
        aria-labelledby="modal-title"
        aria-describedby="modal-description"
      >
        <Box sx={modalStyle}>
          <RequestForm onClose={() => setOpen(false)} />
        </Box>
      </Modal>

      {/* Modal for Editing */}
      <Modal
        open={editOpen}
        onClose={() => setEditOpen(false)}
        aria-labelledby="edit-modal-title"
        aria-describedby="edit-modal-description"
      >
        <Box sx={modalStyle}>
          <TextField
            fullWidth
            label="Edit Value"
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            variant="outlined"
            margin="normal"
          />
          <Button variant="contained" onClick={() => handleEditSave(editValue)}>
            Save
          </Button>

        </Box>
      </Modal>
    </Box>
  );
}
