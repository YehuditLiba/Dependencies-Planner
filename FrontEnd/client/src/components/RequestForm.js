import React, { useState, useEffect } from 'react';
import { Chip, TextField, Select, MenuItem, FormControl, InputLabel, Button, Box } from '@mui/material';
import axios from 'axios';
import { quarters } from '../config/quarters';


export default function RequestForm({ onClose ,emailRequestor}) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [requestorName, setRequestorName] = useState('');
  const [priority, setPriority] = useState('');
  const [comments, setComments] = useState('');
  const [groups, setGroups] = useState([]);
  const [affectedGroupList, setAffectedGroupList] = useState([]);
  const [requestGroup, setRequestGroup] = useState('');
  const [planned, setPlanned] = useState('');
  const [jiraLink, setJiraLink] = useState('');
  const [pm, setPm] = useState([]);
  //const [selectedQuarter, setSelectedQuarter] = useState('');
//  const [newEmail,setNewEmail]=useState('');
  useEffect(() => {
    const fetchGroups = async () => {
      try {
        const response = await axios.get('http://localhost:3001/api/groups');
        setGroups(response.data);
      } catch (error) {
        console.error('Failed to fetch groups', error);
      }
    };

    const fetchPm = async () => {
      try {
        const response = await axios.get('http://localhost:3001/api/productManagers');
        setPm(response.data);
      } catch (error) {
        console.error('Failed to fetch PMs', error);
      }
    };

    fetchPm();
    fetchGroups();
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    console.log("Current Email:", emailRequestor); // זה יציג את הערך של newEmail בקונסול

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
      setTitle('');
      setDescription('');
      setRequestorName('');
      setPriority('');
      setComments('');
      setAffectedGroupList([]);
      setRequestGroup('');
      setPlanned('');
      setJiraLink('');
     // setNewEmail('');
      alert('Request added successfully!');
      onClose();
    } catch (error) {
      console.error('Failed to add request', error);
      alert('Failed to add request');
    }
  };

  const handleGroupChange = (event) => {
    const value = event.target.value;
    setAffectedGroupList(
      typeof value === 'string' ? value.split(',') : value
    );
  };

  return (
    <Box
      component="form"
      noValidate
      autoComplete="off"
      onSubmit={handleSubmit}
      className="form"
    >
      <h2>Request Form</h2>
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
      <FormControl fullWidth margin="normal">
        <InputLabel id="requestorName-label">Requestor Name</InputLabel>
        <Select
          labelId="requestorName-label"
          id="requestorName"
          value={requestorName}
          onChange={(e) => setRequestorName(e.target.value)}
        >
          {pm.map(pm => (
            <MenuItem key={pm.id} value={pm.name}>{pm.name}</MenuItem>
          ))}
        </Select>
      </FormControl>
      <TextField
        required
        id="emailRequestor"
        label="Email Requestor"
        fullWidth
        margin="normal"
       // setNewEmail={email}
        value={emailRequestor}
      /> 
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
        id="comments"
        label="Comments"
        fullWidth
        margin="normal"
        value={comments}
        onChange={(e) => setComments(e.target.value)}
      />
      <FormControl fullWidth margin="normal">
        <InputLabel id="affectedGroup-label">Affected Groups</InputLabel>
        <Select
          labelId="affectedGroup-label"
          id="affectedGroups"
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
          {groups.map(group => (
            <MenuItem key={group.id} value={group.id}>
              {group.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <FormControl fullWidth margin="normal">
        <InputLabel id="requestGroup-label">Request Group</InputLabel>
        <Select
          labelId="requestGroup-label"
          id="requestGroup"
          value={requestGroup}
          onChange={(e) => setRequestGroup(e.target.value)}
          className="request-group-select" // Class name for styling
        >
          {quarters.map(q => (
            <MenuItem key={q.id} value={q.name}>{q.name}</MenuItem>
          ))}
        </Select>
      </FormControl>
      <FormControl fullWidth margin="normal">
      <InputLabel id="planned">planned</InputLabel>
        <Select
          labelId="Planned"
          id="planned"
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
      <TextField
        id="jiraLink"
        label="JIRA Link"
        fullWidth
        margin="normal"
        value={jiraLink}
        onChange={(e) => setJiraLink(e.target.value)}
      />
      <Box mt={2}>
        <Button variant="contained" type="submit" className="button">
          Submit
        </Button>
      </Box>
    </Box>
  );
}
