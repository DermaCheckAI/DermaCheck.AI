import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useEffect } from 'react';
import Home from './pages/Home';
import Register from './pages/Register';
import Analysis from './pages/Analysis';
// import History from './pages/History';
import Suggestions from './pages/Suggestions';

export default function App() {
  useEffect(() => {
    // Initialize test user if not exists
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
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/analysis" element={<Analysis />} />
        {/* <Route path="/history" element={<History />} /> */}
        <Route path="/suggestions" element={<Suggestions />} />
        
      </Routes>
    </Router>
  );
}
