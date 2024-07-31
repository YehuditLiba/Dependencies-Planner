import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from './components/Login'; // הנתיב לקובץ LoginPage.jsx
import MainTable from './components/MainTable'; // הנתיב לקובץ MainTable.jsx
import AdminSettings from './components/AdminSettings';// הנתיב לקובץ AdminSettings.jsx

const App = () => {
  const [emailRequestor, setEmailRequestor] = useState('');

  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage emailRequestor={emailRequestor} setEmailRequestor={setEmailRequestor} />} />
        <Route path="/MainTable" element={<MainTable emailRequestor={emailRequestor} />} />
        <Route path="/admin-settings" element={<AdminSettings />} />
      </Routes>
    </Router>
  );
};

export default App;
