// EditPopup.js
import React, { useState, useEffect } from 'react';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
// import axios from 'axios';


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

function EditPopup({ open, handleClose, value, onSave, column, groups=[],priorities = [], decisions = [],statuses=[] ,productManagers=[]}) {
  const [editValue, setEditValue] = useState(value);

  useEffect(() => {
    setEditValue(value);
  }, [value]);

  const handleSave = () => {
    onSave(editValue);
    handleClose();
  };

  const renderInputField = () => {
    if (column.startsWith('group_')) {
      return (
        <TextField
          select
          label="Edit Status"
          variant="outlined"
          fullWidth
          value={editValue}
          onChange={(e) => setEditValue(e.target.value)}
        >
          {statuses.map((option) => (
            <MenuItem key={option.id} value={option.status}>
              {option.status}
            </MenuItem>
          ))}
        </TextField>
      );
    }
    else if (column === 'requestGroup') {
      return (
        <TextField
          select
          label="Edit Request group"
          variant="outlined"
          fullWidth
          value={editValue}
          onChange={(e) => setEditValue(e.target.value)}
        >
          {groups.map((option) => (
            <MenuItem key={option.id} value={option.name}>
              {option.name}
            </MenuItem>
          ))}
        </TextField>
      );
    }
    else if (column === 'priority') {
      return (
        <TextField
          select
          label="Edit Priority"
          variant="outlined"
          fullWidth
          value={editValue}
          onChange={(e) => setEditValue(e.target.value)}
        >
          {priorities.map((option) => (
            <MenuItem key={option.id} value={option.priority}>
              {option.priority}
            </MenuItem>
          ))}
        </TextField>
      );
    } else if (column === 'requestorName') {
      return (
        <TextField
          select
          label="Edit Requestor name"
          variant="outlined"
          fullWidth
          value={editValue}
          onChange={(e) => setEditValue(e.target.value)}
        >
          {productManagers.map((option) => (
            <MenuItem key={option.id} value={option.name}>
              {option.name}
            </MenuItem>
          ))}
        </TextField>
      );
    } else if (column === 'finalDecision') {
      return (
        <TextField
          select
          label="Edit Final Decision"
          variant="outlined"
          fullWidth
          value={editValue}
          onChange={(e) => setEditValue(e.target.value)}
        >
         <MenuItem value="In Q">In Q</MenuItem>
          <MenuItem value="Not in Q">Not in Q</MenuItem>
        </TextField>
      );
    }else if (column === 'planned') {
      return (
        <TextField
          select
          label="Edit Plannad Q"
          variant="outlined"
          fullWidth
          value={editValue}
          onChange={(e) => setEditValue(e.target.value)}
        >
         <MenuItem value="2024 Q1	">2024 Q1	</MenuItem>
         <MenuItem value="2024 Q2	">2024 Q2	</MenuItem>
         <MenuItem value="2024 Q3	">2024 Q3	</MenuItem>
         <MenuItem value="2024 Q4	">2024 Q4	</MenuItem>
        </TextField>
      );
    } else {
      return (
        <TextField
          label="Edit"
          variant="outlined"
          fullWidth
          value={editValue}
          onChange={(e) => setEditValue(e.target.value)}
        />
      );
    }
  };

  return (
    <Modal open={open} onClose={handleClose}>
      <Box sx={modalStyle}>
        {renderInputField()}
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', marginTop: 2 }}>
          <Button onClick={handleClose}>Cancel</Button>
          <Button variant="contained" onClick={handleSave} sx={{ marginLeft: 2 }}>Save</Button>
        </Box>
      </Box>
    </Modal>
  );
}

export default EditPopup;
