import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Home() {
  const navigate = useNavigate();
  const [marketData] = useState([
    { id: 1, symbol: 'RELIANCE', name: 'Reliance Industries', price: 2950.45, change: 1.25, isUp: true },
    { id: 2, symbol: 'TCS', name: 'Tata Consultancy Services', price: 4120.00, change: 0.85, isUp: true },
    { id: 3, symbol: 'HDFCBANK', name: 'HDFC Bank Ltd.', price: 1445.10, change: -1.15, isUp: false },
    { id: 4, symbol: 'INFY', name: 'Infosys Limited', price: 1680.75, change: 2.10, isUp: true },
    { id: 5, symbol: 'ZOMATO', name: 'Zomato Ltd.', price: 185.20, change: -3.40, isUp: false },
    { id: 6, symbol: 'TATAMOTORS', name: 'Tata Motors Ltd.', price: 985.60, change: 4.50, isUp: true },
  ]);

  return (
    <div className="animate-fade-in">
      
      <div className="mb-8 flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold mb-2 text-white">Market Overview</h1>
          <p className="text-slate-400">Discover and trade top performing stocks.</p>
        </div>
        <div className="hidden sm:block">
            <span className="bg-emerald-500/10 text-emerald-400 px-3 py-1 rounded-full text-sm font-semibold border border-emerald-500/20">
                Market Open 🟢
            </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {marketData.map((stock) => (
          <div onClick={() => navigate(`/app/trade/${stock.symbol}`, { state: { price: stock.price } })} 
            key={stock.id} 
            className="bg-slate-900 rounded-xl p-5 border border-slate-800 hover:border-slate-600 transition-all group flex flex-col justify-between"
          >
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-bold text-slate-200 group-hover:text-indigo-400 transition-colors">
                  {stock.symbol}
                </h3>
                <p className="text-xs text-slate-500 font-medium truncate w-32">{stock.name}</p>
              </div>
              
              <div className="text-right">
                <p className="text-xl font-extrabold text-white">₹{stock.price.toFixed(2)}</p>
                <p className={`text-sm font-bold flex items-center justify-end gap-1 ${stock.isUp ? 'text-emerald-400' : 'text-red-400'}`}>
                  {stock.isUp ? (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path></svg>
                  ) : (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 17h8m0 0v-8m0 8l-8-8-4 4-6-6"></path></svg>
                  )}
                  {Math.abs(stock.change)}%
                </p>
              </div>
            </div>

            <div className="flex gap-2 mt-2">
                <button className="flex-1 bg-indigo-600 hover:bg-indigo-500 text-white py-2 rounded-lg text-sm font-bold transition-colors">
                    BUY
                </button>
                <button className="flex-1 bg-slate-800 hover:bg-slate-700 text-slate-300 py-2 rounded-lg text-sm font-bold transition-colors border border-slate-700">
                    SELL
                </button>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}

export default Home;