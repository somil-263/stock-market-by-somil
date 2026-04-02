import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchPortfolioAPI } from '../services/tradeService';
import useBinanceTicker from '../hooks/useBinanceTicker';

const COINS = [
  { id: 'BTCUSDT', name: 'Bitcoin', icon: '₿' },
  { id: 'ETHUSDT', name: 'Ethereum', icon: '⧫' },
  { id: 'SOLUSDT', name: 'Solana', icon: '◎' },
  { id: 'DOGEUSDT', name: 'Dogecoin', icon: 'Ð' },
  { id: 'XRPUSDT', name: 'Ripple', icon: '✕' },
  { id: 'ADAUSDT', name: 'Cardano', icon: '₳' },
  { id: 'DOTUSDT', name: 'Polkadot', icon: '●' },
  { id: 'MATICUSDT', name: 'Polygon', icon: '⬢' }
];

function Home() {
  const navigate = useNavigate();
  const [balance, setBalance] = useState(0);
  const [loading, setLoading] = useState(true);
  
  const marketData = useBinanceTicker(COINS.map(c => c.id));

  useEffect(() => {
    fetchPortfolioAPI()
      .then(data => setBalance(data.currentBalance))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const getPriceColor = (current, prev) => {
    if (!prev || current === prev) return 'text-slate-200';
    return current > prev ? 'text-emerald-400' : 'text-red-400';
  };

  if (loading) return <div className="text-center text-indigo-400 mt-20 animate-pulse font-bold">Connecting to Market...</div>;

  return (
    <div className="animate-fade-in max-w-7xl mx-auto pb-10">
      
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-4 bg-slate-900/50 p-6 rounded-2xl border border-slate-800">
        <div>
          <h1 className="text-3xl font-extrabold text-white mb-2">Market Overview</h1>
          <p className="text-sm text-emerald-400 font-bold flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping absolute"></span>
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 relative"></span>
            Market is Live
          </p>
        </div>
        <div className="text-right">
          <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-1">Available Funds</p>
          <p className="text-3xl font-black text-white">${Number(balance).toLocaleString('en-US', { minimumFractionDigits: 2 })}</p>
        </div>
      </div>

      <h2 className="text-xl font-bold text-slate-200 mb-4 px-2">Top Crypto Assets</h2>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {COINS.map((coin) => {
          const data = marketData[coin.id] || { price: 0, change: 0, prev: 0 };
          const isUp = data.change >= 0;

          return (
            <div 
              key={coin.id} 
              onClick={() => navigate(`/app/trade/${coin.id}`, { state: { price: data.price, name: coin.name } })}
              className="bg-slate-900 rounded-2xl p-6 border border-slate-800 hover:border-indigo-500/50 hover:bg-slate-800/80 transition-all cursor-pointer relative overflow-hidden"
            >
              <div className={`absolute -right-8 -bottom-8 w-32 h-32 rounded-full blur-3xl opacity-[0.15] ${isUp ? 'bg-emerald-500' : 'bg-red-500'}`}></div>

              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-xl border border-slate-700">{coin.icon}</div>
                <div>
                  <h3 className="font-bold text-white text-lg leading-tight">{coin.id}</h3>
                  <p className="text-xs text-slate-400">{coin.name}</p>
                </div>
              </div>

              <div>
                <p className={`text-2xl font-black transition-colors duration-300 ${getPriceColor(data.price, data.prev)}`}>
                  ${data.price > 0 ? data.price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 4 }) : '...'}
                </p>
                <span className={`text-sm font-bold mt-1 block ${isUp ? 'text-emerald-500' : 'text-red-500'}`}>
                  {isUp ? '▲' : '▼'} {(Math.abs(data.change) || 0).toFixed(2)}%
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Home;