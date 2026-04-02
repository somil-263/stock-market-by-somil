import React, { useState, useEffect, useMemo, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchPortfolioAPI, sellStockAPI } from '../services/tradeService';
import useBinanceTicker from '../hooks/useBinanceTicker';
import { UserContext } from '../context/UserContext';

function Portfolio() {
  const navigate = useNavigate();
  const [holdings, setHoldings] = useState([]);
  const [localLoading, setLocalLoading] = useState(true);
  const { balance, globalLoading, updateBalanceLocally } = useContext(UserContext);

  const [sellModal, setSellModal] = useState({ isOpen: false, stock: null });
  const [sellQty, setSellQty] = useState(1);
  const [isSelling, setIsSelling] = useState(false);

  useEffect(() => {
    fetchPortfolioAPI().then(data => {
      setHoldings(data.portfolio || []);
    }).catch(console.error).finally(() => setLocalLoading(false));
  }, []);

  const mySymbols = useMemo(() => holdings.map(h => h.stockSymbol), [holdings]);
  const livePrices = useBinanceTicker(mySymbols);

  const stats = useMemo(() => {
    let invested = 0, current = 0;
    holdings.forEach(stock => {
      invested += (stock.quantity * stock.averagePrice);
      const livePrice = livePrices[stock.stockSymbol]?.price || stock.averagePrice;
      current += (stock.quantity * livePrice);
    });
    return { invested, current, totalPnL: current - invested, isProfit: (current - invested) >= 0 };
  }, [holdings, livePrices]);

  const executeDirectSell = async () => {
    if (sellQty <= 0 || sellQty > sellModal.stock.quantity) {
      alert("Invalid Quantity!"); return;
    }
    
    setIsSelling(true);
    const livePrice = livePrices[sellModal.stock.stockSymbol]?.price || sellModal.stock.averagePrice;

    try {
      const result = await sellStockAPI(sellModal.stock.stockSymbol, sellQty, livePrice);
      
      updateBalanceLocally(result.newBalance);
      
      setHoldings(prev => prev.map(h => {
        if (h.stockSymbol === sellModal.stock.stockSymbol) {
          return { ...h, quantity: h.quantity - sellQty };
        }
        return h;
      }).filter(h => h.quantity > 0));

      setSellModal({ isOpen: false, stock: null });
      setSellQty(1);

    } catch (error) {
      alert(`🚨 Error: ${error}`);
    } finally {
      setIsSelling(false);
    }
  };

  if (localLoading || globalLoading) return <div className="text-center mt-20 text-indigo-400 animate-pulse font-bold text-xl">Loading Portfolio Vault...</div>;

  return (
    <div className="max-w-4xl mx-auto pb-24 px-4 relative">
      
      <div className="bg-slate-900 rounded-[2rem] p-8 border border-slate-800/50 mb-8 relative overflow-hidden shadow-2xl backdrop-blur-xl">
        <div className={`absolute -right-20 -top-20 w-64 h-64 rounded-full blur-[100px] opacity-20 transition-colors duration-1000 ${stats.isProfit ? 'bg-emerald-500' : 'bg-red-500'}`}></div>
        
        <div className="flex justify-between items-start mb-6">
          <div>
            <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-2 flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"></path></svg>
              Current Value
            </p>
            <h2 className="text-5xl font-black text-white tracking-tight">${stats.current.toLocaleString('en-US', { minimumFractionDigits: 2 })}</h2>
          </div>
          <div className="text-right bg-slate-950/50 p-3 rounded-2xl border border-slate-800/50">
             <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest mb-1">Available Margin</p>
             <p className="text-xl font-black text-indigo-400">${Number(balance).toLocaleString('en-US', { minimumFractionDigits: 2 })}</p>
          </div>
        </div>

        <div className="flex gap-8 border-t border-slate-800/50 pt-6">
          <div>
            <p className="text-slate-500 text-xs font-bold mb-1 uppercase tracking-wider">Invested</p>
            <p className="text-xl font-bold text-slate-200">${stats.invested.toLocaleString('en-US', { minimumFractionDigits: 2 })}</p>
          </div>
          <div>
            <p className="text-slate-500 text-xs font-bold mb-1 uppercase tracking-wider">Total Returns</p>
            <p className={`text-xl font-black flex items-center gap-1 ${stats.isProfit ? 'text-emerald-400' : 'text-red-400'}`}>
              {stats.isProfit ? '▲' : '▼'} ${Math.abs(stats.totalPnL).toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </p>
          </div>
        </div>
      </div>

      <h3 className="text-xl font-extrabold mb-4 text-white">Your Holdings</h3>
      
      <div className="space-y-3">
        {holdings.length === 0 ? (
           <div className="text-center bg-slate-900/50 rounded-2xl p-10 border border-slate-800 border-dashed text-slate-400 font-medium">No assets in portfolio yet. Start trading!</div>
        ) : (
          holdings.map((stock) => {
            const livePrice = livePrices[stock.stockSymbol]?.price || stock.averagePrice;
            const pnl = (livePrice - stock.averagePrice) * stock.quantity;
            const isUp = pnl >= 0;

            return (
              <div key={stock.id} className="bg-slate-900/80 rounded-2xl p-5 border border-slate-800/50 flex justify-between items-center hover:bg-slate-800 transition-colors group">
                <div 
                  className="cursor-pointer flex-1" 
                  onClick={() => navigate(`/app/trade/${stock.stockSymbol}`)}
                >
                  <h4 className="font-black text-white text-lg tracking-wide">{stock.stockSymbol}</h4>
                  <p className="text-xs text-slate-500 font-medium mt-1">{stock.quantity} Qty • Avg ${Number(stock.averagePrice).toFixed(2)}</p>
                </div>
                
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="font-bold text-slate-200">${livePrice.toLocaleString('en-US', { minimumFractionDigits: 2 })}</p>
                    <p className={`text-xs font-bold mt-1 ${isUp ? 'text-emerald-500' : 'text-red-500'}`}>
                      {isUp ? '+' : '-'}${Math.abs(pnl).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </p>
                  </div>
                  
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      setSellModal({ isOpen: true, stock });
                      setSellQty(stock.quantity);
                    }}
                    className="bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white px-4 py-2 rounded-xl border border-red-500/20 transition-all font-extrabold text-xs tracking-wider"
                  >
                    SELL
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {sellModal.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-slate-900 rounded-3xl p-6 border border-slate-700 shadow-2xl w-full max-w-sm relative">
            
            <button 
              onClick={() => setSellModal({ isOpen: false, stock: null })}
              className="absolute top-4 right-4 text-slate-500 hover:text-white"
            >
              ✕
            </button>

            <h3 className="text-2xl font-black text-white mb-1">Sell {sellModal.stock.stockSymbol}</h3>
            <p className="text-xs text-slate-400 mb-6">Avg Buy: ${Number(sellModal.stock.averagePrice).toFixed(2)}</p>

            <div className="bg-slate-950 p-4 rounded-2xl mb-6 border border-slate-800">
              <div className="flex justify-between items-center mb-3">
                <span className="text-slate-400 text-sm font-medium">Quantity</span>
                <input
                  type="number"
                  min="1"
                  max={sellModal.stock.quantity}
                  value={sellQty}
                  onChange={(e) => setSellQty(e.target.value)}
                  className="bg-transparent text-white font-bold text-xl w-20 text-right focus:outline-none border-b border-slate-700 focus:border-indigo-500"
                />
              </div>
              <p className="text-right text-xs text-slate-500">Max Available: {sellModal.stock.quantity}</p>
            </div>

            <div className="mb-6">
              <p className="text-slate-500 text-xs font-bold uppercase mb-1">Live Profit/Loss on this Trade</p>
              {(() => {
                 const liveP = livePrices[sellModal.stock.stockSymbol]?.price || sellModal.stock.averagePrice;
                 const estimatedPnL = (liveP - sellModal.stock.averagePrice) * sellQty;
                 const isModalUp = estimatedPnL >= 0;
                 return (
                   <p className={`text-2xl font-black ${isModalUp ? 'text-emerald-400' : 'text-red-400'}`}>
                     {isModalUp ? '+' : '-'}${Math.abs(estimatedPnL).toFixed(2)}
                   </p>
                 )
              })()}
            </div>

            <button
              onClick={executeDirectSell}
              disabled={isSelling}
              className="w-full bg-red-600 hover:bg-red-500 text-white font-extrabold py-4 rounded-xl shadow-[0_0_20px_rgba(220,38,38,0.3)] transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50"
            >
              {isSelling ? 'PROCESSING...' : `CONFIRM SELL`}
            </button>
          </div>
        </div>
      )}

    </div>
  );
}

export default Portfolio;