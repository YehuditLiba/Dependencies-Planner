import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button } from '@mui/material';

const AdminSettings = () => {
  const [groups, setGroups] = useState([]);
  const [productManagers, setProductManagers] = useState([]);
  const [loading, setLoading] = useState(false);

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

  return (
    <div>
      <Button variant="contained" color="primary" onClick={() => {}}>
        Admin Settings
      </Button>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Group</TableCell>
                <TableCell>Product Managers</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {groups.map((group) => (
                <TableRow key={group.id}>
                  <TableCell>{group.name}</TableCell>
                  <TableCell>
                    {productManagers
                      .filter((pm) => pm.group_id === group.id)
                      .map((pm) => pm.name)
                      .join(', ') || 'No managers'}
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
