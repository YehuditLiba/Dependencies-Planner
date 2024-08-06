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
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import VisibilityIcon from '@mui/icons-material/Visibility';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import SearchIcon from '@mui/icons-material/Search';
import { faPlusCircle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
//import logo from 'Practicum.png'; // עדכן את הנתיב ללוגו שלך
import Icon from '@mui/icons-material/AddCircle'; // אם אתה משתמש ב-Material-UI
import { faDownload } from '@fortawesome/free-solid-svg-icons';
import FormGroup from '@mui/material/FormGroup';
import axios from 'axios';
import '../designs/TableStyles.scss';
import '../designs/mainTable.css';
import RequestForm from './RequestForm';
import EditableRow from './EditableRow';
// import AdminSettings from './AdminSettings';
import { Navigate } from 'react-router-dom';
import AdminSettings from './AdminSettings';
import { formatDateTime } from '../utils/utils'; // נייבא את הפונקציה החדשה
import StatusCell from './StatusCell';
import DeleteRequest from './DeleteRequest'; // Add this line
import TuneIcon from '@mui/icons-material/Tune'; // שימוש באייקון Tune
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import { faArrowsAltH } from '@fortawesome/free-solid-svg-icons';
import { faTimes, faSearch } from '@fortawesome/free-solid-svg-icons';
import Papa from 'papaparse';
import Header from './Header'; // ודא שהייבוא נכון

const columns = [
  { id: 'actions', label: 'Actions', minWidth: 100 },
  { id: 'title', label: 'Title', minWidth: 100 },
  { id: 'requestorName', label: 'Requestor Name', minWidth: 100 },
  { id: 'requestGroup', label: 'Request Group', minWidth: 100, show: true },
  { id: 'description', label: 'Description', minWidth: 150 },
  { id: 'priority', label: 'Priority', minWidth: 70 },
  { id: 'finalDecision', label: 'Final Decision', minWidth: 100 },
  { id: 'planned', label: 'Planned', minWidth: 100 },
  { id: 'comments', label: 'Comments', minWidth: 150 },
  { id: 'emailRequestor', label: 'Email Requestor', minWidth: 150 },
  { id: 'dateTime', label: 'DateTime', minWidth: 100 },
  { id: 'jiraLink', label: 'Jira Link', minWidth: 100 }  //  Jira Link

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
  const [rowsPerPage, setRowsPerPage] = useState(8);
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
  const [redirectToAdminSettings, setRedirectToAdminSettings] = useState(false);
  const [requestId, setRequestId] = useState(null);
  const [groupId, setGroupId] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredRows, setFilteredRows] = useState([]);
  const [selectedButton, setSelectedButton] = useState(null);
 const [adminSettingsOpen, setAdminSettingsOpen] = useState(false);

    useEffect(() => {
      const fetchData = async () => {
        try {
          const params = {
            limit: rowsPerPage === -1 ? undefined : rowsPerPage,
            offset: rowsPerPage === -1 ? 0 : page * rowsPerPage,
          };

          if (selectedGroup) {
            params.requestorGroup = selectedGroup;
          }

    if (selectedAffectedGroups.length) {
      params.affectedGroupList = selectedAffectedGroups.join(',');
    }

    console.log('Params sent to server:', params);

    const response = await axios.get('http://localhost:3001/api/requests', { params });

    console.log('Full response data:', response.data);

    if (response.data.requests) {
      console.log('Fetched rows:', response.data.requests);
      setRows(response.data.requests);
      setTotalRows(response.data.totalCount || response.data.requests.length);
    } else {
      console.warn('No requests found in response data');
    }
  } catch (error) {
    console.error("Failed to fetch data", error);
    alert("Failed to fetch data from server. Please try again later.");
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
        const response = await axios.get('http://localhost:3001/api/status');
        console.log('Statuses fetched from server:', response.data);
        setStatuses(response.data);
      } catch (error) {
        console.error('Failed to fetch statuses', error);
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
  const handleDeleteRequest = (ID) => {
    console.log(`Removing row with ID: ${ID} from the table`);
    setRows(prevRows => prevRows.filter(row => row.ID !== ID));
  };
  const applyFilter = () => {
    handleCloseMenu('affectedGroup');
  };
  const clearFilters = () => {
    setSelectedGroup('');
    setSelectedManager('');
    setSelectedAffectedGroups([]);
  };

  const handleEditSave = (value) => {
    console.log('Saving edited value:', value);
    setEditOpen(false);
  };

  const formatDate = (value) => {
    const date = new Date(value);
    return date.toLocaleDateString('he-IL');
  };

  const getGroupStatus = (row, groupId) => {
    // נניח שיש לך מבנה של סטטוסים ב- row, תוודא שהנתיב נכון לסטטוס של הקבוצה
    const status = row.statuses.find(status => status.groupId === groupId);
    return status ? status.status_description : 'No Status';
  };
  const handleExportCSV = () => {
    const csvData = Papa.unparse(rows); // המרת המידע מהטבלה ל-CSV

    // יצירת אובייקט Blob עם המידע והורדתו
    const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'data.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // const handleStatusChange = async (rowId, groupId) => {
  //   const newStatus = prompt("Enter new status:");
  //   if (newStatus) {
  //     try {
  //       const response = await axios.post('http://localhost:3001/api/updateStatus', {
  //         requestId: rowId,
  //         groupId: groupId,
  //         status: newStatus
  //       });
  //       // עדכון סטטוסים מקומי אם נדרש
  //       setStatuses(prevStatuses => prevStatuses.map(status =>
  //         status.request_id === rowId && status.group_id === groupId
  //           ? { ...status, status_description: newStatus }
  //           : status
  //       ));
  //     } catch (error) {
  //       console.error("Failed to update status", error);
  //     }
  //   }
  // };

  // פונקציה לשליחת שינוי סטטוס לשרת
  const handleStatusChange = async (affectedGroupId, statusId) => {
    try {
      await axios.put('http://localhost:3001/api/updateAffectedGroups/status', {
        affectedGroupId,
        statusId
      });
    } catch (error) {
      console.error('Error updating affected group status:', error);
    }
  };


  const getStatusBackgroundColor = (status) => {
    switch (status) {
      case 'Completed':
        return 'lightgreen';
      case 'Pending Response':
        return 'lightyellow';
      case 'Not Required':
        return 'lightgray';
      default:
        return 'white';
    }
  };
  const updateRequest = async (id, updatedFields) => {
    try {
      const response = await axios.put(`http://localhost:3001/api/requests/${id}`, updatedFields);
      // עדכון הסטייט בהתאם לתגובה מהשרת אם נדרש
    } catch (error) {
      console.error('Failed to update request', error);
    }
  };

  if (redirectToAdminSettings) {
    return <Navigate to="/admin-settings" />;
  }

  const handleSave = (updatedRow) => {
    setRows(prevRows =>
      prevRows.map(row =>
        row.ID === updatedRow.ID ? updatedRow : row
      ));
  };

  const onDrop = async (e, rowIndex) => {
    const draggedRowIndex = e.dataTransfer.getData('rowIndex');
    const newRows = [...rows];
    const [draggedRow] = newRows.splice(draggedRowIndex, 1);
    newRows.splice(rowIndex, 0, draggedRow);

    // עדכון order_index בהתאם למיקום החדש של השורות
    const updatedRows = newRows.map((row, index) => ({
      ...row,
      order_index: index  // מניחים ש-order_index מתחיל מ-0
    }));

    // עדכון מצב השורות והנתונים במסד הנתונים
    setRows(updatedRows);

    try {
      await fetch('http://localhost:3001/api/update-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedRows),
      });
    } catch (error) {
      console.error('עדכון הסדר נכשל:', error);
    }
  };
  // סידור השורות לפי order_index
  const sortedRows = [...rows].sort((a, b) => a.order_index - b.order_index);
  


  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: 4 }}>
      <Header /> {/* הוספת ה-Header */}
      <Box className="table-container">
      <Paper sx={{ width: '80%', overflow: 'hidden', marginTop: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, padding: 2 }}>
          <div className="filter-buttons-container">
            <Tooltip title="Add Request" arrow>
              <Button
                className="add-request-button"
                onClick={() => setOpen(true)}
                variant="contained"
              >
                <FontAwesomeIcon icon={faPlusCircle} size="2x" className="add-icon" />
              </Button>
            </Tooltip>
            <Tooltip title="Filter by Group" arrow>
              <Button
                className="filter-button group-button"
                variant="contained"
                onClick={(event) => handleOpenMenu(event, 'group')}
              >
                <SearchIcon />
              </Button>
            </Tooltip>
            <Menu
              anchorEl={anchorElGroup}
              open={Boolean(anchorElGroup)}
              onClose={() => handleCloseMenu('group')}
            >
              {groups.map((group) => (
                <MenuItem
                  key={group.id}
                  selected={group.id === selectedGroup}
                  onClick={() => handleGroupSelect(group)}
                >
                  <Checkbox checked={group.id === selectedGroup} />
                  {group.name}
                </MenuItem>
              ))}
            </Menu>

            <Tooltip title="Filter by Manager" arrow>
              <Button
                className="filter-button manager-button"
                variant="contained"
                onClick={(event) => handleOpenMenu(event, 'manager')}
              >
                <SearchOutlinedIcon />
              </Button>
            </Tooltip>
            <Menu
              anchorEl={anchorElManager}
              open={Boolean(anchorElManager)}
              onClose={() => handleCloseMenu('manager')}
            >
              {managers.map((manager) => (
                <MenuItem
                  key={manager.id}
                  selected={manager.name === selectedManager}
                  onClick={() => handleManagerSelect(manager)}
                >
                  <Checkbox checked={manager.name === selectedManager} />
                  {manager.name}
                </MenuItem>
              ))}
            </Menu>

            <Tooltip title="Filter by Affected Groups" arrow>
              <Button
                className="filter-button affected-group-button"
                variant="contained"
                onClick={(event) => handleOpenMenu(event, 'affectedGroup')}
              >
                <SearchOutlinedIcon />
              </Button>
            </Tooltip>
            <Menu
              anchorEl={anchorElAffectedGroup}
              open={Boolean(anchorElAffectedGroup)}
              onClose={() => handleCloseMenu('affectedGroup')}
            >
              {groups.map((group) => (
                <MenuItem
                  key={group.id}
                  onClick={() => handleAffectedGroupSelect(group.id)}
                >
                  <Checkbox checked={selectedAffectedGroups.includes(group.id)} />
                  {group.name}
                </MenuItem>
              ))}
              <MenuItem onClick={applyFilter}>Apply</MenuItem>
            </Menu>
            <Tooltip title="Clear Filters" arrow>
              <Button
                className="clear-filters-button"
                onClick={clearFilters}
                variant="contained"
              >
                <FontAwesomeIcon icon={faTimes} className="clear-filters-icon" />
              </Button>
            </Tooltip>

            <Tooltip title={showGroupColumns ? "Hide Group Columns" : "Show Group Columns"} arrow>
              <Button
                className="column-toggle-button"
                onClick={handleToggleColumns}
                variant="contained"
              >
                <FontAwesomeIcon icon={faArrowsAltH} className="column-toggle-icon" />
              </Button>
            </Tooltip>
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'flex-end', // למקם את התוכן לימין
              }}
            >
              <Button
                variant="contained"
                color="primary"
                onClick={() => setRedirectToAdminSettings(true)}
                sx={{
                  borderRadius: '8px', // שינוי לצורת מלבן עם פינות עגולות
                  padding: '8px 16px', // התאמת גובה ורוחב הכפתור
                  minWidth: 'auto', // אין צורך ברוחב מינימלי
                  fontSize: '0.8rem', // התאמת גודל הטקסט
                  boxShadow: '0 0 10px rgba(0, 255, 0, 0.5)', // מסגרת זוהרת בצבע ירוק
                }}
              >
                Admin Settings
              </Button>
            </Box>
            <Tooltip title="Export to File" arrow>
              <Button
                className="export-button"
                variant="contained"
                sx={{
                  borderRadius: '8px', // שינוי לצורת מלבן עם פינות עגולות
                  padding: '8px 16px', // התאמת גובה ורוחב הכפתור
                  minWidth: 'auto', // אין צורך ברוחב מינימלי
                  fontSize: '0.8rem', // התאמת גודל הטקסט
                  boxShadow: '0 0 10px rgba(0, 255, 0, 0.5)', // מסגרת זוהרת בצבע ירוק
                }}
                  onClick = { handleExportCSV }
              >
                <FontAwesomeIcon icon={faDownload} className="export-icon" style={{ marginRight: '8px' }} />
                Export
              </Button>
            </Tooltip>
          </div>
          
        </Box>
        <TableContainer sx={{ maxHeight: 440 }}>
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                {columns.map((column) => (
                  <TableCell
                    key={column.id}
                    style={{ minWidth: column.minWidth, backgroundColor: '#d0e4f5', fontWeight: 'bold' }}
                  >
                    {column.label}
                  </TableCell>
                ))}
                {groups.map((group) =>
                  showGroupColumns ? (
                    <TableCell
                      key={group.id}
                      style={{ minWidth: 100, backgroundColor: '#d0e4f5', fontWeight: 'bold' }}
                    >
                      {group.name}
                    </TableCell>
                  ) : null
                )}
              </TableRow>
            </TableHead>
            <TableBody>
              {sortedRows.map((row, rowIndex) => (
                <React.Fragment key={row.id}>
                    <EditableRow
                    key={row.id}
                    row={row}
                    columns={columns}
                    onSave={handleSave}
                    email={emailRequestor}
                    onDelete={handleDeleteRequest}
                    formatDate={formatDate}
                    showGroupColumns={showGroupColumns}
                    groups={groups}
                    getStatusBackgroundColor={getStatusBackgroundColor}
                    // getGroupStatus={getGroupStatus}
                    handleStatusChange={handleStatusChange}
                    rowIndex={rowIndex}
                    onDrop={onDrop}
                  />
                  {/* {columns.map((column) => {
                      const value = row[column.id];
                      return (
                        column.id === 'requestGroup' && !showGroupColumns ? null : (
                          <TableCell key={column.id} style={{ minWidth: column.minWidth }}>
                            {column.id === 'dateTime' ? formatDate(value) : value}
                          </TableCell>
                        )
                      );
                    })} */}
                  {/* {groups.map((group) => {
                      const status = row.statuses.find(status => status.groupId === group.id);
                      const statusDescription = status ? status.status.status : 'Not Required';

                      // הגדרת סגנון התא
                      let cellStyle = {};
                      if (statusDescription === 'Not Required') {
                        cellStyle = { color: 'gray' }; // צבע אפור ל-'Not Required'
                      }

                      return showGroupColumns ? (
                        <TableCell
                          key={group.id}
                          style={{ backgroundColor: getStatusBackgroundColor(getGroupStatus(row, group.id)), ...cellStyle }}
                          onClick={() => handleStatusChange(row.id, group.id, 'newStatus')}
                        >
                          {statusDescription}
                        </TableCell>
                      ) : null;
                    })} */}
                </React.Fragment>
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
      </Box>
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
      <Modal
        open={editOpen}
        onClose={() => setEditOpen(false)}
        aria-labelledby="edit-modal-title"
        aria-describedby="edit-modal-description"
      >
        <Box sx={modalStyle}>
          <h2 id="edit-modal-title">Edit Value</h2>
          <textarea
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            rows={10}
            cols={50}
          />
          <Button onClick={() => handleEditSave(editValue)}>Save</Button>
        </Box>
      </Modal>
    </Box>
  );
}
