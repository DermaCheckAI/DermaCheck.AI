import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Register from './pages/Register';
import Analysis from './pages/Analysis';
import Suggestions from './pages/Suggestions';
import DiseaseInfo from './pages/DiseaseInfo';
import History from './pages/History';
//import Recommendations from "./pages/Recommendations";

import { useEffect } from 'react';

export default function App() {
  useEffect(() => {
    const existingUser = localStorage.getItem('user');
    if (!existingUser) {
      const testUser = {
        id: 1,
        email: 'test@example.com',
        fullName: 'Test User',
        mobile: '9876543210'
      };
      localStorage.setItem('user', JSON.stringify(testUser));
      localStorage.setItem('token', 'test-token-12345');
    }
  }, []);

  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/register" element={<Register />} />
      <Route path="/analysis" element={<Analysis />} />
      <Route path="/suggestions" element={<Suggestions />} />
      <Route path="/diseaseinfo" element={<DiseaseInfo />} />
      <Route path="/history" element={<History />} />
      {/* <Route path="/recommendations" element={<Recommendations />} /> */}

    </Routes>
  );
}
