import React, { useState } from 'react';
import axios from 'axios';
import { IconButton, Modal, Box, Typography, Button } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

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
  const [error, setError] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  console.log("עעעעעעעעעעעע"+email)

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    setError('');
    setIsDeleting(false);
  };

  const handleDelete = async () => {
    console.log("ייייייייייייייייייייייי"+email)
    setIsDeleting(true);
    try {
      await axios.delete(`http://localhost:3001/api/deleteRequests/${id}`, {
        data: { requestorEmail: email }
      });
      onDelete(id);
      handleClose();
    } catch (error) {
      if (error.response && error.response.status === 403) {
        setError('You do not have permission to delete this request.');
      } else {
        setError('An error occurred while deleting the request.');
      }
      setIsDeleting(false);
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
          {!error && !isDeleting && (
            <>
              <Typography id="delete-modal-description" sx={{ mt: 2 }}>
                Are you sure you want to delete this request?
              </Typography>
              <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
                <Button onClick={handleClose} sx={{ mr: 1 }}>No</Button>
                <Button onClick={handleDelete} variant="contained" color="error">Yes</Button>
              </Box>
            </>
          )}
          {isDeleting && !error && (
            <Typography sx={{ mt: 2 }}>
              Deleting request...
            </Typography>
          )}
          {error && (
            <>
              <Typography color="error" sx={{ mt: 2 }}>
                {error}
              </Typography>
              <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
                <Button onClick={handleClose}>Close</Button>
              </Box>
            </>
          )}
        </Box>
      </Modal>
    </>
  );
};

export default DeleteRequest;