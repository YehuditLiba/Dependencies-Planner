import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from './components/Login'; // הנתיב לקובץ LoginPage.jsx
import MainTable from './components/MainTable'; // הנתיב לקובץ MainTable.jsx

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/MainTable" element={<MainTable />} />
      </Routes>
    </Router>
  );
};

export default App;