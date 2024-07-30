import React, { useState } from 'react';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import axios from 'axios';

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

const DeleteRequest = ({ id, email, onDelete }) => {
  const [open, setOpen] = useState(false);
 const requestorEmail=email;
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleDelete = async () => {
    try {
      console.log(`Attempting to delete request with ID: ${id}`);
      console.log(`Attempting to delete request with requestorEmail: ${requestorEmail}`);
      await axios.delete(`http://localhost:3001/api/deleteRequests/${id}`, { requestorEmail });
      console.log(`Successfully deleted request with ID: ${id}`);
      onDelete(id);
      handleClose();
    } catch (error) {
      console.error(`Failed to delete request with ID: ${id}`, error);
      console.error(`Failed to delete request with requestorEmail: ${requestorEmail}`, error);
    }
  };

  return (
    <>
      <IconButton onClick={handleOpen}>
        <DeleteIcon />
      </IconButton>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="delete-modal-title"
        aria-describedby="delete-modal-description"
      >
        <Box sx={modalStyle}>
          <Typography id="delete-modal-title" variant="h6" component="h2">
            Delete Request
          </Typography>
          <Typography id="delete-modal-description" sx={{ mt: 2 }}>
            Are you sure you want to delete this request?
          </Typography>
          <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
            <Button onClick={handleClose} sx={{ mr: 1 }}>No</Button>
            <Button onClick={handleDelete} variant="contained" color="error">Yes</Button>
          </Box>
        </Box>
      </Modal>
    </>
  );
};

export default DeleteRequest;