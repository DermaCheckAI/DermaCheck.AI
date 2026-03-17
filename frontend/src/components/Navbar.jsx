import { Link } from 'react-router-dom';
import { logout } from '../firebase';

export default function Navbar({ showRegisterButton = true }) {

  const handleLogout = async () => {
    try {
      await logout();
window.location.replace("/login");
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
        <Link to="/" className="text-gray-300 hover:text-cyan-400 font-medium transition-colors flex items-center h-full">Home</Link>
        <Link to="/analysis" className="text-gray-300 hover:text-cyan-400 font-medium transition-colors flex items-center h-full">Analysis</Link>
        <Link to="/suggestions" className="text-gray-300 hover:text-cyan-400 font-medium transition-colors flex items-center h-full">Suggestions</Link>
        <Link to="/diseaseinfo" className="text-gray-300 hover:text-cyan-400 font-medium transition-colors flex items-center h-full">Diseaseinfo</Link>

        {/* 🔴 Logout Button */}
        {/* <button
          onClick={handleLogout}
          className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded-lg text-white"
        >
          Logout
        </button> */}

      </div>

    </nav>
  );
}