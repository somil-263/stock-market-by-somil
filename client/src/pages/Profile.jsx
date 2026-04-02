import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchPortfolioAPI } from '../services/tradeService'; 

function Profile() {
  const navigate = useNavigate();
  const [balance, setBalance] = useState(0);
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPortfolioAPI()
      .then(data => {
        setBalance(data.currentBalance || 0);
        setUsername(data.name || "Somil"); 
      })
      .catch(console.error)
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <div className="animate-fade-in max-w-sm mx-auto mt-10 px-4">
      <h1 className="text-3xl font-black text-white mb-8 text-center tracking-tight">My Profile</h1>
      
      <div className="bg-slate-900 rounded-[2rem] p-8 border border-slate-800 shadow-2xl text-center relative overflow-hidden group">
        <div className="absolute -top-20 -right-20 w-48 h-48 bg-indigo-500 rounded-full blur-[80px] opacity-20 group-hover:opacity-40 transition-opacity duration-500"></div>
        <div className="absolute -bottom-20 -left-20 w-48 h-48 bg-purple-500 rounded-full blur-[80px] opacity-10 group-hover:opacity-30 transition-opacity duration-500"></div>

        <div className="relative w-28 h-28 mx-auto mb-5">
          <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500 to-purple-500 rounded-full animate-spin-slow opacity-50 blur-md"></div>
          <div className="relative w-full h-full bg-slate-800 text-white rounded-full flex items-center justify-center text-5xl shadow-xl border-4 border-slate-700 z-10">
            👨‍💻
          </div>
        </div>
        
        {loading ? (
          <div className="h-8 w-40 bg-slate-800 rounded-lg animate-pulse mx-auto mb-2"></div>
        ) : (
          <h2 className="text-3xl font-extrabold text-white mb-1 tracking-tight">{username}</h2>
        )}
        <p className="text-indigo-400 font-semibold text-sm mb-8 uppercase tracking-widest">Premium Trader</p>
        
        <div className="bg-slate-950/50 rounded-2xl p-6 mb-8 border border-slate-800/50 backdrop-blur-sm relative z-10">
          <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mb-3 flex items-center justify-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"></path></svg>
            Available Margin
          </p>
          
          {loading ? (
            <div className="h-10 w-32 bg-slate-800 rounded-lg animate-pulse mx-auto"></div>
          ) : (
            <p className="text-4xl font-black text-white">
              <span className="text-emerald-500">$</span>{Number(balance).toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </p>
          )}
        </div>

        <button 
          onClick={handleLogout}
          className="w-full bg-slate-800 hover:bg-red-500/10 text-slate-300 hover:text-red-500 font-bold py-4 rounded-xl transition-all duration-300 border border-slate-700 hover:border-red-500/30 flex items-center justify-center gap-2 group relative z-10"
        >
          <svg className="w-5 h-5 group-hover:rotate-12 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path></svg>
          Secure Disconnect
        </button>
      </div>
    </div>
  );
}

export default Profile;