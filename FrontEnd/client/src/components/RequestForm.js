import React, { useState,useEffect } from 'react';
import { Chip,TextField, Select, MenuItem, FormControl, InputLabel, Button, Box } from '@mui/material';
import axios from 'axios';
import { quarters } from '../config/quarters';

export default function RequestForm({ onClose }) {
  const [emailRequestor,setEmailRequestor]=useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [requestorName, setRequestorName] = useState('');
  const [priority, setPriority] = useState('');
  const [comments, setComments] = useState('');
  const [groups, setGroups] = useState([]);
  const [affectedGroupList, setAffectedGroupList] = useState([]);
  const [requestGroup, setRequestGroup] = useState('');
  const [planned, setPlanned] = useState('');
  const[jiraLink,setJiraLink] =useState('')
  useEffect(() => {
    // Fetch groups from the server
    const fetchGroups = async () => {
      try {
        const response = await axios.get('http://localhost:3001/api/groups');
        setGroups(response.data);
      } catch (error) {
        console.error('Failed to fetch groups', error);
      }
    };

    fetchGroups();
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      await axios.post('http://localhost:3001/api/requests/createRequest', {
        title,
        description,
        requestorName,
        emailRequestor,
        priority,
        comments,
        affectedGroupList,
        requestGroup,
        planned,
        jiraLink
      });
      // איפוס השדות לאחר ההוספה המוצלחת
      setTitle('');
      setDescription('');
      setRequestorName('');
      setPriority('');
      setComments('');
      setRequestGroup('');
      setAffectedGroupList([]);
      setPlanned('')
      alert('Request added successfully!');
      onClose(); // סגירת החלון הקופץ
    } catch (error) {
      console.error('Failed to add request', error);
      alert('Failed to add request');
    }
  };

  const handleGroupChange = (event) => {
    const value=event.target.value;
    // const {
    //   target: { value },
    // } = event;
    setAffectedGroupList(
      typeof value === 'string' ? value.split(',') : value.map(groupId => Number(groupId))
    );
  };

  return (
    <Box
      component="form"
      noValidate
      autoComplete="off"
      onSubmit={handleSubmit}
      sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', maxWidth: 400, margin: '0 auto', padding: 2, maxHeight: '90vh', overflowY: 'auto'}}
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
      <TextField
        required
        id="emailRequestor"
        label="Requestor email"
        fullWidth
        margin="normal"
        value={emailRequestor}
        onChange={(e) => setEmailRequestor(e.target.value)}
      />
      {/* //קבוצה מבקשת */}
      <FormControl fullWidth margin="normal">
        <InputLabel id="group-label">Group</InputLabel>
        <Select
          labelId="group-label"
          id="group"
          value={requestGroup}
          onChange={(e) => setRequestGroup(e.target.value)}
        >
          {groups.map((group) => (
            <MenuItem key={group.id} value={group.name}>
              {group.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
{/* בחירת ריבעון */}
      <FormControl fullWidth margin="normal">
        <InputLabel id="quarter-label">Quarter</InputLabel>
        <Select
          labelId="quarter-label"
          id="quarter"
          value={planned}
          onChange={(e) => setPlanned(e.target.value)}
        >
          {quarters.map((quarter, index) => (
            <MenuItem key={index} value={quarter}>
              {quarter}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <FormControl fullWidth margin="normal">
        <InputLabel id="priority-label">Priority</InputLabel>
        <Select
          labelId="priority-label"
          id="priority"
          value={priority}
          onChange={(e) => setPriority(e.target.value)}
        >
          <MenuItem value="S">Low</MenuItem>
          <MenuItem value="M">Medium</MenuItem>
          <MenuItem value="L">High</MenuItem>
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


      <FormControl fullWidth margin="normal">
        <InputLabel id="group-label">Groups</InputLabel>
        <Select
          labelId="group-label"
          id="group"
          multiple
          value={affectedGroupList}
          onChange={handleGroupChange}
          renderValue={(selected) => (
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
              {selected.map((value) => (
                <Chip key={value} label={groups.find(group => group.id === value)?.name} />
              ))}
            </Box>
          )}
        >
          {groups.map((group) => (
            <MenuItem key={group.id} value={group.id}>
              {group.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      
      {/* קישור לגירה */}
      <TextField
        required
        id="jiraLink"
        label="jiraLink"
        fullWidth
        margin="normal"
        value={jiraLink}
        onChange={(e) => setJiraLink(e.target.value)}
      />

      <Button variant="contained" color="primary" type="submit" sx={{ marginTop: 2 }}>
        הוספת בקשה
      </Button>
    </Box>
  );
}