import React, { useState, useEffect } from 'react';
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
import axios from 'axios';
import RequestForm from './RequestForm'; // נניח שהטופס נמצא באותו תיקייה

const columns = [
  { id: 'title', label: 'Title', minWidth: 100 },
  { id: 'requestorName', label: 'Requestor Name', minWidth: 100 },
  { id: 'requestGroup', label: 'Request Group', minWidth: 100 },
  { id: 'description', label: 'Description', minWidth: 150 },
  { id: 'priority', label: 'Priority', minWidth: 70 },
  { id: 'finalDecision', label: 'Final Decision', minWidth: 100 },
  { id: 'planned', label: 'Planned', minWidth: 100 },
  { id: 'comments', label: 'Comments', minWidth: 100 },
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

export default function MainTable() {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(4);
  const [rows, setRows] = useState([]);
  const [totalRows, setTotalRows] = useState(0);
  const [groups, setGroups] = useState([]);
  const [managers, setManagers] = useState([]);
  const [affectedGroups, setAffectedGroups] = useState([]);
  const [showGroupColumns, setShowGroupColumns] = useState(true);
  const [open, setOpen] = useState(false);
  const [anchorElGroup, setAnchorElGroup] = useState(null);
  const [anchorElManager, setAnchorElManager] = useState(null);
  const [anchorElAffectedGroup, setAnchorElAffectedGroup] = useState(null);
  const [selectedGroup, setSelectedGroup] = useState('');
  const [selectedManager, setSelectedManager] = useState('');
  const [selectedAffectedGroups, setSelectedAffectedGroups] = useState([]);

  useEffect(() => {
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

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    const value = event.target.value;
    setRowsPerPage(value === 'all' ? -1 : +value);
    setPage(0);
  };

  const handleToggleColumns = () => {
    setShowGroupColumns(prev => !prev);
  };

  const handleOpenMenu = (event, type) => {
    switch (type) {
      case 'group':
        setAnchorElGroup(event.currentTarget);
        break;
      case 'manager':
        setAnchorElManager(event.currentTarget);
        break;
      case 'affectedGroup':
        setAnchorElAffectedGroup(event.currentTarget);
        break;
      default:
        break;
    }
  };

  const handleCloseMenu = (type) => {
    switch (type) {
      case 'group':
        setAnchorElGroup(null);
        break;
      case 'manager':
        setAnchorElManager(null);
        break;
      case 'affectedGroup':
        setAnchorElAffectedGroup(null);
        break;
      default:
        break;
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
    setSelectedAffectedGroups(prev =>
      prev.includes(groupId) ? prev.filter(id => id !== groupId) : [...prev, groupId]
    );
  };

  const applyFilter = async () => {
    try {
      const response = await axios.get('http://localhost:3001/api/requests', {
        params: {
          affectedGroupList: selectedAffectedGroups.join(','),
        }
      });
      setRows(response.data.requests);
      setTotalRows(response.data.totalCount || 0);
    } catch (error) {
      console.error("Failed to apply filter", error);
    }
    handleCloseMenu('affectedGroup');
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
          >
            <MenuItem onClick={applyFilter}>החל פילטר</MenuItem>
            {groups.map((group) => (
              <MenuItem key={group.id}>
                <Checkbox
                  checked={selectedAffectedGroups.includes(group.id)}
                  onChange={() => handleAffectedGroupSelect(group.id)}
                />
                {group.name}
              </MenuItem>
            ))}
          </Menu>
        </Box>
        <TableContainer sx={{ maxHeight: 400, maxWidth: '100%', overflow: 'auto' }}>
          <Table>
            <TableHead>
              <TableRow>
                {columns.map((column) => (
                  showGroupColumns || column.id !== 'requestorGroup' ? (
                    <TableCell key={column.id} align="left">
                      {column.label}
                    </TableCell>
                  ) : null
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.map((row) => (
                <TableRow key={row.id}>
                  {columns.map((column) => (
                    (showGroupColumns || column.id !== 'requestorGroup') ? (
                      <TableCell key={column.id} align="left">
                        {row[column.id]}
                      </TableCell>
                    ) : null
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[4, 8, 12, { label: 'All', value: -1 }]}
          component="div"
          count={totalRows}
          rowsPerPage={rowsPerPage}
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
          <RequestForm onClose={() => setOpen(false)} />
        </Box>
      </Modal>
    </Box>
  );
}
