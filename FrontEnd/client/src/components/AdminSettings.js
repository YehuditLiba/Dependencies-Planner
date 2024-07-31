import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, TextField } from '@mui/material';
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

  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const groupsResponse = await axios.get('http://localhost:3001/api/groups');
        const productManagersResponse = await axios.get('http://localhost:3001/api/productManagers');
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

  const handleProductManagerChange = async (email) => {
    console.log('Sending update for:', email);
    try {
      await axios.put(`http://localhost:3001/api/productManagers/${email}`, {
        name: editingProductManagerName,
        group_id: editingProductManagerGroupId
      });
      console.log('Update successful');
      setProductManagers(productManagers.map(pm =>
        pm.email === email
          ? { ...pm, name: editingProductManagerName, group_id: editingProductManagerGroupId }
          : pm
      ));
      setEditingProductManagerEmail('');
    } catch (error) {
      console.error('Error updating product manager:', error);
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
                          autoFocus
                        />
                        <Button onClick={() => handleGroupChange(group.id)}>Save</Button>
                        <Button onClick={() => setEditingGroupId(null)}>Cancel</Button>
                      </div>
                    ) : (
                      <div>
                        <span>{group.name}</span>
                        <Button
                          onClick={() => {
                            console.log('Setting Group ID:', group.id);
                            setEditingGroupId(group.id);
                            setEditingGroupName(group.name);
                          }}
                        >
                          Edit
                        </Button>
                      </div>
                    )}
                  </TableCell>
                    <TableCell>
                      {productManagers
                        .filter((pm) => pm.group_id === group.id)
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
                                <TextField
                                  value={editingProductManagerGroupId}
                                  onChange={(e) => setEditingProductManagerGroupId(Number(e.target.value))}
                                  label="Group ID"
                                  type="number"
                                />
                                <Button onClick={() => handleProductManagerChange(pm.email)}>Save</Button>
                                <Button onClick={() => setEditingProductManagerEmail('')}>Cancel</Button>
                              </div>
                            ) : (
                              <div>
                                {pm.name}
                                <Button onClick={() => {
                                  console.log('Setting Product Manager Email:', pm.email);
                                  setEditingProductManagerEmail(pm.email);
                                  setEditingProductManagerName(pm.name);
                                  setEditingProductManagerGroupId(pm.group_id);
                                }}>Edit</Button>
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
      )}
    </div>
  );
};

export default AdminSettings;
