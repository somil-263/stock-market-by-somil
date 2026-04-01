import React, { useState, useEffect, useMemo } from 'react';
import { fetchPortfolioAPI } from '../services/tradeService';

function Portfolio() {
  const [holdings, setHoldings] = useState([]);
  const [balance, setBalance] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadMyPortfolio = async () => {
      try {
        const data = await fetchPortfolioAPI();
        setBalance(data.currentBalance);
        
        const portfolioWithLivePrices = data.portfolio.map(stock => ({
            ...stock,
            currentPrice: stock.averagePrice * (1 + (Math.random() * 0.1 - 0.03)) // -3% to +7% random change
        }));

        setHoldings(portfolioWithLivePrices);
      } catch (error) {
        console.error("Error fetching portfolio:", error);
      } finally {
        setLoading(false);
      }
    };

    loadMyPortfolio();
  }, []);

  // The Math: Total calculations
  const stats = useMemo(() => {
    let invested = 0;
    let current = 0;

    holdings.forEach(stock => {
      invested += (stock.quantity * stock.averagePrice);
      current += (stock.quantity * stock.currentPrice);
    });

    const totalPnL = current - invested;
    const pnlPercentage = invested > 0 ? (totalPnL / invested) * 100 : 0;
    const isProfit = totalPnL >= 0;

    return { invested, current, totalPnL, pnlPercentage, isProfit };
  }, [holdings]);

  if (loading) {
    return <div className="text-center text-emerald-400 mt-20 font-bold text-xl animate-pulse">Fetching your wealth... 💸</div>;
  }

  return (
    <div className="animate-fade-in">
      
      {/* TOP SUMMARY SECTION */}
      <div className="mb-8">
        <div className="flex justify-between items-end mb-6">
            <h1 className="text-2xl font-bold text-white">My Portfolio</h1>
            <div className="text-right">
                <p className="text-slate-400 text-xs font-medium uppercase tracking-wider">Available Cash</p>
                <p className="text-lg font-bold text-emerald-400">₹{Number(balance).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</p>
            </div>
        </div>
        
        {/* Summary Card */}
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
                  <p className="text-xl font-bold">{stats.isProfit ? '+' : '-'}₹{Math.abs(stats.totalPnL).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</p>
                </div>
                <p className={`text-xs font-semibold mt-0.5 ${stats.isProfit ? 'text-emerald-500/80' : 'text-red-500/80'}`}>
                  {stats.isProfit ? '+' : '-'}{Math.abs(stats.pnlPercentage).toFixed(2)}%
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* HOLDINGS LIST */}
      <div>
        <h3 className="text-lg font-bold mb-4 text-slate-200 flex items-center justify-between">
          <span>Your Holdings ({holdings.length})</span>
        </h3>
        
        {holdings.length === 0 ? (
            <div className="text-center bg-slate-900 rounded-xl p-8 border border-slate-800">
                <p className="text-slate-400 mb-2">You haven't bought any stocks yet.</p>
                <p className="text-emerald-500 font-bold text-sm cursor-pointer hover:underline" onClick={() => window.location.href='/app/home'}>Go to Market to Buy</p>
            </div>
        ) : (
            <div className="grid grid-cols-1 gap-3">
            {holdings.map((stock) => {
                const investedValue = stock.quantity * stock.averagePrice;
                const currentValue = stock.quantity * stock.currentPrice;
                const pnl = currentValue - investedValue;
                const pnlPercent = investedValue > 0 ? (pnl / investedValue) * 100 : 0;
                const isUp = pnl >= 0;

                return (
                <div key={stock.id} className="bg-slate-900 rounded-xl p-4 border border-slate-800 hover:border-slate-700 transition-colors flex justify-between items-center">
                    <div>
                        <h4 className="font-bold text-slate-200 text-lg leading-tight">{stock.stockSymbol}</h4>
                        <p className="text-xs text-slate-500 mt-1">{stock.quantity} Shares • Avg ₹{Number(stock.averagePrice).toFixed(2)}</p>
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
        )}
      </div>

    </div>
  );
}

export default Portfolio;