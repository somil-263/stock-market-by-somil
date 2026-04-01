import React from 'react';
import { useNavigate } from 'react-router-dom';

function Navbar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    if(!window.confirm('Are you sure you want to logout?')){
      return;
    }
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <nav className="bg-slate-900 border-b border-slate-800 px-6 py-4 flex justify-between items-center sticky top-0 z-50">
      <div className="text-xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white to-indigo-300">
        Empire <span className="text-indigo-400">Trading</span>
      </div>
      
      <div className="flex items-center gap-4">
        <span className="text-slate-300 font-medium hidden sm:block">Welcome, Trader</span>
        <button 
          onClick={handleLogout}
          className="bg-slate-800 hover:bg-slate-700 text-red-400 hover:text-red-300 px-4 py-2 rounded-lg font-semibold transition-colors border border-slate-700 hover:border-red-900/50"
        >
          Logout
        </button>
      </div>
    </nav>
  );
}

export default Navbar;