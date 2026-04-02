import React, { useState, useEffect, useRef } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';

function AppLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [allSymbols, setAllSymbols] = useState([]); 
  const [isFocused, setIsFocused] = useState(false);
  const searchRef = useRef(null);

  const isActive = (path) => location.pathname.includes(path);

  const handleLogout = () => {
    if(!window.confirm('Are you sure you want to logout?')) return;
    localStorage.removeItem('token');
    navigate('/login');
  };

  // 🌐 Binance Symbols Load Karo
  useEffect(() => {
    axios.get('https://api.binance.com/api/v3/exchangeInfo')
      .then(res => {
        const symbols = res.data.symbols
          .filter(s => s.status === "TRADING" && s.quoteAsset === "USDT")
          .map(s => s.symbol);
        setAllSymbols(symbols);
      }).catch(err => console.error(err));
  }, []);

  // 🔍 Search Suggestion Logic
  useEffect(() => {
    if (query.length > 1) {
      const filtered = allSymbols
        .filter(s => s.toLowerCase().includes(query.toLowerCase()))
        .slice(0, 8);
      setSuggestions(filtered);
    } else {
      setSuggestions([]);
    }
  }, [query, allSymbols]);

  const handleSelect = (symbol) => {
    setQuery("");
    setIsFocused(false);
    navigate(`/app/trade/${symbol}`);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white selection:bg-indigo-500/30 flex flex-col">
      
      {/* 🟢 TOP NAV (Original Gradient Logo + Search) */}
      <nav className="bg-slate-900 border-b border-slate-800 sticky top-0 z-[100]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16 gap-4">
            
            {/* Original Gradient Logo */}
            <div className="text-xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white to-indigo-300 shrink-0">
              Empire <span className="text-indigo-400">Trading</span>
            </div>

            {/* 🔍 SEARCH BAR (The New Engine) */}
            <div className="relative flex-1 max-w-md" ref={searchRef}>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-500">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                </span>
                <input
                  type="text"
                  placeholder="Search coins..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onFocus={() => setIsFocused(true)}
                  onKeyDown={(e) => e.key === 'Enter' && suggestions[0] && handleSelect(suggestions[0])}
                  className="w-full bg-slate-950/50 text-slate-200 text-sm rounded-xl py-2 pl-10 pr-4 border border-slate-800 focus:outline-none focus:border-indigo-500 transition-all"
                />
              </div>

              {isFocused && suggestions.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden z-[110]">
                  {suggestions.map((s) => (
                    <div key={s} onClick={() => handleSelect(s)} className="px-4 py-3 hover:bg-slate-800 cursor-pointer border-b border-slate-800/50 last:border-0 font-bold text-sm">
                      {s}
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            {/* Desktop Navigation Links */}
            <div className="hidden md:flex items-center space-x-2">
              <Link to="/app/home" className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${isActive('/app/home') ? 'bg-indigo-500/10 text-indigo-400' : 'text-slate-400 hover:text-slate-200'}`}>
                Home
              </Link>
              <Link to="/app/portfolio" className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${isActive('/app/portfolio') ? 'bg-indigo-500/10 text-indigo-400' : 'text-slate-400 hover:text-slate-200'}`}>
                Portfolio
              </Link>
              <Link to="/app/history" className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${isActive('/app/history') ? 'bg-indigo-500/10 text-indigo-400' : 'text-slate-400 hover:text-slate-200'}`}>
                Orders
              </Link>
              <Link to="/app/profile" className={`p-2 ml-2 rounded-full transition-all ${isActive('/app/profile') ? 'bg-indigo-500/20 text-indigo-400' : 'bg-slate-800 text-slate-300'}`}>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
              </Link>
              <button onClick={handleLogout} className="text-sm bg-slate-800 text-red-400 px-3 py-1.5 rounded-lg font-semibold border border-slate-700 ml-2">
                Logout
              </button>
            </div>

          </div>
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 pb-24 md:pb-8">
        <Outlet /> 
      </main>

      {/* 📱 MOBILE BOTTOM NAV (Original Tabs) */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-slate-900 border-t border-slate-800 z-50 px-2 pb-safe">
        <div className="flex justify-around items-center h-16">
          <Link to="/app/home" className={`flex flex-col items-center justify-center w-full h-full ${isActive('/app/home') ? 'text-indigo-400' : 'text-slate-500'}`}>
            <svg className="w-6 h-6 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path></svg>
            <span className="text-[10px] font-bold">Home</span>
          </Link>

          <Link to="/app/portfolio" className={`flex flex-col items-center justify-center w-full h-full ${isActive('/app/portfolio') ? 'text-indigo-400' : 'text-slate-500'}`}>
            <svg className="w-6 h-6 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
            <span className="text-[10px] font-bold">Portfolio</span>
          </Link>

          <Link to="/app/history" className={`flex flex-col items-center justify-center w-full h-full ${isActive('/app/history') ? 'text-indigo-400' : 'text-slate-500'}`}>
             <svg className="w-6 h-6 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"></path></svg>
            <span className="text-[10px] font-bold">Orders</span>
          </Link>

          <Link to="/app/profile" className={`flex flex-col items-center justify-center w-full h-full ${isActive('/app/profile') ? 'text-indigo-400' : 'text-slate-500'}`}>
            <svg className="w-6 h-6 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
            <span className="text-[10px] font-bold">Profile</span>
          </Link>
        </div>
      </nav>

    </div>
  );
}

export default AppLayout;