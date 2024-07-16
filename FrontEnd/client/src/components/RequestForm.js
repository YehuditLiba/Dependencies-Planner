import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Button,
  TextField,
  MenuItem,
  Select,
  Checkbox,
  FormControl,
  InputLabel,
  ListItemText,
  Input,
  Grid,
  FormHelperText,
} from '@mui/material';

const getCurrentQuarter = () => {
  const month = new Date().getMonth() + 1; // getMonth() is zero-based
  const year = new Date().getFullYear();
  let quarter;

  if (month <= 3) {
    quarter = 'Q1';
  } else if (month <= 6) {
    quarter = 'Q2';
  } else if (month <= 9) {
    quarter = 'Q3';
  } else {
    quarter = 'Q4';
  }

  return `${year} ${quarter}`;
};

const RequestForm = ({ onSubmit, groups }) => {
  const [requestorGroup, setRequestorGroup] = useState('');
  const [requestorName, setRequestorName] = useState('');
  const [title, setTitle] = useState('');
  const [planned, setPlanned] = useState(getCurrentQuarter());
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('');
  const [dependencyGroups, setDependencyGroups] = useState([]);
  const [jiraLink, setJiraLink] = useState('');
  const [comments, setComments] = useState('');
  const [errors, setErrors] = useState({
    requestorGroup: '',
    requestorName: '',
    title: '',
    description: '',
    priority: '',
    comments: '',
  });

  useEffect(() => {
    // Fetch dependency groups from server
    const fetchGroups = async () => {
      try {
        const response = await axios.get('http://localhost:3001/api/groups');
        groups(response.data); // Assuming response.data is an array of groups
      } catch (error) {
        console.error('Error fetching groups:', error);
      }
    };

    fetchGroups();
  }, []);

  const handleChange = (event, setState) => {
    setState(event.target.value);
  };

  const handleMultiSelectChange = (event) => {
    const {
      target: { value },
    } = event;
    setDependencyGroups(value);
  };

  const validate = () => {
    const newErrors = {};

    if (!requestorGroup) {
      newErrors.requestorGroup = 'Requestor group is required';
    }

    if (!requestorName) {
      newErrors.requestorName = 'Requestor name is required';
    }

    if (!title) {
      newErrors.title = 'Title is required';
    }

    if (!description) {
      newErrors.description = 'Description is required';
    }

    if (!priority) {
      newErrors.priority = 'Priority is required';
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!validate()) {
      return;
    }

    const newRequest = {
      ID: '', // Ensure this is generated or handled by the server
      requestorGroup,
      requestorName,
      title,
      planned,
      description,
      priority,
      finalDecision: false, // Assuming it's not part of the form input
      comments,
      dateTime: new Date().toISOString(), // Example of formatting date-time
      affectedGroupList: dependencyGroups,
      jiraLink,
      emailRequestor: '', // Assuming it's not part of the form input
    };

    try {
      await onSubmit(newRequest); // Assuming onSubmit function handles the API call
      // Clear form fields after submission
      setRequestorGroup('');
      setRequestorName('');
      setTitle('');
      setPlanned(getCurrentQuarter());
      setDescription('');
      setPriority('');
      setDependencyGroups([]);
      setJiraLink('');
      setComments('');
      setErrors({});
    } catch (error) {
      console.error('Error saving request:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <Grid container spacing={2}>
        <Grid item xs={6}>
          <TextField
            label="Requestor Group"
            value={requestorGroup}
            onChange={(event) => handleChange(event, setRequestorGroup)}
            fullWidth
            error={!!errors.requestorGroup}
            helperText={errors.requestorGroup}
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            label="Requestor Name"
            value={requestorName}
            onChange={(event) => handleChange(event, setRequestorName)}
            fullWidth
            error={!!errors.requestorName}
            helperText={errors.requestorName}
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            label="Title"
            value={title}
            onChange={(event) => handleChange(event, setTitle)}
            fullWidth
            error={!!errors.title}
            helperText={errors.title}
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            label="Planned"
            value={planned}
            onChange={(event) => handleChange(event, setPlanned)}
            fullWidth
            disabled
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            label="Description"
            value={description}
            onChange={(event) => handleChange(event, setDescription)}
            fullWidth
            error={!!errors.description}
            helperText={errors.description}
          />
        </Grid>
        <Grid item xs={6}>
          <FormControl fullWidth>
            <InputLabel>Priority</InputLabel>
            <Select
              value={priority}
              onChange={(event) => handleChange(event, setPriority)}
              fullWidth
              error={!!errors.priority}
              input={<Input />}
            >
              <MenuItem value="Critical">Critical</MenuItem>
              <MenuItem value="High">High</MenuItem>
              <MenuItem value="Medium">Medium</MenuItem>
              <MenuItem value="Low">Low</MenuItem>
            </Select>
            <FormHelperText>Select priority</FormHelperText>
          </FormControl>
        </Grid>
        <Grid item xs={6}>
          <TextField
            label="Jira Link"
            value={jiraLink}
            onChange={(event) => handleChange(event, setJiraLink)}
            fullWidth
          />
        </Grid>
        <Grid item xs={12}>
          <FormControl fullWidth>
            <InputLabel>Dependency Groups</InputLabel>
            <Select
              multiple
              value={dependencyGroups}
              onChange={handleMultiSelectChange}
              input={<Input />}
              renderValue={(selected) => selected.join(', ')}
            >
              {groups.map((group) => (
                <MenuItem key={group.id} value={group.id}>
                  <Checkbox checked={dependencyGroups.indexOf(group.id) > -1} />
                  <ListItemText primary={group.name} />
                </MenuItem>
              ))}
            </Select>
            <FormHelperText>Select one or more groups</FormHelperText>
          </FormControl>
        </Grid>
        <Grid item xs={12}>
          <TextField
            label="Comments"
            value={comments}
            onChange={(event) => handleChange(event, setComments)}
            fullWidth
          />
        </Grid>
        <Grid item xs={12}>
          <Button variant="contained" color="primary" type="submit">
            Save
          </Button>
        </Grid>
      </Grid>
    </form>
  );
};

export default RequestForm;
