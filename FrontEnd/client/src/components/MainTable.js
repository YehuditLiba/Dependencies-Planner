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
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[4, 10, 25, { label: 'All', value: 'all' }]}
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
        </Box>
      </Modal>
    </Box>
  );
}
