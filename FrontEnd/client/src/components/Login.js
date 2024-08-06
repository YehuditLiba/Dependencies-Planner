import React, { useState } from 'react';
import { TextField, Button, Typography, Box, Alert } from '@mui/material';
import LockIcon from '@mui/icons-material/Lock';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../designs/Login.css';
import Header from './Header';

const LoginPage = ({ emailRequestor, setEmailRequestor }) => {
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    try {
      const response = await axios.get('http://localhost:3001/api/productManagers');
      const managers = response.data;
      const managerExists = managers.some(manager => manager.email === emailRequestor);
      if (managerExists) {
        localStorage.setItem('userEmail', emailRequestor);
        navigate('/MainTable');
      } else {
        setError('Email not found');
      }
    } catch (err) {
      console.error(err);
      setError('Server error. Please try again later.');
    }
  };

  return (
    <>
      <Header />
      <div className="login-container">
        <div className="login-box">
          <Typography component="h2" variant="h5">
            Log In
          </Typography>
          <LockIcon style={{ fontSize: 50, color: '#4caf50' }} />
          {error && <Alert severity="error">{error}</Alert>}
          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }} noValidate>
            <div className="user-box">
              <TextField
                margin="normal"
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
                autoFocus
                type="email"
                value={emailRequestor}
                onChange={(e) => setEmailRequestor(e.target.value)}
              />
            </div>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              sx={{ mt: 3, mb: 2 }}
            >
              Check Email
            </Button>
          </Box>
        </div>
        <div className="image-container">
          <img src="y.png" />
        </div>
      </div>
    </>
  );
};

export default LoginPage;
