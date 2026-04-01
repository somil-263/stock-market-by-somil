import React, { useState, useMemo } from 'react';

function Portfolio() {
  const [holdings] = useState([
    { id: 1, symbol: 'RELIANCE', name: 'Reliance Industries', qty: 15, avgPrice: 2850.00, currentPrice: 2950.45 },
    { id: 2, symbol: 'ZOMATO', name: 'Zomato Ltd.', qty: 100, avgPrice: 150.50, currentPrice: 185.20 },
    { id: 3, symbol: 'HDFCBANK', name: 'HDFC Bank Ltd.', qty: 25, avgPrice: 1580.00, currentPrice: 1445.10 },
    { id: 4, symbol: 'TCS', name: 'Tata Consultancy', qty: 5, avgPrice: 3900.00, currentPrice: 4120.00 },
  ]);

  const stats = useMemo(() => {
    let invested = 0;
    let current = 0;

    holdings.forEach(stock => {
      invested += (stock.qty * stock.avgPrice);
      current += (stock.qty * stock.currentPrice);
    });

    const totalPnL = current - invested;
    const pnlPercentage = (totalPnL / invested) * 100;
    const isProfit = totalPnL >= 0;

    return { invested, current, totalPnL, pnlPercentage, isProfit };
  }, [holdings]);

  return (
    <div className="animate-fade-in">
      
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-6 text-white">My Portfolio</h1>
        
        <div className="bg-slate-900 rounded-2xl p-6 border border-slate-800 shadow-xl relative overflow-hidden group">
          <div className={`absolute -right-10 -top-10 w-32 h-32 rounded-full blur-3xl transition-all opacity-20 ${stats.isProfit ? 'bg-emerald-500' : 'bg-red-500'}`}></div>
          
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            
            <div className="w-full md:w-auto">
              <p className="text-slate-400 text-sm font-medium mb-1">Current Value</p>
              <h2 className="text-4xl font-extrabold text-white">₹{stats.current.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</h2>
            </div>
            
            <div className="flex w-full md:w-auto gap-8 md:gap-12 border-t md:border-t-0 border-slate-800 pt-4 md:pt-0">
              <div>
                <p className="text-slate-400 text-sm font-medium mb-1">Total Invested</p>
                <p className="text-xl font-bold text-slate-200">₹{stats.invested.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</p>
              </div>
              
              <div className="text-right md:text-left">
                <p className="text-slate-400 text-sm font-medium mb-1">Total Returns</p>
                <div className={`flex items-center gap-1 ${stats.isProfit ? 'text-emerald-400' : 'text-red-400'}`}>
                  {stats.isProfit ? (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path></svg>
                  ) : (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 17h8m0 0v-8m0 8l-8-8-4 4-6-6"></path></svg>
                  )}
                  <p className="text-xl font-bold">₹{Math.abs(stats.totalPnL).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</p>
                </div>
                <p className={`text-xs font-semibold mt-0.5 ${stats.isProfit ? 'text-emerald-500/80' : 'text-red-500/80'}`}>
                  {stats.isProfit ? '+' : '-'}{Math.abs(stats.pnlPercentage).toFixed(2)}%
                </p>
              </div>
            </div>

          </div>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-bold mb-4 text-slate-200 flex items-center justify-between">
          <span>Your Holdings ({holdings.length})</span>
        </h3>
        
        <div className="grid grid-cols-1 gap-3">
          {holdings.map((stock) => {
            const investedValue = stock.qty * stock.avgPrice;
            const currentValue = stock.qty * stock.currentPrice;
            const pnl = currentValue - investedValue;
            const pnlPercent = (pnl / investedValue) * 100;
            const isUp = pnl >= 0;

            return (
              <div key={stock.id} className="bg-slate-900 rounded-xl p-4 border border-slate-800 hover:border-slate-700 transition-colors flex justify-between items-center">
                
                <div>
                  <h4 className="font-bold text-slate-200 text-lg leading-tight">{stock.symbol}</h4>
                  <p className="text-xs text-slate-500 mt-1">{stock.qty} Shares • Avg ₹{stock.avgPrice.toFixed(2)}</p>
                </div>
                
                <div className="text-right">
                  <p className="font-bold text-slate-200">₹{currentValue.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</p>
                  <p className={`text-sm font-semibold mt-0.5 ${isUp ? 'text-emerald-400' : 'text-red-400'}`}>
                    {isUp ? '+' : '-'}₹{Math.abs(pnl).toLocaleString('en-IN', { minimumFractionDigits: 2 })} ({Math.abs(pnlPercent).toFixed(2)}%)
                  </p>
                </div>

              </div>
            )
          })}
        </div>
      </div>

    </div>
  );
}

export default Portfolio;