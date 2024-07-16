import React, { useState } from 'react';
import { TextField, Select, MenuItem, FormControl, InputLabel, Button, Box } from '@mui/material';
import axios from 'axios';

export default function RequestForm({ onClose }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [requestorName, setRequestorName] = useState('');
  const [priority, setPriority] = useState('');
  const [comments, setComments] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      await axios.post('http://localhost:3001/api/requests', {
        title,
        description,
        requestorName,
        priority,
        comments
      });
      // איפוס השדות לאחר ההוספה המוצלחת
      setTitle('');
      setDescription('');
      setRequestorName('');
      setPriority('');
      setComments('');
      alert('Request added successfully!');
      onClose(); // סגירת החלון הקופץ
    } catch (error) {
      console.error('Failed to add request', error);
      alert('Failed to add request');
    }
  };

  return (
    <Box
      component="form"
      noValidate
      autoComplete="off"
      onSubmit={handleSubmit}
      sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', maxWidth: 400, margin: '0 auto', padding: 2 }}
    >
      <TextField
        required
        id="title"
        label="Title"
        fullWidth
        margin="normal"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <TextField
        required
        id="description"
        label="Description"
        fullWidth
        margin="normal"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
      <TextField
        required
        id="requestorName"
        label="Requestor Name"
        fullWidth
        margin="normal"
        value={requestorName}
        onChange={(e) => setRequestorName(e.target.value)}
      />
      <FormControl fullWidth margin="normal">
        <InputLabel id="priority-label">Priority</InputLabel>
        <Select
          labelId="priority-label"
          id="priority"
          value={priority}
          onChange={(e) => setPriority(e.target.value)}
        >
          <MenuItem value="L">Low</MenuItem>
          <MenuItem value="M">Medium</MenuItem>
          <MenuItem value="H">High</MenuItem>
        </Select>
      </FormControl>
      <TextField
        required
        id="comments"
        label="Comments"
        fullWidth
        margin="normal"
        value={comments}
        onChange={(e) => setComments(e.target.value)}
      />
      <Button variant="contained" color="primary" type="submit" sx={{ marginTop: 2 }}>
        הוספת בקשה
      </Button>
    </Box>
  );
}