import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Register';
import Analysis from './pages/Analysis';
import Suggestions from './pages/Suggestions';
import DiseaseInfo from './pages/DiseaseInfo';
import History from './pages/History';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function App() {
  return (
    <>
      {/* ToastContainer stays here to catch events from all pages */}
      <ToastContainer theme="dark" position="top-right" />
      
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/analysis" element={<Analysis />} />
        <Route path="/suggestions" element={<Suggestions />} />
        <Route path="/diseaseinfo" element={<DiseaseInfo />} />
        <Route path="/history" element={<History />} />
      </Routes>
    </>
  );
}