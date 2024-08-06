import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, TextField, MenuItem, Select, InputLabel, FormControl,Checkbox, ListItemText } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const AdminSettings = () => {
  const [groups, setGroups] = useState([]);
  const [productManagers, setProductManagers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editingGroupId, setEditingGroupId] = useState(null);
  const [editingGroupName, setEditingGroupName] = useState('');
  const [editingProductManagerName, setEditingProductManagerName] = useState('');
  const [editingProductManagerEmail, setEditingProductManagerEmail] = useState('');
  const [editingProductManagerGroupId, setEditingProductManagerGroupId] = useState('');
  const [newGroupName, setNewGroupName] = useState('');
  const [addingGroup, setAddingGroup] = useState(false);
  const [selectedProductManager, setSelectedProductManager] = useState('');
  const [newProductManagerName, setNewProductManagerName] = useState('');
  const [newProductManagerEmail, setNewProductManagerEmail] = useState('');
  const [newProductManagerGroupId, setNewProductManagerGroupId] = useState('');
  
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const groupsResponse = await axios.get('http://localhost:3001/api/groups');
        const productManagersResponse = await axios.get('http://localhost:3001/api/productManagers');
        console.log('Fetched Groups:', groupsResponse.data); 
        console.log('Fetched Product Managers:', productManagersResponse.data);
        setGroups(groupsResponse.data);
        setProductManagers(productManagersResponse.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);
  const handleGroupChange = async (groupId) => {
    if (editingGroupId === null) return;

    try {
        await axios.put(`http://localhost:3001/api/groups/${groupId}`, { name: editingGroupName });
        setGroups(groups.map(group => (group.id === groupId ? { ...group, name: editingGroupName } : group)));
        setEditingGroupId(null);
    } catch (error) {
        console.error('Error updating group:', error);
    }
};



  const handleAddGroup = async () => {
    if (!newGroupName) return;
    try {
      const response = await axios.post('http://localhost:3001/api/groups', { name: newGroupName });
      const newGroup = response.data;
      let updatedProductManagers = [...productManagers];
      if (newProductManagerEmail) {
        if (selectedProductManager) {
          // אם מנהל המוצר קיים, עדכן אותו
          const pmToUpdate = updatedProductManagers.find(pm => pm.email === selectedProductManager);
          const updatedGroupIds = [...pmToUpdate.group_ids, newGroup.id];
          
          await axios.put(`http://localhost:3001/api/editProductManagers/${selectedProductManager}`, {
            name: pmToUpdate.name,
            email: pmToUpdate.email,
            group_ids: updatedGroupIds
          });
          // עדכן את הרשימה של מנהלי המוצר
          updatedProductManagers = updatedProductManagers.map(pm =>
            pm.email === selectedProductManager
              ? { ...pm, group_ids: updatedGroupIds }
              : pm
          );
        } 
        else {
          // אם מנהל המוצר לא קיים, הוסף אותו
          const newPMResponse = await axios.post('http://localhost:3001/api/addProductManagers', {
            name: newProductManagerName,
            email: newProductManagerEmail,
            group_ids: [newGroup.id]
          });
          console.log('New product manager added:', newPMResponse.data);
          updatedProductManagers.push(newPMResponse.data);
        }
      }
      
      // עדכן את הקבוצות ואת הרשימה של מנהלי המוצר
      setGroups([...groups, { name: newGroupName, id: newGroup.id }]);
      setProductManagers(updatedProductManagers);
      setNewGroupName('');
      setNewProductManagerName('');
      setNewProductManagerEmail('');
      setNewProductManagerGroupId([]);
      setSelectedProductManager('');
      setAddingGroup(false);
    } catch (error) {
      console.error('Error adding new group:', error);
    }
  };
  const handleProductManagerChange = async (email) => {
    console.log('Sending update for:', email);
    console.log('Data being sent:', {
      name: editingProductManagerName,
      group_ids: [editingProductManagerGroupId] // שולחים רק את ה-ID של הקבוצה החדשה
    });
    try {
      await axios.put(`http://localhost:3001/api/editProductManagers/${email}`, {
        name: editingProductManagerName,
        group_ids: [editingProductManagerGroupId] // שולחים רק את ה-ID של הקבוצה החדשה
      });
      console.log('Update successful');
      setProductManagers(productManagers.map(pm =>
        pm.email === email
          ? { ...pm, name: editingProductManagerName, group_ids: [...pm.group_ids, editingProductManagerGroupId] }
          : pm
      ));
      setEditingProductManagerEmail('');
    } catch (error) {
      console.error('Error updating product manager:', error);
    }
  };
  
  const handleDeleteGroup = async (groupId) => {
    try {
      await axios.delete(`http://localhost:3001/api/groups/${groupId}`);
      alert("are you sure you want to delet?");
      setGroups(groups.filter(group => group.id !== groupId));
    } catch (error) {
      console.error('Error deleting group:', error);
    }
  };
  const handleDeleteProductManager = async (email) => {
    try {
      await axios.delete(`http://localhost:3001/api/productManagers/${email}`);
      alert("are you sure you want to delet?");
      setProductManagers(productManagers.filter(pm => pm.email !== email));
    } catch (error) {
      console.error('Error deleting product manager:', error);
    }
  };
  
  
  return (
    <div>
      <Button
        variant="contained"
        color="primary"
        onClick={() => navigate('/MainTable')}
      >
        ← BACK TO MAIN TABLE
      </Button>
      <h1>Admin Settings</h1>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <>
          {!addingGroup ? (
            <Button onClick={() => setAddingGroup(true)}>Add New Group</Button>
          ) : (
            <div>
              <TextField
                value={newGroupName}
                onChange={(e) => setNewGroupName(e.target.value)}
                label="New Group Name"
              />
              <FormControl fullWidth margin="normal">
                <InputLabel>Existing Product Manager</InputLabel>
                <Select
                  value={selectedProductManager}
                  onChange={(e) => setSelectedProductManager(e.target.value)}
                >
                  <MenuItem value="">None</MenuItem>
                  {productManagers.map((pm) => (
                    <MenuItem key={pm.email} value={pm.email}>
                      {pm.name} ({pm.email})
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <TextField
                value={newProductManagerName}
                onChange={(e) => setNewProductManagerName(e.target.value)}
                label="New Product Manager Name"
              />
              <TextField
                value={newProductManagerEmail}
                onChange={(e) => setNewProductManagerEmail(e.target.value)}
                label="New Product Manager Email"
              />
              <Button onClick={handleAddGroup}>Save</Button>
              <Button onClick={() => setAddingGroup(false)}>Cancel</Button>
            </div>
          )}
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{ backgroundColor: '#f5f5f5', fontWeight: 'bold' }}>GROUPS</TableCell>
                <TableCell sx={{ backgroundColor: '#f5f5f5', fontWeight: 'bold' }}>PRODUCT MANAGERS</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {groups.map((group) => (
                <TableRow key={`group-${group.id}`}>
                  <TableCell>
                    {editingGroupId === group.id ? (
                      <div>
                        <TextField
                          value={editingGroupName}
                          onChange={(e) => setEditingGroupName(e.target.value)}
                          label="Group Name"
                        />
                        <Button onClick={() => handleGroupChange(group.id)}>Save</Button>
                        <Button onClick={() => setEditingGroupId(null)}>Cancel</Button>
                      </div>
                    ) : (
                      <div>
                        <span>{group.name}</span>
                        <Button
                          onClick={() => {
                            setEditingGroupId(group.id);
                            setEditingGroupName(group.name);
                          }}
                        >
                          Edit
                        </Button>
                        <Button
                            onClick={() => handleDeleteGroup(group.id)}
                            color="error"
                          >
                            Delete
                          </Button>
                      </div>
                    )}
                  </TableCell>
                    <TableCell>
                      {productManagers
                        .filter(pm => pm.group_ids.includes(group.id))
                        // .filter((pm) => Array.isArray(pm.group_ids) && pm.group_ids.includes(group.id))
                        .map((pm) => (
                          <div key={`pm-${pm.email}`}>
                            {editingProductManagerEmail === pm.email ? (
                              <div>
                                <TextField
                                  value={editingProductManagerName}
                                  onChange={(e) => setEditingProductManagerName(e.target.value)}
                                  autoFocus
                                  label="Name"
                                />
                                <TextField
                                  value={editingProductManagerEmail}
                                  onChange={(e) => setEditingProductManagerEmail(e.target.value)}
                                  label="Email"
                                />
                                <FormControl fullWidth margin="normal">
                              <InputLabel>Group IDs</InputLabel>
                              <Select
                                multiple
                                value={editingProductManagerGroupId}
                                onChange={(e) => setEditingProductManagerGroupId(e.target.value)}
                                renderValue={(selected) => (
                                  <div>
                                    {selected.map((value) => (
                                      <span key={value}>{groups.find(group => group.id === value)?.name}</span>
                                    ))}
                                  </div>
                                )}
                              >
                                {groups.map((group) => (
                                  <MenuItem key={group.id} value={group.id}>
                                  <Checkbox checked={editingProductManagerGroupId.includes(group.id)} />
                                  <ListItemText primary={group.name} />
                                </MenuItem>
                                ))}
                              </Select>
                            </FormControl>
                                <Button onClick={() => handleProductManagerChange(pm.email)}>Save</Button>
                                <Button onClick={() => setEditingProductManagerEmail('')}>Cancel</Button>
                              </div>
                            ) : (
                              <div>
                                <span>{pm.name} ({pm.email})</span>
                                <Button
                                  onClick={() => {
                                    setEditingProductManagerEmail(pm.email);
                                    setEditingProductManagerName(pm.name);
                                    setEditingProductManagerGroupId(pm.group_ids);
                                  }}
                                >
                                  Edit
                                </Button>
                                <Button
                                  onClick={() => handleDeleteProductManager(pm.email)}
                                  color="error"
                                >
                                  Delete
                                </Button>
                              </div>
                            )}
                          </div>
                        ))}
                </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        </>
      )}
    </div>
  );
};

export default AdminSettings;
