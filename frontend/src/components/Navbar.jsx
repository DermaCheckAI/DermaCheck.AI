import { Link } from 'react-router-dom';

import { useTranslation } from "react-i18next";

export default function Navbar({ showRegisterButton = true }) {
 //changes made by vaishnavi
  const { i18n } = useTranslation();

  const changeLang = (lang) => {
    i18n.changeLanguage(lang);
  };
  //changes made by vaishnavi

  return (
    <nav className="relative z-10 w-full h-20 bg-white bg-opacity-5 backdrop-blur-md border-b border-cyan-500 border-opacity-20 flex items-center justify-between px-8 shadow-lg">
      <div className="flex items-center gap-4 h-full">
        <Link to="/" className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent flex items-center h-full">DermaCheck.AI</Link>
      </div>
      <div className="flex items-center gap-6 h-full">
        <Link to="/" className="text-gray-300 hover:text-cyan-400 font-medium transition-colors flex items-center h-full">Home</Link>
        <Link to="/analysis" className="text-gray-300 hover:text-cyan-400 font-medium transition-colors flex items-center h-full">Analysis</Link>
        <Link to="/history" className="text-gray-300 hover:text-cyan-400 font-medium transition-colors flex items-center h-full">History</Link>
        <Link to="/suggestions" className="text-gray-300 hover:text-cyan-400 font-medium transition-colors flex items-center h-full">Suggestions</Link>
        <Link to="/dashboard" className="text-gray-300 hover:text-cyan-400 font-medium transition-colors flex items-center h-full">Dashboard</Link>
        {showRegisterButton && (
          <Link to="/register" className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-semibold px-6 py-2 rounded-lg shadow-lg hover:shadow-cyan-500/50 transition-all flex items-center h-fit">Register</Link>
        )}
      </div>

      {/*changes made by vaishnavi*/}

      {/* ⭐ Language Switch Buttons */}
        <div className="flex gap-2">
          <button
            onClick={() => changeLang("en")}
            className="px-3 py-1 bg-gray-800 text-white rounded-md hover:bg-gray-700"
          >
            EN
          </button>

          {/*MR Button*/}
          <button 
        onClick={() => changeLang("mr")}
        className="px-3 py-1 bg-gray-800 text-white rounded-md hover:bg-gray-700"
      >
        MR
      </button>
      {/*HI Button*/}

      <button 
        onClick={() => changeLang("hi")}
        className="px-3 py-1 bg-gray-800 text-white rounded-md hover:bg-gray-700"
      >
      
       HI
          </button>

         
    </div>
         

      
  </nav>
  );
}


  
  


