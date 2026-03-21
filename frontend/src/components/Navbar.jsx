import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom'; // 1. Added useNavigate
import { auth, logout } from '../firebase';
import { onAuthStateChanged } from 'firebase/auth';
import Translate from './Translate';

export default function Navbar({ showRegisterButton = true }) {
  const [user, setUser] = useState(null);
  const navigate = useNavigate(); // 2. Initialize navigate

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
  try {
    await logout(); 
    // No need for navigate("/") here! 
    // App.jsx will catch the 'null' user and move you automatically.
  } catch (error) {
    console.error(error);
  }
};
  

  return (
    <nav className="relative z-10 w-full h-20 bg-white bg-opacity-5 backdrop-blur-md border-b border-cyan-500 border-opacity-20 flex items-center justify-between px-8 shadow-lg">
      
      <div className="flex items-center gap-4 h-full">
        <Link to="/" className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent flex items-center h-full">
          DermaCheck.AI
        </Link>
      </div>

      <div className="flex items-center gap-6 h-full">
        {/* Only show Home if NOT logged in */}
        {!user && (
          <Link to="/" className="text-gray-300 hover:text-cyan-400 font-medium transition-colors flex items-center h-full">
            Home
          </Link>
        )}

        <Link to="/analysis" className="text-gray-300 hover:text-cyan-400 font-medium transition-colors flex items-center h-full">Analysis</Link>
        <Link to="/suggestions" className="text-gray-300 hover:text-cyan-400 font-medium transition-colors flex items-center h-full">Suggestions</Link>
        <Link to="/diseaseinfo" className="text-gray-300 hover:text-cyan-400 font-medium transition-colors flex items-center h-full">Diseaseinfo</Link>

        <Translate/>

        {/* Show Logout if user is logged in */}
        {user && (
          <button 
            onClick={handleLogout}
            className="bg-red-500/20 hover:bg-red-500/40 border border-red-500 text-red-100 px-4 py-2 rounded-lg transition-all"
          >
            Logout
          </button>
        )}
        {/*  */}
      </div>
    </nav>
  );
}