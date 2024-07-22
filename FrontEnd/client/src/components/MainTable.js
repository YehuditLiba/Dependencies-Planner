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
import axios from 'axios';
import RequestForm from './RequestForm'; // נניח שהטופס נמצא באותו תיקייה
import EditableTableHeader from './EditableTableHeader';
import EditPopup from './EditPopup';



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
  const [showGroupColumns, setShowGroupColumns] = React.useState(true);
  const [open, setOpen] = React.useState(false);
  const [editOpen, setEditOpen] = React.useState(false);
  const [editValue, setEditValue] = React.useState('');
  const [editColumn, setEditColumn] = React.useState('');
  const [editRowId, setEditRowId] = React.useState(null);
  const [editableColumns, setEditableColumns] = React.useState({}); // Add this line
  const [priorities, setPriorities] = React.useState([]);
  const [decisions, setDecisions] = React.useState([]);
  const [statuses, setStatuses] = React.useState([]);
  const [productManagers, setproductManagers] = React.useState([]);
  const [planneedQueues, setPlanneedQueues] = React.useState([]);


  React.useEffect(() => {
    fetchData();
    fetchGroups();
    fetchPriorities();
    fetchDecisions();
    fetchStatuses();
    fetchProductManagers();

  }, [page, rowsPerPage]);

  const fetchData = async () => {
    try {
      const response = await axios.get(`http://localhost:3001/api/requests?limit=${rowsPerPage}&offset=${page * rowsPerPage}`);
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

  const fetchPriorities = async () => {
    try {
      const response = await axios.get('http://localhost:3001/api/priority');
      setPriorities(response.data);
    } catch (error) {
      console.error("Failed to fetch priorities", error);
    }
  };

  const fetchDecisions = async () => {
    try {
      const response = await axios.get('http://localhost:3001/api/decisions');
      setDecisions(response.data);
    } catch (error) {
      console.error("Failed to fetch decisions", error);
    }
  };
  const fetchStatuses = async () => {
    try {
      const response = await axios.get('http://localhost:3001/api/status');
      setStatuses(response.data);
    } catch (error) {
      console.error("Failed to fetch statuses", error);
    }
  };

  const fetchProductManagers = async () => {
    try {
      const response = await axios.get('http://localhost:3001/api/productManagers');
      setproductManagers(response.data);
    } catch (error) {
      console.error("Failed to fetch product managers", error);
    }
  };



  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const handleToggleColumns = () => {
    setShowGroupColumns(!showGroupColumns);
  };

  const handleEditClick = (columnId) => {
    setEditableColumns((prev) => ({
      ...prev,
      [columnId]: !prev[columnId], // Toggle editability of the column
    }));
  };

  const handleCellDoubleClick = (rowId, columnId) => {
    if (editableColumns[columnId]) { // Check if the column is editable
      const row = rows.find((r) => r.ID === rowId);
      const value = row[columnId];
      setEditValue(Array.isArray(value) ? value.join(', ') : value);
      setEditRowId(rowId);
      setEditColumn(columnId);
      setEditOpen(true);
    }
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
      if (editColumn.startsWith('group_')) {
        await axios.put(`http://localhost:3001/api/requests/${editRowId}/affectedGroups`, { affectedGroups: newValue });
      } else if (editColumn === 'finalDecision') {
        await axios.put(`http://localhost:3001/api/requests/updateFinalDecision/${editRowId}`, { finalDecision: newValue });
      } else if (editColumn === 'planned') {
        await axios.put(`http://localhost:3001/api/requests/${editRowId}/planned`, { planneedQueues: newValue });
      } else {
        const payload = { [editColumn]: newValue };
        await axios.put(`http://localhost:3001/api/requests/${editRowId}`, payload /*{ [editColumn]: newValue }*/);
      }
    } catch (error) {
      console.error("Failed to save data", error);
    }
  };



  const allColumns = [...columns, ...groups.map(group => ({
    id: `group_${group.id}`,
    label: group.name,
    minWidth: 100
  }))];

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
        </Box>
        <TableContainer sx={{ maxHeight: 440, marginTop: 2 }}>
          <Table stickyHeader aria-label="sticky table">
            <TableHead>
              <TableRow>
                {columns.map((column) => (
                  <EditableTableHeader key={column.id} column={column} onEditClick={handleEditClick} />
                ))}
                {showGroupColumns && groups.map(group => (
                  <EditableTableHeader key={`group_${group.id}`} column={{ id: `group_${group.id}`, label: group.name }} onEditClick={handleEditClick} />
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.map((row) => (
                <TableRow hover role="checkbox" tabIndex={-1} key={row.ID}>
                  {columns.map((column) => {
                    const value = row[column.id] || '';
                    return (
                      <TableCell
                        key={column.id}
                        align={column.align || 'left'}
                        onDoubleClick={() => handleCellDoubleClick(row.ID, column.id)}
                      >
                        {Array.isArray(value) ? value.join(', ') : value}
                      </TableCell>
                    );
                  })}
                  {showGroupColumns && groups.map(group => (
                    <TableCell key={`group_${group.id}`} align="left" onDoubleClick={() => handleCellDoubleClick(row.ID, `group_${group.id}`)}>
                      {(row[`group_${group.id}`] || []).join(', ')}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[4, 10, 25, 100]}
          component="div"
          count={totalRows}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          labelDisplayedRows={({ from, to, count }) => `${from}-${to} מתוך ${count !== -1 ? count : `יותר מ-${to}`}`}
        />
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
        <EditPopup
          open={editOpen}
          handleClose={() => setEditOpen(false)}
          value={editValue}
          onSave={handleEditSave}
          column={editColumn} // Pass the current column being edited
          groups={groups}
          priorities={priorities} // Pass the priorities data
          decisions={decisions} // Pass the decisions data
          statuses={statuses}  // Add this line to pass statuses
          productManagers={productManagers}
          planneedQueues={planneedQueues}
        />
      </Paper>
    </Box>

  );
}