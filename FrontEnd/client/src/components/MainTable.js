import React, { useState, useEffect } from 'react';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TablePagination from '@mui/material/TablePagination';
import Button from '@mui/material/Button';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Checkbox from '@mui/material/Checkbox';
import Select from '@mui/material/Select';
import axios from 'axios';
import '../designs/TableStyles.scss';
import RequestForm from './RequestForm';
import EditableRow from './EditableRow';
import { formatDateTime } from '../utils/utils'; // נייבא את הפונקציה החדשה




const columns = [
  { id: 'title', label: 'Title', minWidth: 100 },
  { id: 'requestorName', label: 'Requestor Name', minWidth: 100 },
  { id: 'requestGroup', label: 'Request Group', minWidth: 100, show: true },
  { id: 'description', label: 'Description', minWidth: 150 },
  { id: 'priority', label: 'Priority', minWidth: 70 },
  { id: 'finalDecision', label: 'Final Decision', minWidth: 100 },
  { id: 'planned', label: 'Planned', minWidth: 100 },
  { id: 'comments', label: 'Comments', minWidth: 150 },
  { id: 'emailRequestor', label: 'Email Requestor', minWidth: 150 },
  { id: 'dateTime', label: 'DateTime', minWidth: 100 }
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

export default function MainTable({ emailRequestor }) {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(4);
  const [rows, setRows] = useState([]);
  const [totalRows, setTotalRows] = useState(0);
  const [groups, setGroups] = useState([]);
  const [managers, setManagers] = useState([]);
  const [affectedGroups, setAffectedGroups] = useState([]);
  const [showGroupColumns, setShowGroupColumns] = useState(true);
  const [open, setOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [anchorElGroup, setAnchorElGroup] = useState(null);
  const [anchorElManager, setAnchorElManager] = useState(null);
  const [anchorElAffectedGroup, setAnchorElAffectedGroup] = useState(null);
  const [selectedGroup, setSelectedGroup] = useState('');
  const [selectedManager, setSelectedManager] = useState('');
  const [selectedAffectedGroups, setSelectedAffectedGroups] = useState([]);
  const [statuses, setStatuses] = useState([]);
  const [editValue, setEditValue] = useState('');
  const [isEditingRow, setIsEditingRow] = useState(null);


  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:3001/api/requests', {
          params: {
            limit: rowsPerPage === -1 ? undefined : rowsPerPage,
            offset: rowsPerPage === -1 ? 0 : page * rowsPerPage,
            requestorGroup: selectedGroup || undefined,
            requestorName: selectedManager || undefined,
            affectedGroupList: selectedAffectedGroups.length ? selectedAffectedGroups.join(',') : undefined
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

    const fetchStatuses = async () => {
      try {
        const response = await axios.get('http://localhost:3001/api/statuses');
        setStatuses(response.data);
      } catch (error) {
        console.error("Failed to fetch statuses", error);
      }
    };

    fetchData();
    fetchGroups();
    fetchManagers();
    fetchStatuses();
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

  const applyFilter = () => {
    handleCloseMenu('affectedGroup');
  };
  const handleStatusChange = async (rowId, groupId, newStatus) => {
    try {
      await axios.post('http://localhost:3001/api/updateStatus', {
        requestId: rowId,
        groupId: groupId,
        status: newStatus
      });

      const updatedRows = rows.map(row => {
        if (row.ID === rowId) {
          return {
            ...row,
            statuses: row.statuses.map(s => 
              s.groupId === groupId ? { ...s, status: newStatus } : s
            )
          };
        }
        return row;
      });
      setRows(updatedRows);
    } catch (error) {
      console.error('Failed to update status', error);
    }
  };
  const handleEditSave = (value) => {
    console.log('Saving edited value:', value);
    setEditOpen(false);
  };
  const getStatusBackgroundColor = (status) => {
    switch (status) {
      case 'Pending Response':
        return '#FFFF99'; // Yellow
      case 'Not Required':
        return '#D3D3D3'; // Grey
      case 'In Q':
        return '#98FB98'; // Green
      case 'Not in Q':
        return '#FF6961'; // Red
      default:
        return 'white';
    }
  };

<<<<<<< HEAD
  const getGroupStatus = (row, groupId) => {
    const status = row.statuses.find(s => s.groupId === groupId);
    return status ? status.status : 'Not Required';
=======
  const handleStatusChange = (rowId, groupId, newStatus) => {
    const updatedGroups = affectedGroups.map(group =>
      group.requestId === rowId && group.groupId === groupId
        ? { ...group, status: newStatus }
        : group
    );
    setAffectedGroups(updatedGroups);
    // Save the updated status to the server
    axios.post('http://localhost:3001/api/updateStatus', {
      requestId: rowId,
      groupId: groupId,
      status: newStatus
    });
>>>>>>> master
  };

  const formatDate = (value) => {
    const date = new Date(value);
    return date.toLocaleDateString('he-IL');
  };


  // const handleStatusChange = (rowId, groupId, newStatus) => {
  //   const updatedGroups = affectedGroups.map(group =>
  //     group.requestId === rowId && group.groupId === groupId
  //       ? { ...group, status: newStatus }
  //       : group
  //   );

  //   setAffectedGroups(updatedGroups);
  //   // Save the updated status to the server
  //   axios.post('http://localhost:3001/api/updateStatus', {
  //     requestId: rowId,
  //     groupId: groupId,
  //     status: newStatus
  //   });
  // };

  const updateRequest = async (id, updatedFields) => {
    try {
      const response = await axios.put(`http://localhost:3001/api/requests/${id}`, updatedFields);
      // עדכון הסטייט בהתאם לתגובה מהשרת אם נדרש
    } catch (error) {
      console.error('Failed to update request', error);
    }
  };


  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: 4 }}>
      <Box className="header" >
        <img src="/path/to/logo.png" alt="Logo" className="logo" />
        <h1>Dependencies-Planner</h1>
      </Box>
      <Paper className="table-paper">
        <Box className="table-controls">
          <Button
            className="add-request-button"
            variant="contained"
            onClick={() => setOpen(true)}
          >
            Add Request
          </Button>
          <Button
            className="toggle-columns-button"
            variant="contained"
            onClick={handleToggleColumns}
          >
            {showGroupColumns ? 'Hide Group Columns' : 'Show Group Columns'}
          </Button>
          <Button
            className="filter-group-button"
            variant="contained"
            onClick={(event) => handleOpenMenu(event, 'group')}
          >
            Filter by Groups
          </Button>
          <Menu
            anchorEl={anchorElGroup}
            open={Boolean(anchorElGroup)}
            onClose={() => handleCloseMenu('group')}
          >
            {groups.map(group => (
              <MenuItem key={group.id} onClick={() => handleGroupSelect(group)}>
                {group.name}
              </MenuItem>
            ))}
          </Menu>
          <Button
            className="filter-manager-button"
            variant="contained"
            onClick={(event) => handleOpenMenu(event, 'manager')}
          >
            Filter by Manager
          </Button>
          <Menu
            anchorEl={anchorElManager}
            open={Boolean(anchorElManager)}
            onClose={() => handleCloseMenu('manager')}
          >
            {managers.map(manager => (
              <MenuItem key={manager.name} onClick={() => handleManagerSelect(manager)}>
                {manager.name}
              </MenuItem>
            ))}
          </Menu>
          <Button
            className="filter-affected-group-button"
            variant="contained"
            onClick={(event) => handleOpenMenu(event, 'affectedGroup')}
          >
            Filter by Affected Groups
          </Button>
          <Menu
            anchorEl={anchorElAffectedGroup}
            open={Boolean(anchorElAffectedGroup)}
            onClose={() => handleCloseMenu('affectedGroup')}
          >
            {groups.map(group => (
              <MenuItem key={group.id} onClick={() => handleAffectedGroupSelect(group.id)}>
                <Checkbox
                  checked={selectedAffectedGroups.includes(group.id)}
                />
                {group.name}
              </MenuItem>
            ))}
            <MenuItem onClick={applyFilter}>
              Apply Filter
            </MenuItem>
          </Menu>
        </Box>
        <TableContainer>
          <Table>
            <TableHead>

            <TableRow>
                {columns.map(column => (
                  column.show !== false && (
                    <TableCell
                      key={column.id}
                      align={column.align}
                      style={{ minWidth: column.minWidth }}
                    >
                      {column.label}
                    </TableCell>
                  )
                ))}
                {showGroupColumns && groups.map(group => (
                  <TableCell
                    key={group.id}
                    align="center"
                    style={{ minWidth: 100 }}
                  >
                    {group.name}
                  </TableCell>
                ))}
              </TableRow>

              {/* <TableRow>
                <TableCell></TableCell>
                {columns.map(column => (
                  (showGroupColumns || !column.id.includes('group')) && (
                    <TableCell key={column.id} style={{ minWidth: column.minWidth }}>
                      {column.label}
                    </TableCell>
                  )
                ))}
                {showGroupColumns && groups.map(group => (
                  <TableCell key={group.id} style={{ minWidth: 150 }}>
                    {group.name}
                  </TableCell>
                ))}
              </TableRow> */}
            </TableHead>

            <TableBody>
              {rows.map((row, rowIndex) => (
                <EditableRow
                  key={row.ID}
                  row={row}
                  index={rowIndex}
                  columns={columns}
                  isEditingRow={isEditingRow}
                  setIsEditingRow={setIsEditingRow}
                  editValue={editValue}
                  setEditValue={setEditValue}
                  handleEditSave={handleEditSave}
                  handleStatusChange={handleStatusChange}
                  groups={groups}
                  statuses={statuses}
                  getStatusBackgroundColor={getStatusBackgroundColor}
                  getGroupStatus={getGroupStatus}
                  formatDate={formatDate}
                />
              ))}
            </TableBody> 


            {/* <TableBody>
              {rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map(row => (
                <EditableRow
                  key={row.ID}
                  row={row}
                  columns={columns}
                  groups={groups}
                  statuses={statuses}
                  onUpdate={updatedRow => {
                    console.log('Updated Row from Backend:', updatedRow); // Debugging Line
                    const newRows = rows.map(r => r.ID === updatedRow.ID ? updatedRow : r);
                    setRows(newRows);
                  }}
                  formatDateTime={formatDateTime} // העברת הפונקציה לקומפוננטת ה-EditableRow
                />
              ))}
<<<<<<< HEAD
            </TableBody> */}
=======
            </TableBody>
>>>>>>> master
          </Table>
        </TableContainer>

        <TablePagination
          rowsPerPageOptions={[4, 10, 25, { label: 'All', value: -1 }]}
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
<<<<<<< HEAD
        onClose={() => setOpen(false)}>
          <Box sx={{ ...modalStyle, overflow: 'auto', maxHeight: '80vh' }}>
        <RequestForm onClose={() => setOpen(false)} emailRequestor={emailRequestor}/>
=======
        onClose={() => setOpen(false)}
      >
        <Box sx={{ ...modalStyle, overflow: 'auto', maxHeight: '80vh' }}>
          <RequestForm onClose={() => setOpen(false)} emailRequestor={emailRequestor} />

>>>>>>> master
          <Button onClick={() => setOpen(false)}>Close</Button>
        </Box>
      </Modal>
      <Menu
        anchorEl={anchorElManager}
        open={Boolean(anchorElManager)}
        onClose={() => handleCloseMenu('manager')}
      >
        {groups.map(group => (
          <MenuItem key={group.name} onClick={() => handleManagerSelect(group)}>
            {group.name}
          </MenuItem>
        ))}
      </Menu>
      <Menu
        anchorEl={anchorElAffectedGroup}
        open={Boolean(anchorElAffectedGroup)}
        onClose={() => handleCloseMenu('affectedGroup')}
      >
        {affectedGroups.map(group => (
          <MenuItem key={group.id} onClick={() => handleAffectedGroupSelect(group.id)}>
            <Checkbox checked={selectedAffectedGroups.includes(group.id)} />
            {group.name}
          </MenuItem>
        ))}
        <MenuItem onClick={applyFilter}>Apply</MenuItem>
      </Menu>
      {/* <Box sx={modalStyle}>
          <Button onClick={() => handleEditSave(editValue)}>Save</Button>
          <Button onClick={() => setEditOpen(false)}>Cancel</Button>
        </Box> */}
    </Box>
  );
}

