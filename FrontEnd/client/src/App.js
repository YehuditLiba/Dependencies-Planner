import React ,{useState} from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from './components/Login'; // הנתיב לקובץ LoginPage.jsx
import MainTable from './components/MainTable'; // הנתיב לקובץ MainTable.jsx

const App = () => {
  const [email, setEmail] = useState('');
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage email={email} setEmail={setEmail} />} />
        <Route path="/MainTable" element={<MainTable email={email} />} />
      </Routes>
    </Router>
  );
};

export default App;