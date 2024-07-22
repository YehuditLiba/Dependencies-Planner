// EditPopup.js
import React, { useState } from 'react';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';

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

function EditPopup({ open, handleClose, value, onSave }) {
  const [editValue, setEditValue] = useState(value);

  const handleSave = () => {
    onSave(editValue);
    handleClose();
  };

  return (
    <Modal open={open} onClose={handleClose}>
      <Box sx={modalStyle}>
        <TextField
          label="Edit"
          variant="outlined"
          fullWidth
          value={editValue}
          onChange={(e) => setEditValue(e.target.value)}
        />
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', marginTop: 2 }}>
          <Button onClick={handleClose}>Cancel</Button>
          <Button variant="contained" onClick={handleSave} sx={{ marginLeft: 2 }}>Save</Button>
        </Box>
      </Box>
    </Modal>
  );
}

export default EditPopup;
