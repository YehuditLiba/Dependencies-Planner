import React ,{useState} from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from './components/Login'; // הנתיב לקובץ LoginPage.jsx
import MainTable from './components/MainTable'; // הנתיב לקובץ MainTable.jsx

const App = () => {
  const [emailRequestor, setEmailRequestor] = useState('');
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage emailRequestor={emailRequestor} setEmailRequestor={setEmailRequestor} />} />
        <Route path="/MainTable" element={<MainTable emailRequestor={emailRequestor} />} />
      </Routes>
    </Router>
  );
};

export default App;