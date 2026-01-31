import { Link, useLocation } from 'react-router-dom';

export default function Navbar({ showRegisterButton = true }) {
  const location = useLocation();

  // Login (/) आणि Register page वर menu hide
  const hideMenu =
    location.pathname === '/' ||
    location.pathname === '/register';

  return (
    <nav className="relative z-10 w-full h-20 bg-white bg-opacity-5 backdrop-blur-md border-b border-cyan-500 border-opacity-20 flex items-center justify-between px-8 shadow-lg">
      
      {/* LOGO */}
      <div className="flex items-center gap-4 h-full">
        <Link
          to="/"
          className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent flex items-center h-full"
        >
          DermaCheck.AI
        </Link>
      </div>

      {/* MENU ITEMS (Home, Analysis, History, Suggestions) */}
      {!hideMenu && (
        <div className="flex items-center gap-6 h-full">
          <Link to="/" className="text-gray-300 hover:text-cyan-400 font-medium transition-colors flex items-center h-full">Home</Link>
          <Link to="/analysis" className="text-gray-300 hover:text-cyan-400 font-medium transition-colors flex items-center h-full">Analysis</Link>
          <Link to="/history" className="text-gray-300 hover:text-cyan-400 font-medium transition-colors flex items-center h-full">History</Link>
          <Link to="/suggestions" className="text-gray-300 hover:text-cyan-400 font-medium transition-colors flex items-center h-full">Suggestions</Link>
        </div>
      )}

      {/* REGISTER BUTTON (always visible) */}
      {showRegisterButton && (
        <Link
          to="/register"
          className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-semibold px-6 py-2 rounded-lg shadow-lg hover:shadow-cyan-500/50 transition-all flex items-center h-fit"
        >
          Register
        </Link>
      )}
    </nav>
  );
}
