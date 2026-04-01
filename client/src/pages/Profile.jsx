import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchPortfolioAPI } from '../services/tradeService'; 

function Profile() {
  const navigate = useNavigate();
  const [balance, setBalance] = useState(0);

  useEffect(() => {
    fetchPortfolioAPI().then(data => setBalance(data.currentBalance)).catch(console.error);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <div className="animate-fade-in max-w-sm mx-auto mt-10">
      <h1 className="text-2xl font-bold text-white mb-6 text-center">My Profile</h1>
      
      <div className="bg-slate-900 rounded-3xl p-6 border border-slate-800 shadow-2xl text-center relative overflow-hidden">
        <div className="absolute -top-10 -right-10 w-32 h-32 bg-indigo-500 rounded-full blur-3xl opacity-10"></div>

        <div className="w-24 h-24 bg-gradient-to-tr from-indigo-500 to-purple-500 text-white rounded-full flex items-center justify-center mx-auto text-4xl font-bold mb-4 shadow-lg border-4 border-slate-800">
          👤
        </div>
        
        <h2 className="text-2xl font-extrabold text-white mb-1">Pro Trader</h2>
        <p className="text-slate-400 text-sm mb-6">Welcome to your Empire</p>
        
        <div className="bg-slate-800/50 rounded-2xl p-5 mb-8 border border-slate-700/50">
          <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-2">Wallet Balance</p>
          <p className="text-4xl font-extrabold text-emerald-400">
            ₹{Number(balance).toLocaleString('en-IN')}
          </p>
        </div>

        <button 
          onClick={handleLogout}
          className="w-full bg-red-500/10 hover:bg-red-500/20 text-red-500 font-bold py-4 rounded-xl transition-all border border-red-500/20 flex items-center justify-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path></svg>
          Secure Logout
        </button>
      </div>
    </div>
  );
}

export default Profile;